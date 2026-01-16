/**
 * Npay agent-payments-integration
 * Copyright (c) 2025-present NAVER FINANCIAL Corp.
 * Apache-2.0
 */

import {withCache} from '../../../infrastructure/cache.js'
import {findCategory} from '../config.js'
import {DocumentCategory} from '../types.js'

function cleanPath(path: string): string {
    return path.replace(/^\/+/, '')
}

function resolvePath(category: DocumentCategory, path: string): string {
    const cleanedPath = cleanPath(path)
    if (cleanedPath === 'overview') {
        return cleanPath(category.overview ?? 'llms.txt')
    }
    return cleanedPath
}

function validateContentType(contentType: string | null): boolean {
    if (!contentType) {
        return false
    }
    return ['text/markdown', 'text/plain'].some((type) => contentType.includes(type))
}

async function fetchDocument(category: DocumentCategory, path: string, timeoutMs = 10_000): Promise<string> {
    const url = `${category.baseUrl.replace(/\/+$/, '')}/${path}`
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)
    try {
        const response = await fetch(url, {signal: controller.signal})
        if (response.status === 404) {
            throw new Error('The requested document was not found. Please check the path and try again.')
        }
        if (!response.ok) {
            throw new Error(`Failed to fetch document from ${url} (status: ${response.status})`)
        }
        const contentType = response.headers.get('content-type')
        if (!validateContentType(contentType)) {
            throw new Error(`Failed to fetch document from ${url} (content-type: ${contentType})`)
        }
        return await response.text()
    } catch (err) {
        if ((err as Error).name === 'AbortError') {
            throw new Error('The request timed out. Please try again later.')
        }
        throw err
    } finally {
        clearTimeout(timeout)
    }
}

function stripDomainFromLinks(category: DocumentCategory, content: string): string {
    return content.replaceAll(category.baseUrl, '')
}

export async function readDocument(categoryId: string, path: string): Promise<string> {
    const category = findCategory(categoryId)
    const resolvedPath = resolvePath(category, path)
    const content = await withCache(
        `${categoryId}:${resolvedPath}`,
        () => fetchDocument(category, resolvedPath),
        3_600_000,
    )
    return /^llms.*\.txt$/.test(resolvedPath) ? stripDomainFromLinks(category, content) : content
}
