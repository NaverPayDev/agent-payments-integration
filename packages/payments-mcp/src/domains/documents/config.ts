/**
 * Npay agent-payments-integration
 * Copyright (c) 2025-present NAVER FINANCIAL Corp.
 * Apache-2.0
 */

import config from '../../config/index.js'
import {DocumentCategory} from './types.js'

export const categories: DocumentCategory[] = [
    {
        id: 'developers',
        name: '네이버페이 개발자센터',
        description: '네이버페이 연동 가이드 및 API 문서',
        baseUrl: config.endpoint.developers.docs,
        overview: '/llms.txt',
    },
]

export function findCategory(categoryId: string): DocumentCategory {
    const category = categories.find((c) => c.id === categoryId)
    if (!category) {
        throw new Error('Invalid categoryId. Please check the list of available document categories.')
    }
    return category
}
