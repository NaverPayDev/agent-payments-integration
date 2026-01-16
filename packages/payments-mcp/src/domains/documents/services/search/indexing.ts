/**
 * Npay agent-payments-integration
 * Copyright (c) 2025-present NAVER FINANCIAL Corp.
 * Apache-2.0
 */

import MiniSearch from 'minisearch'

import logger from '../../../../infrastructure/logger.js'
import {readDocument} from '../read.js'
import {tokenize, processTerm} from './tokenize.js'
import {DocumentChunk} from './types.js'

const searchIndexByCategory = new Map<string, MiniSearch<DocumentChunk>>()

function extractTitle(chunk: string): string | null {
    const heading = chunk.match(/^#{1,6}\s*(.+)$/m)
    return heading ? heading[1].trim() : null
}

function splitDocument(text: string): DocumentChunk[] {
    return text
        .split(/\n---\n/)
        .map((chunk) => chunk.trim())
        .slice(1)
        .filter((chunk) => chunk.length > 0)
        .map((chunk, index) => ({
            id: String(index),
            title: extractTitle(chunk) || '',
            text: chunk,
        }))
}

export async function getSearchIndex(categoryId: string): Promise<MiniSearch<DocumentChunk>> {
    if (searchIndexByCategory.has(categoryId)) {
        logger.info(`Search index cache hit: ${categoryId}`)
        return searchIndexByCategory.get(categoryId)!
    }
    const text = await readDocument(categoryId, 'llms-full.txt')
    const documents = splitDocument(text)
    const miniSearch = new MiniSearch<DocumentChunk>({
        fields: ['title', 'text'],
        storeFields: ['text'],
        tokenize,
        processTerm,
        searchOptions: {
            prefix: false,
            combineWith: 'AND',
            boost: {title: 2.0, text: 1.0},
        },
    })
    miniSearch.addAll(documents)
    searchIndexByCategory.set(categoryId, miniSearch)
    logger.info(`Built search index for ${categoryId}: ${documents.length} chunks`)
    return miniSearch
}
