import { defineField, defineType } from 'sanity'

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
            description: 'The main heading displayed at the top of the category listing page.',
        }),
        defineField({
            name: 'intro',
            title: 'Intro Paragraph',
            type: 'text',
            rows: 4,
            group: 'seo',
            description: 'Opening paragraph shown below the H1. Crawled by Google — keep it relevant and keyword-rich.',
        }),
    ],
})
