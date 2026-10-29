import type { SanityClient } from 'sanity'

export const apiVersion = '2025-01-01'

export type SpecLabels = { labels: string[]; from: string }

/**
 * The specification labels a product in this category starts with: the
 * category's own, or else its family's. Null when neither has any.
 */
export async function fetchSpecLabels(client: SanityClient, categoryId: string): Promise<SpecLabels | null> {
    const result = await client.fetch<{
        own: { labels: string[] | null; from: string } | null
        family: { labels: string[] | null; from: string } | null
    } | null>(
        `*[_id == $id][0]{
            "own": { "labels": specLabels, "from": title },
            "family": parent->{ "labels": specLabels, "from": title }
        }`,
        { id: categoryId },
    )
    const pick = [result?.own, result?.family].find((set) => set?.labels?.some((l) => l?.trim()))
    if (!pick?.labels) return null
    return { labels: pick.labels.map((l) => l.trim()).filter(Boolean), from: pick.from }
}
