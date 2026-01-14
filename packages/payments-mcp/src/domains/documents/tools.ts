/**
 * Npay agent-payments-integration
 * Copyright (c) 2025-present NAVER FINANCIAL Corp.
 * Apache-2.0
 */

import {z} from 'zod'

import logger from '../../infrastructure/logger.js'
import {ToolDefinition} from '../../infrastructure/types.js'
import {categories} from './config.js'
import {readDocument} from './services/read.js'
import {searchDocuments} from './services/search/search.js'

const categoryIdSchema = z
    .enum(categories.map((c) => c.id) as [string, ...string[]])
    .describe(
        [
            '조회할 문서가 속한 카테고리의 ID',
            '',
            '**카테고리 목록**',
            '| categoryId | 제목 | 설명 |',
            '|------------|------|------|',
            ...categories.map((category) => `| ${category.id} | ${category.name} | ${category.description} |`),
        ].join('\n'),
    )

const getDocumentInputSchema = z.object({
    categoryId: categoryIdSchema,
    path: z
        .string()
        .optional()
        .default('overview')
        .describe('조회할 문서의 경로 (생략하거나 "overview"로 설정하면 전체 목차 제공)'),
})

const searchDocumentsInputSchema = z.object({
    categoryId: categoryIdSchema,
    query: z.string().describe('검색 키워드'),
    limit: z.number().optional().default(3).describe('최대 결과 수'),
})

export const getDocumentTool: ToolDefinition = {
    name: 'get_document',
    description: {
        title: '네이버페이 문서 조회',
        description: '문서의 목차 또는 특정 문서를 조회할 수 있습니다.',
        inputSchema: getDocumentInputSchema.shape,
    },
    handler: async (input) => {
        const {categoryId, path} = getDocumentInputSchema.parse(input)
        try {
            const text = await readDocument(categoryId, path)
            logger.info(`readDocument succeeded for categoryId: ${categoryId}, path: ${path}, length: ${text.length}`)
            return {
                content: [{type: 'text', text}],
            }
        } catch (err) {
            const error = err as Error
            logger.error(`readDocument failed for categoryId: ${categoryId}, path: ${path}`, error)
            return {
                content: [{type: 'text', text: error.message}],
            }
        }
    },
}

export const searchDocumentsTool: ToolDefinition = {
    name: 'search_documents',
    description: {
        title: '네이버페이 문서 검색',
        description: '키워드로 문서를 검색합니다. 검색 결과는 `get_document`로 제공하는 문서와 동일합니다.',
        inputSchema: searchDocumentsInputSchema.shape,
    },
    handler: async (input) => {
        const {categoryId, query, limit} = searchDocumentsInputSchema.parse(input)
        try {
            const results = await searchDocuments(categoryId, query, limit)
            logger.info(
                `searchDocuments succeeded for categoryId: ${categoryId}, query: ${query}, count: ${results.length}`,
            )
            return {
                content: results.map((result) => ({
                    type: 'text',
                    text: result,
                })),
            }
        } catch (err) {
            const error = err as Error
            logger.error(`searchDocuments failed for categoryId: ${categoryId}, query: ${query}`, error)
            return {
                content: [{type: 'text', text: error.message}],
            }
        }
    },
}
