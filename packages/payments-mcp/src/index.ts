#!/usr/bin/env node
/**
 * Npay agent-payments-integration
 * Copyright (c) 2025-present NAVER FINANCIAL Corp.
 * Apache-2.0
 */

import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js'

import config from './config/index.js'
import logger from './infrastructure/logger.js'
import {createServer} from './infrastructure/server.js'

async function main() {
    logger.info(`⚙️ Application configuration: ${JSON.stringify(config)}`)
    const server = createServer()
    const transport = new StdioServerTransport()
    await server.connect(transport)
    logger.info(`🔌 Npay Payments MCP is running on stdio. (env: ${config.env})`)
}

main().catch((err) => {
    logger.error('❌ Failed to start the MCP server:', err)
    process.exit(1)
})
