import { defineArrayMember, defineField, defineType } from 'sanity'

const apiVersion = '2025-01-01'

/** Published id, so a draft and its published copy count as the same category. */
const publishedId = (id?: string) => id?.replace(/^drafts\./, '')

/**
 * Two levels only: a family (Buttons) and its subcategories (Plastic Buttons).
 * Products go in a subcategory, or in the family itself when it has none.
 */
export const categoryType = defineType({
    name: 'category',
    title: 'Category',
    type: 'document',
    groups: [
        { name: 'content', title: 'Content', default: true },
        { name: 'seo', title: 'SEO' },
    ],
    fields: [
        defineField({
            name: 'title',
            type: 'string',
            group: 'content',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            type: 'slug',
            group: 'content',
            options: { source: 'title' },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'parent',
            title: 'Family',
            type: 'reference',
            group: 'content',
            to: [{ type: 'category' }],
            description:
                'Leave empty for a family such as Buttons. Pick a family to make this a subcategory of it, such as Plastic Buttons under Buttons.',
            options: {
                disableNew: true,
                filter: ({ document }) => ({
                    filter: '!defined(parent) && _id != $self',
                    params: { self: publishedId(document._id) },
                }),
            },
            validation: (rule) =>
                rule.custom(async (ref, { document, getClient }) => {
                    if (!ref?._ref) return true
                    const self = publishedId(document?._id)
                    if (ref._ref === self) return 'A category cannot be its own family.'
                    const { familyHasParent, hasSubcategories } = await getClient({ apiVersion }).fetch(
                        `{
                            "familyHasParent": defined(*[_id == $family][0].parent),
                            "hasSubcategories": count(*[_type == "category" && parent._ref == $self]) > 0
                        }`,
                        { family: ref._ref, self },
                    )
                    if (familyHasParent) return 'Pick a family. A subcategory cannot hold subcategories of its own.'
                    if (hasSubcategories) return 'This category has subcategories, so it has to stay a family.'
                    return true
                }),
        }),
        defineField({
            name: 'tagline',
            type: 'string',
            group: 'content',
            description:
                'One line under the name at the top of the category page and on its tile. Keep it under 70 characters. Leave empty to use the built-in line.',
            validation: (rule) => rule.max(90).warning('Taglines read best under 70 characters.'),
        }),
        defineField({
            name: 'specLabels',
            title: 'Specification labels',
            type: 'array',
            group: 'content',
            of: [defineArrayMember({ type: 'string' })],
            options: { layout: 'tags' },
            description:
                'The rows every new product here starts with, such as Material, Finish and Size. A subcategory without its own uses its family’s.',
        }),
        defineField({
            name: 'heroImage',
            title: 'Hero Image',
            type: 'image',
            group: 'content',
            options: { hotspot: true },
            description:
                'For a family, the large image at the top of its page; a transparent cut-out (PNG) sits best on the grey ground. For a subcategory, the photo on its tile and beside its name. Leave empty to use the built-in studio render.',
            fields: [
                defineField({
                    name: 'alt',
                    title: 'Alternative text',
                    type: 'string',
                    description: 'Describe the object for people who cannot see the image.',
                }),
            ],
        }),
        defineField({
            name: 'highlights',
            title: 'Get to Know Cards',
            type: 'array',
            group: 'content',
            // Only family pages show these cards.
            hidden: ({ document }) => Boolean(document?.parent),
            description:
                'The "Get to know" cards on the family page. Three or four work best. Leave empty to use the built-in cards.',
            validation: (rule) => rule.max(6),
            of: [
                defineArrayMember({
                    type: 'object',
                    name: 'highlight',
                    fields: [
                        defineField({
                            name: 'title',
                            type: 'string',
                            description: 'A short statement, such as "Plated to match."',
                            validation: (rule) => rule.required().max(60),
                        }),
                        defineField({
                            name: 'body',
                            type: 'text',
                            rows: 2,
                            description: 'One sentence that backs the title up.',
                            validation: (rule) => rule.max(160),
                        }),
                        defineField({
                            name: 'image',
                            type: 'image',
                            options: { hotspot: true },
                            description: 'Optional. Without one, the card uses a photo from this category.',
                            fields: [
                                defineField({ name: 'alt', title: 'Alternative text', type: 'string' }),
                            ],
                        }),
                    ],
                    preview: { select: { title: 'title', subtitle: 'body', media: 'image' } },
                }),
            ],
        }),

        // SEO fields
        defineField({
            name: 'metaTitle',
            title: 'Meta Title',
            type: 'string',
            group: 'seo',
            description: 'Appears in the browser tab and Google search headline. Keep under 60 characters.',
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
        defineField({
            name: 'h1',
            title: 'Page Heading (H1)',
            type: 'string',
            group: 'seo',
            description: 'Heading of the about section near the foot of the category page. Keep the search keywords here; the page itself opens with the category name.',
        }),
        defineField({
            name: 'intro',
            title: 'Intro Paragraph',
            type: 'text',
            rows: 4,
            group: 'seo',
            description: 'The paragraph under that heading. Crawled by Google, so keep it relevant and keyword-rich.',
        }),
    ],
    preview: {
        select: { title: 'title', family: 'parent.title', media: 'heroImage' },
        prepare: ({ title, family, media }) => ({
            title,
            subtitle: family ? `in ${family}` : 'Family',
            media,
        }),
    },
})
