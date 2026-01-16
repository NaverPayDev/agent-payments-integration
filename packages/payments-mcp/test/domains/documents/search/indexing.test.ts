/**
 * Npay agent-payments-integration
 * Copyright (c) 2025-present NAVER FINANCIAL Corp.
 * Apache-2.0
 */

import {describe, it, expect} from 'vitest'

import {getSearchIndex} from '../../../../src/domains/documents/services/search/indexing.js'

describe('indexes', () => {
    const categoryId = 'developers'

    describe('getSearchIndex()', () => {
        describe('Chunk에 Heading이 없을 때', () => {
            it('타이틀 없이 인덱싱한다', async () => {
                const index = await getSearchIndex(categoryId)

                const result = index.search('헤딩 없는 문서')

                expect(result[0].text).toEqual('헤딩 없는 문서')
            })
        })

        it('검색 인덱스를 캐싱한다', async () => {
            const cached = await getSearchIndex(categoryId)
            const reloaded = await getSearchIndex(categoryId)

            expect(reloaded).toBe(cached)
        })
    })
})
