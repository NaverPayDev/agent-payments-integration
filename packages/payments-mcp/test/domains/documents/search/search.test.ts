/**
 * Npay agent-payments-integration
 * Copyright (c) 2025-present NAVER FINANCIAL Corp.
 * Apache-2.0
 */

import {describe, it, expect} from 'vitest'

import {searchDocuments} from '../../../../src/domains/documents/services/search/search.js'

describe('search', () => {
    describe('searchDocuments()', () => {
        const categoryId = 'developers'

        describe('존재하지 않는 categoryId일 때', () => {
            it('Error를 던진다', async () => {
                await expect(searchDocuments('invalid-id', '네이버 페이', 3)).rejects.toThrowError(
                    'Invalid categoryId. Please check the list of available document categories.',
                )
            })
        })

        describe('query가 빈 문자열일 때', () => {
            it('빈 배열을 반환한다', async () => {
                const results = await searchDocuments(categoryId, '')

                expect(results).toHaveLength(0)
            })
        })

        it('첫 페이지는 인덱싱에서 제외한다', async () => {
            const results = await searchDocuments(categoryId, 'NaverPay Developer center')

            expect(results).toHaveLength(0)
        })

        it('최대 limit 만큼 검색 결과를 반환한다', async () => {
            const limit = 3
            const results = await searchDocuments(categoryId, '네이버 페이', limit)

            expect(results.length).toBeLessThanOrEqual(limit)
            expect(results[0]).toContain('# API URL 형식')
            expect(results[1]).toContain('# 인증')
            expect(results[2]).toContain('# 방화벽')
        })
    })
})
