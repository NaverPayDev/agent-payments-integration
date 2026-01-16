/**
 * Npay agent-payments-integration
 * Copyright (c) 2025-present NAVER FINANCIAL Corp.
 * Apache-2.0
 */

import config from '../config/index.js'
import {LogLevel, LoggerOptions, Logger} from './types.js'

function errorMessage(error: Error): string {
    return `${error.name}: ${error.message}${error.stack ? '\n' + error.stack : ''}`
}

export function createLogger({name, stream}: LoggerOptions): Logger {
    const pid = process.pid
    const log = (level: LogLevel, message: string, error?: Error): void => {
        const os = stream === 'stdout' ? process.stdout : process.stderr
        const time = new Date().toLocaleTimeString('ko-KR', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            fractionalSecondDigits: 3,
        })
        let logMessage = message
        if (error) {
            logMessage = `${message}\n${errorMessage(error)}`
        }
        os.write(`[${time}] ${level} (${name}/${pid}): ${logMessage}\n`)
    }

    return {
        info: (message: string) => log('INFO', message),
        warn: (message: string) => log('WARN', message),
        error: (message: string, error?: Error) => log('ERROR', message, error),
        debug: (message: string) => log('DEBUG', message),
    }
}

export default createLogger(config.logger)
