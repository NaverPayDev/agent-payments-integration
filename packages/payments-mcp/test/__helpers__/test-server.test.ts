/**
 * Npay agent-payments-integration
 * Copyright (c) 2025-present NAVER FINANCIAL Corp.
 * Apache-2.0
 */

import {describe, it, expect} from 'vitest'

describe('TestServer', () => {
    describe('static', () => {
        describe('파일이 존재하면', () => {
            it('파일을 응답한다', async () => {
                const response = await fetch(`http://localhost:3001/developers/llms.txt`)
                const content = await response.text()

                expect(response.status).toEqual(200)
                expect(content).toContain('#')
            })
        })

        describe('파일이 존재하지 않으면', () => {
            it('404 코드를 응답한다', async () => {
                const response = await fetch(`http://localhost:3001/developers/not-found.txt`)
                const content = await response.text()

                expect(response.status).toEqual(404)
                expect(content).toContain('Cannot GET /developers/not-found.txt')
            })
        })
    })

    describe('/error.md', () => {
        it('500 코드를 응답한다', async () => {
            const response = await fetch(`http://localhost:3001/developers/error.md`)
            const content = await response.text()

            expect(response.status).toEqual(500)
            expect(content).toContain('Internal Server Error')
        })
    })

    describe('/timeout.md', () => {
        it('지연 후 응답한다', async () => {
            const start = Date.now()
            const response = await fetch('http://localhost:3001/developers/timeout.md?ms=500')
            const elapsed = Date.now() - start
            const content = await response.text()

            expect(response.status).toEqual(200)
            expect(content).toEqual('Responded after 500ms')
            expect(elapsed).toBeGreaterThanOrEqual(500)
        })
    })

    describe('/index', () => {
        it('html 페이지를 응답한다', async () => {
            const response = await fetch(`http://localhost:3001/developers/index`)
            const content = await response.text()

            expect(response.status).toEqual(200)
            expect(content).toContain('<html>')
            expect(content).toContain('</html>')
            expect(content).toContain('<title>')
            expect(response.headers.get('content-type')).toContain('text/html')
        })
    })
})
