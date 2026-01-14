/**
 * Npay agent-payments-integration
 * Copyright (c) 2025-present NAVER FINANCIAL Corp.
 * Apache-2.0
 */

import {CallToolResult} from '@modelcontextprotocol/sdk/types.js'
import {z} from 'zod'

export interface ToolDefinition {
    readonly name: string
    readonly description: {
        readonly title?: string
        readonly description?: string
        readonly inputSchema?: z.ZodRawShape
        readonly outputSchema?: z.ZodRawShape
    }
    readonly handler: (input: Record<string, unknown>) => CallToolResult | Promise<CallToolResult>
}

export interface CacheItem<T = unknown> {
    readonly data: T
    readonly expires: number
}

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'

type LogStream = 'stderr' | 'stdout'

export interface LoggerOptions {
    readonly name: string
    readonly stream: LogStream
}

export interface Logger {
    readonly info: (message: string, error?: Error) => void
    readonly warn: (message: string, error?: Error) => void
    readonly error: (message: string, error?: Error) => void
    readonly debug: (message: string, error?: Error) => void
}
