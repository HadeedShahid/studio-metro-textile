import { defineField, defineType } from 'sanity'

export const categoryType = defineType({
    name: 'category',
    title: 'Category',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            type: 'slug',
            options: { source: 'title' },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'parent',
            title: 'Parent Category',
            type: 'reference',
            to: [{ type: 'category' }],
            description: 'Select the parent category if this is a sub-category.',
        }),
        defineField({
            name: 'specificationTemplate',
            title: 'Specification Template',
            type: 'reference',
            to: [{ type: 'specificationTemplate' }],
            description: 'Define a set of reusable specification labels for all products in this category.',
        }),
    ],
})
