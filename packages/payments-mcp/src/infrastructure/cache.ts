/**
 * Npay agent-payments-integration
 * Copyright (c) 2025-present NAVER FINANCIAL Corp.
 * Apache-2.0
 */

import logger from './logger.js'
import {CacheItem} from './types.js'

const cache = new Map<string, CacheItem>()
const MAX_CACHE_SIZE = 100

function getCachedData<T>(key: string): T | null {
    const cached = cache.get(key) as CacheItem<T> | undefined
    return cached && Date.now() < cached.expires ? cached.data : null
}

function setCacheData<T>(key: string, data: T, ttlMs: number): void {
    cache.delete(key)
    cache.set(key, {
        data,
        expires: Date.now() + ttlMs,
    })
}

function evict(): void {
    if (cache.size >= MAX_CACHE_SIZE) {
        const firstKey = cache.keys().next().value
        if (firstKey) {
            cache.delete(firstKey)
        }
    }
}

export async function withCache<T>(key: string, fetcher: () => Promise<T>, ttlMs: number = 300_000): Promise<T> {
    const cachedData = getCachedData<T>(key)
    if (cachedData !== null) {
        logger.info(`Cache hit: ${key}`)
        return cachedData
    }
    logger.info(`Cache miss: ${key}`)
    evict()
    const data = await fetcher()
    setCacheData(key, data, ttlMs)
    return data
}

export function clearCache(): void {
    cache.clear()
}
