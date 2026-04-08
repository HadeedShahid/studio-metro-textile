import { defineField, defineType } from 'sanity'

export const specificationTemplateType = defineType({
    name: 'specificationTemplate',
    title: 'Specification Template',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Template Name',
            type: 'string',
            description: 'Example: Zipper Specifications, Fabric Specifications',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'fields',
            title: 'Specification Labels',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'The labels that will appear in the grid (e.g., Material, Coating, Teeth Type)',
            validation: (rule) => rule.required().min(1),
        }),
    ],
})
