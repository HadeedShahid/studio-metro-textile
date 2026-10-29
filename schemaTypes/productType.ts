import { defineArrayMember, defineField, defineType } from 'sanity'
import { SpecificationsInput } from '../components/SpecificationsInput'
import { apiVersion } from '../lib/specLabels'

export const productType = defineType({
    name: 'product',
    title: 'Product',
    type: 'document',
    groups: [
        { name: 'product', title: 'Product', default: true },
        { name: 'seo', title: 'SEO' },
    ],
    fields: [
        defineField({
            name: 'title',
            type: 'string',
            group: 'product',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            type: 'slug',
            group: 'product',
            options: { source: 'title' },
            description: 'The web address of the product page. Press Generate after typing the title.',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'category',
            type: 'reference',
            group: 'product',
            to: [{ type: 'category' }],
            description: 'A subcategory such as Plastic Buttons, or a family such as Plates when it has no subcategories.',
            options: {
                disableNew: true,
                // Only categories with no subcategories hold products.
                filter: 'count(*[_type == "category" && parent._ref == ^._id]) == 0',
            },
            validation: (rule) =>
                rule.required().custom(async (ref, { getClient }) => {
                    if (!ref?._ref) return true
                    const hasSubcategories = await getClient({ apiVersion }).fetch(
                        'count(*[_type == "category" && parent._ref == $id]) > 0',
                        { id: ref._ref },
                    )
                    return hasSubcategories ? 'This family has subcategories. Pick one of them instead.' : true
                }),
        }),
        defineField({
            name: 'images',
            type: 'array',
            group: 'product',
            of: [{ type: 'image' }],
            options: { layout: 'grid' },
            description: 'The first image leads the product tile and page. Drag to reorder.',
            validation: (rule) => rule.required().min(1),
        }),
        defineField({
            name: 'description',
            type: 'array',
            group: 'product',
            of: [{ type: 'block' }],
        }),
        defineField({
            name: 'specifications',
            title: 'Specifications',
            type: 'array',
            group: 'product',
            components: { input: SpecificationsInput },
            description: 'Rows left without a value are not shown on the site.',
            of: [
                defineArrayMember({
                    type: 'object',
                    fields: [
                        defineField({ name: 'label', title: 'Label', type: 'string' }),
                        defineField({ name: 'value', title: 'Value', type: 'string' }),
                    ],
                    preview: { select: { title: 'label', subtitle: 'value' } },
                }),
            ],
        }),
        defineField({
            name: 'isFeatured',
            title: 'Featured',
            type: 'boolean',
            group: 'product',
            description: 'Marks the product as featured on its tile.',
            initialValue: false,
        }),

        // SEO fields
        defineField({
            name: 'metaTitle',
            title: 'Meta Title',
            type: 'string',
            group: 'seo',
            description: 'Appears in the browser tab and Google search headline. Keep under 60 characters. Leave blank to auto-generate from product title.',
            validation: (rule) => rule.max(60).warning('Meta title should be under 60 characters.'),
        }),
        defineField({
            name: 'metaDescription',
            title: 'Meta Description',
            type: 'text',
            rows: 3,
            group: 'seo',
            description: 'Shown as the snippet in Google search results. Keep under 155 characters.',
            validation: (rule) => rule.max(155).warning('Meta description should be under 155 characters.'),
        }),
    ],
    preview: {
        select: { title: 'title', category: 'category.title', family: 'category.parent.title', media: 'images.0' },
        prepare: ({ title, category, family, media }) => ({
            title,
            subtitle: [family, category].filter(Boolean).join(' › '),
            media,
        }),
    },
})
