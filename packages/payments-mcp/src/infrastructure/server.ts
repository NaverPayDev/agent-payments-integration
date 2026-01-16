/**
 * Npay agent-payments-integration
 * Copyright (c) 2025-present NAVER FINANCIAL Corp.
 * Apache-2.0
 */

import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js'

import config from '../config/index.js'
import {getDocumentTool, searchDocumentsTool} from '../domains/documents/tools.js'
import {ToolDefinition} from './types.js'

const tools: ToolDefinition[] = [getDocumentTool, searchDocumentsTool]

function registerTools(server: McpServer) {
    tools.forEach(({name, description, handler}) => {
        server.registerTool(name, description, handler)
    })
}

export function createServer(): McpServer {
    const server = new McpServer({
        name: config.server.name,
        version: config.server.version,
    })
    registerTools(server)
    return server
}
