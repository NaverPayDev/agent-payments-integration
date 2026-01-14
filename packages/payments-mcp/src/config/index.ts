/**
 * Npay agent-payments-integration
 * Copyright (c) 2025-present NAVER FINANCIAL Corp.
 * Apache-2.0
 */

import packageJson from '../../package.json' with {type: 'json'}
import {AppConfig, Environment} from './types.js'

function env(key: string) {
    return process.env[key]
}

const config: AppConfig = {
    env: (env('NODE_ENV') as Environment) || 'production',
    server: {
        name: '네이버페이(Npay) Payments MCP',
        version: packageJson.version,
    },
    logger: {
        name: '@naverpay/payments-mcp',
        stream: 'stderr',
    },
    endpoint: {
        developers: {
            docs: env('NPAY_DEVELOPERS_DOCS_URL') || 'https://docs.pay.naver.com',
        },
    },
}

export default config
