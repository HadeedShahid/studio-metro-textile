import { defineArrayMember, defineField, defineType } from 'sanity'

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
            name: 'image',
            title: 'Catalog Image',
            type: 'image',
            group: 'content',
            options: { hotspot: true },
            description: 'Shown in the Product Catalog carousel on the homepage.',
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
            name: 'heroImage',
            title: 'Hero Image',
            type: 'image',
            group: 'content',
            options: { hotspot: true },
            description:
                'For a top-level category, the large image at the top of its page; a transparent cut-out (PNG) sits best on the grey ground. For a sub-category, the photo on its tile and beside its name. Leave empty to use the built-in studio render.',
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
            description:
                'The "Get to know" cards on a top-level category page. Three or four work best. Leave empty to use the built-in cards.',
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
        defineField({
            name: 'parent',
            title: 'Parent Category',
            type: 'reference',
            group: 'content',
            to: [{ type: 'category' }],
            description: 'Select the parent category if this is a sub-category.',
        }),
        defineField({
            name: 'specificationTemplate',
            title: 'Specification Template',
            type: 'reference',
            group: 'content',
            to: [{ type: 'specificationTemplate' }],
            description: 'Define a set of reusable specification labels for all products in this category.',
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
})
