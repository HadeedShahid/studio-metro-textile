import { defineArrayMember, defineField, defineType } from 'sanity'
import { SpecificationGrid } from '../components/SpecificationGrid'

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
        defineField({
            name: 'specificationTemplate',
            title: 'Specification Template Override',
            type: 'reference',
            to: [{ type: 'specificationTemplate' }],
            description: 'Optionally override the specification template defined at the category level.',
        }),
        defineField({
            name: 'specifications',
            title: 'Specifications',
            type: 'array',
            components: {
                input: SpecificationGrid
            },
            description: 'Add specifications for this product. Please follow the labels defined in the assigned Specification Template (from category or override) for consistency.',
            of: [
                defineArrayMember({
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'label',
                            title: 'Label',
                            type: 'string',
                        }),
                        defineField({
                            name: 'value',
                            title: 'Value',
                            type: 'string',
                        }),
                    ],
                    preview: {
                        select: {
                            title: 'label',
                            subtitle: 'value',
                        },
                    },
                }),
            ],
        }),
    ],
})
