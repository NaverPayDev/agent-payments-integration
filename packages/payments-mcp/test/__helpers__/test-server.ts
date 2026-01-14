/**
 * Npay agent-payments-integration
 * Copyright (c) 2025-present NAVER FINANCIAL Corp.
 * Apache-2.0
 */

import {Server} from 'http'
import path from 'path'
import {fileURLToPath} from 'url'

import express from 'express'

import logger from './logger.js'
import {TestServer} from './types.js'

const currentDir = path.dirname(fileURLToPath(import.meta.url))

function createExpressApp() {
    const app = express()
    app.use((req, res, next) => {
        const start = Date.now()
        res.on('finish', () => {
            const duration = Date.now() - start
            logger.info(`[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`)
        })
        next()
    })
    const fixturesPath = path.resolve(currentDir, '../__fixtures__')
    app.use(express.static(fixturesPath))
    app.get(/.*\/index$/, (_, res) => {
        res.setHeader('content-type', 'text/html')
        res.send('<html><head><title>Document</title></head><body></body></html>')
    })
    app.get(/.*\/error\.md$/, (_, res) => {
        res.status(500).send('Internal Server Error')
    })
    app.get(/.*\/timeout\.md$/, async (req, res) => {
        const ms = parseInt(req.query.ms as string) || 11_000
        await new Promise((resolve) => setTimeout(resolve, ms))
        res.status(200).send(`Responded after ${ms}ms`)
    })
    return app
}

function startServer(app: express.Application, port: number): Promise<Server> {
    return new Promise((resolve, reject) => {
        const server = app.listen(port, () => {
            logger.info(`📂 Test server is running on port ${port}`)
            resolve(server)
        })

        server.on('error', (error: NodeJS.ErrnoException) => {
            if (error.code === 'EADDRINUSE') {
                reject(new Error(`Port ${port} is already in use`))
            } else {
                reject(error)
            }
        })
    })
}

function stopServer(server: Server): Promise<void> {
    return new Promise((resolve) => {
        server.close(() => {
            logger.info('🛑 Test server stopped')
            resolve()
        })
    })
}

export function createTestServer(port: number = 3001): TestServer {
    let server: Server | null = null

    return {
        async start() {
            if (!server) {
                const app = createExpressApp()
                server = await startServer(app, port)
            }
        },
        async stop() {
            if (server) {
                await stopServer(server)
                server = null
            }
        },
    }
}
