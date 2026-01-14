/**
 * Npay agent-payments-integration
 * Copyright (c) 2025-present NAVER FINANCIAL Corp.
 * Apache-2.0
 */

import {createTestServer} from './__helpers__/test-server.js'

export default async function setup() {
    process.env.NODE_ENV = 'development'
    process.env.NPAY_DEVELOPERS_DOCS_URL = 'http://localhost:3001/developers'

    const testServer = createTestServer()
    await testServer.start()

    return async () => {
        await testServer.stop()
    }
}
