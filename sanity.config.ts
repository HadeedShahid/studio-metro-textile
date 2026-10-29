import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {randomKey} from '@sanity/util/content'
import type {InitialValueResolverContext} from '@sanity/types'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {apiVersion, fetchSpecLabels} from './lib/specLabels'

export default defineConfig({
  name: 'default',
  title: 'metro-textile',

  projectId: 'qrdka284',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev,
      {
        // Used by "Products by category": the new product starts in that
        // category with a row for each of its specification labels.
        id: 'product-in-category',
        title: 'Product in category',
        schemaType: 'product',
        parameters: [{name: 'categoryId', type: 'string'}],
        value: async ({categoryId}: {categoryId: string}, {getClient}: InitialValueResolverContext) => {
          const expected = await fetchSpecLabels(getClient({apiVersion}), categoryId)
          return {
            category: {_type: 'reference', _ref: categoryId},
            specifications: (expected?.labels ?? []).map((label) => ({_key: randomKey(12), label})),
          }
        },
      },
    ],
  },

  document: {
    // The category template needs a category, so it only appears inside one.
    newDocumentOptions: (prev, {creationContext}) =>
      creationContext.type === 'global'
        ? prev.filter((item) => item.templateId !== 'product-in-category')
        : prev,
  },
})
