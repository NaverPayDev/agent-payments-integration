/**
 * Npay agent-payments-integration
 * Copyright (c) 2025-present NAVER FINANCIAL Corp.
 * Apache-2.0
 */

import {getSearchIndex} from './indexing.js'

export async function searchDocuments(categoryId: string, query: string, limit: number = 3): Promise<string[]> {
    const searchIndex = await getSearchIndex(categoryId)
    const results = searchIndex.search(query)
    return results.slice(0, limit).map((result) => result.text)
}
