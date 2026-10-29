import type { StructureResolver } from 'sanity/structure'
import { BookIcon, DocumentsIcon, FolderIcon, TagsIcon } from '@sanity/icons'
import { apiVersion } from './lib/specLabels'

/** Categories that hold products: subcategories, and families with none. */
const PRODUCT_CATEGORIES = '_type == "category" && count(*[_type == "category" && parent._ref == ^._id]) == 0'

/**
 * Products first, filed by category, so adding one is: pick the category, press
 * the pencil. The new product arrives with its category and specification rows
 * already filled in.
 */
export const structure: StructureResolver = (S) =>
    S.list()
        .title('Content')
        .items([
            S.listItem()
                .title('Products by category')
                .icon(FolderIcon)
                .child(
                    S.documentList()
                        .title('Products by category')
                        .apiVersion(apiVersion)
                        .filter(PRODUCT_CATEGORIES)
                        .defaultOrdering([{ field: 'title', direction: 'asc' }])
                        .canHandleIntent(() => false)
                        .child((categoryId) =>
                            S.documentList()
                                .title('Products')
                                .apiVersion(apiVersion)
                                .schemaType('product')
                                .filter('_type == "product" && category._ref == $categoryId')
                                .params({ categoryId })
                                .defaultOrdering([{ field: 'title', direction: 'asc' }])
                                .initialValueTemplates([
                                    S.initialValueTemplateItem('product-in-category', { categoryId }),
                                ]),
                        ),
                ),
            S.documentTypeListItem('product').title('All products').icon(DocumentsIcon),
            S.divider(),
            S.documentTypeListItem('category').title('Categories').icon(TagsIcon),
            S.documentTypeListItem('post').title('Journal').icon(BookIcon),
        ])
