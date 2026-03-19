import { defineField, defineType } from 'sanity'

export const productType = defineType({
    name: 'product',
    title: 'Product',
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
            name: 'images',
            type: 'array',
            of: [{ type: 'image' }],
            validation: (rule) => rule.required().min(1),
        }),
        defineField({
            name: 'category',
            type: 'reference',
            to: [{ type: 'category' }],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'isFeatured',
            title: 'Is Featured?',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'isPopular',
            title: 'Is Popular?',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'description',
            type: 'array',
            of: [{ type: 'block' }],
        }),
    ],
})
