/**
 * Brings existing content in line with the simplified schema (October 2026):
 *
 *   1. Specification templates become labels on the category itself
 *      (specificationTemplate -> specLabels), drafts included.
 *   2. Products drop the old template override and the unused "Is Popular?" flag.
 *   3. A product filed on a family that has subcategories moves into the
 *      subcategory when there is exactly one; otherwise it is only reported.
 *   4. A category that names itself as its family loses that link.
 *
 * Dry run by default; pass --apply to write. Drafts stay drafts: nothing is published.
 *
 *   npx sanity exec scripts/simplify-categories.ts --with-user-token
 *   npx sanity exec scripts/simplify-categories.ts --with-user-token -- --apply
 */
import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2025-01-01' })
const apply = process.argv.includes('--apply')
const publishedId = (id: string) => id.replace(/^drafts\./, '')

type Patch = { id: string; why: string; set?: Record<string, unknown>; unset?: string[] }

async function run() {
  const data = await client.fetch<{
    categories: { _id: string; title: string; parent?: { _ref: string }; specificationTemplate?: { _ref: string }; specLabels?: string[] }[]
    templates: { _id: string; title: string; fields?: string[] }[]
    products: { _id: string; title: string; category?: { _ref: string }; specificationTemplate?: unknown; isPopular?: unknown }[]
  }>(`{
    "categories": *[_type == "category"]{ _id, title, parent, specificationTemplate, specLabels },
    "templates": *[_type == "specificationTemplate"]{ _id, title, fields },
    "products": *[_type == "product"]{ _id, title, category, specificationTemplate, isPopular }
  }`)

  const templates = new Map(data.templates.map((t) => [t._id, t]))
  const subcategoriesOf = (familyId: string) =>
    data.categories.filter((c) => !c._id.startsWith('drafts.') && c.parent?._ref === familyId)
  const patches: Patch[] = []

  for (const category of data.categories) {
    const set: Record<string, unknown> = {}
    const unset: string[] = []
    const why: string[] = []
    if (category.specificationTemplate) {
      const template = templates.get(category.specificationTemplate._ref)
      if (template?.fields?.length && !category.specLabels?.length) set.specLabels = template.fields
      unset.push('specificationTemplate')
      why.push(`labels from "${template?.title ?? 'missing template'}": ${template?.fields?.join(', ') ?? 'none'}`)
    }
    if (category.parent?._ref === publishedId(category._id)) {
      unset.push('parent')
      why.push('was its own family')
    }
    if (why.length) patches.push({ id: category._id, why: `${category.title}: ${why.join('; ')}`, set, unset })
  }

  for (const product of data.products) {
    const set: Record<string, unknown> = {}
    const unset: string[] = []
    const why: string[] = []
    if (product.specificationTemplate != null) unset.push('specificationTemplate')
    if (product.isPopular != null) unset.push('isPopular')
    const categoryId = product.category?._ref
    const subcategories = categoryId ? subcategoriesOf(categoryId) : []
    if (subcategories.length === 1) {
      set.category = { _type: 'reference', _ref: subcategories[0]._id }
      why.push(`moved into ${subcategories[0].title}`)
    } else if (subcategories.length > 1) {
      console.warn(`! ${product.title} sits on a family with ${subcategories.length} subcategories; move it by hand.`)
    }
    if (unset.length || why.length) {
      patches.push({ id: product._id, why: `${product.title}: ${[...why, unset.length ? `unset ${unset.join(', ')}` : ''].filter(Boolean).join('; ')}`, set, unset })
    }
  }

  for (const patch of patches) console.log(`${patch.id.startsWith('drafts.') ? '[draft] ' : ''}${patch.why}`)
  console.log(`\n${patches.length} documents to patch.`)
  if (data.templates.length) {
    console.log(`Left in place, no longer shown in the Studio: ${data.templates.map((t) => `${t.title} (${t._id})`).join(', ')}`)
  }

  if (!apply) {
    console.log('Dry run. Re-run with -- --apply to write.')
    return
  }
  const tx = client.transaction()
  for (const { id, set, unset } of patches) {
    tx.patch(id, (p) => {
      let next = p
      if (set && Object.keys(set).length) next = next.set(set)
      if (unset?.length) next = next.unset(unset)
      return next
    })
  }
  const result = await tx.commit()
  console.log(`Applied in transaction ${result.transactionId}.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
