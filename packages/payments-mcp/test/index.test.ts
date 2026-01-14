/**
 * Npay agent-payments-integration
 * Copyright (c) 2025-present NAVER FINANCIAL Corp.
 * Apache-2.0
 */

import {mkdir, writeFile, rm} from 'fs/promises'
import path from 'path'
import {fileURLToPath} from 'url'

import {Client} from '@modelcontextprotocol/sdk/client/index.js'
import {InMemoryTransport} from '@modelcontextprotocol/sdk/inMemory.js'
import {CallToolResult} from '@modelcontextprotocol/sdk/types.js'
import {describe, it, expect, beforeEach, beforeAll, afterAll} from 'vitest'

import {createServer} from '../src/infrastructure/server.js'

const currentDir = path.dirname(fileURLToPath(import.meta.url))

describe('payments-mcp', () => {
    const client = new Client({
        name: 'Npay-MCP-Client',
        version: '1.0.0',
    })

    beforeAll(async () => {
        const server = createServer()
        const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
        await Promise.all([client.connect(clientTransport), server.connect(serverTransport)])
    })

    afterAll(async () => {
        await client.close()
    })

    describe('Tools', () => {
        describe('listTools()', () => {
            it('제공하는 Tool 목록을 반환한다', async () => {
                const {tools} = await client.listTools()

                const getDocumentTool = tools.find((t) => t.name === 'get_document')

                expect(getDocumentTool).toBeDefined()
                expect(getDocumentTool!.title).toEqual('네이버페이 문서 조회')
                expect(getDocumentTool!.description).toContain('문서의 목차 또는 특정 문서를 조회할 수 있습니다.')
                expect(getDocumentTool!.inputSchema.properties).toHaveProperty('categoryId')
                expect(getDocumentTool!.inputSchema.properties).toHaveProperty('path')
                expect(getDocumentTool!.inputSchema.required).toEqual(['categoryId'])

                const searchDocumentsTool = tools.find((t) => t.name === 'search_documents')

                expect(searchDocumentsTool).toBeDefined()
                expect(searchDocumentsTool!.title).toEqual('네이버페이 문서 검색')
                expect(searchDocumentsTool!.description).toContain(
                    '키워드로 문서를 검색합니다. 검색 결과는 `get_document`로 제공하는 문서와 동일합니다.',
                )
                expect(searchDocumentsTool!.inputSchema.properties).toHaveProperty('categoryId')
                expect(searchDocumentsTool!.inputSchema.properties).toHaveProperty('query')
                expect(searchDocumentsTool!.inputSchema.properties).toHaveProperty('limit')
                expect(searchDocumentsTool!.inputSchema.required).toEqual(['categoryId', 'query'])
            })
        })

        describe('callTool()', () => {
            describe('get_document()', () => {
                describe('categoryId가 잘못된 값이라면', () => {
                    it('에러를 응답한다', async () => {
                        const result = (await client.callTool({
                            name: 'get_document',
                            arguments: {
                                categoryId: 'invalid-id',
                            },
                        })) as CallToolResult

                        const response = result.content[0]

                        expect(result.isError).toBe(true)
                        expect(response.type).toEqual('text')
                        if (response.type === 'text') {
                            expect(response.text).toContain('Input validation error')
                        }
                    })
                })

                describe('path를 지정하지 않는다면', () => {
                    it('`llms.txt`를 조회한다', async () => {
                        const result = await client.callTool({
                            name: 'get_document',
                            arguments: {
                                categoryId: 'developers',
                            },
                        })

                        const {content} = result as CallToolResult
                        const response = content[0]

                        expect(response.type).toEqual('text')
                        if (response.type === 'text') {
                            expect(response.text).toContain('# NaverPay Developer center')
                            expect(response.text).toContain('](/docs/common/authentication.md)')
                        }
                    })
                })

                describe('path를 지정한다면', () => {
                    describe('존재하지 않는 문서일 때', () => {
                        it('path를 확인하라는 메시지를 응답한다', async () => {
                            const result = await client.callTool({
                                name: 'get_document',
                                arguments: {
                                    categoryId: 'developers',
                                    path: '/this/path/does/not/exist.md',
                                },
                            })

                            const {content} = result as CallToolResult
                            const response = content[0]

                            expect(response.type).toEqual('text')
                            if (response.type === 'text') {
                                expect(response.text).toEqual(
                                    'The requested document was not found. Please check the path and try again.',
                                )
                            }
                        })
                    })

                    describe('응답이 text, markdown 문서가 아닐 때', () => {
                        it('오류 메시지를 응답한다', async () => {
                            const result = await client.callTool({
                                name: 'get_document',
                                arguments: {
                                    categoryId: 'developers',
                                    path: '/index',
                                },
                            })

                            const {content} = result as CallToolResult
                            const response = content[0]

                            expect(response.type).toEqual('text')
                            if (response.type === 'text') {
                                expect(response.text).toMatch(
                                    /Failed to fetch document from .* \(content-type: text\/html; charset=utf-8\)/,
                                )
                            }
                        })
                    })

                    it('해당 문서를 응답한다', async () => {
                        const result = await client.callTool({
                            name: 'get_document',
                            arguments: {
                                categoryId: 'developers',
                                path: '/docs/common/authentication.md',
                            },
                        })

                        const {content} = result as CallToolResult
                        const response = content[0]

                        expect(response.type).toEqual('text')
                        if (response.type === 'text') {
                            expect(response.text).toContain('# 인증')
                        }
                    })
                })

                describe('문서 제공 서버에 문제가 생겼을 때', () => {
                    it('오류 메시지를 응답한다', async () => {
                        const result = await client.callTool({
                            name: 'get_document',
                            arguments: {
                                categoryId: 'developers',
                                path: '/error.md',
                            },
                        })

                        const {content} = result as CallToolResult
                        const response = content[0]

                        expect(response.type).toEqual('text')
                        if (response.type === 'text') {
                            expect(response.text).toMatch(/Failed to fetch document from .* \(status: 500\)/)
                        }
                    })
                })

                describe('서버 응답 지연 시', () => {
                    it('타임아웃 오류 메시지를 응답한다', async () => {
                        const result = await client.callTool({
                            name: 'get_document',
                            arguments: {
                                categoryId: 'developers',
                                path: '/timeout.md',
                            },
                        })

                        const {content} = result as CallToolResult
                        const response = content[0]

                        expect(response.type).toEqual('text')
                        if (response.type === 'text') {
                            expect(response.text).toEqual('The request timed out. Please try again later.')
                        }
                    })
                })

                describe('캐시된 문서가 존재한다면', () => {
                    beforeEach(async () => {
                        const filePath = path.resolve(currentDir, './__fixtures__/developers/cached/sample-doc.md')
                        const dir = path.dirname(filePath)

                        await mkdir(dir, {recursive: true})
                        await writeFile(filePath, '# Cached Document\n\nThis is cached content.', 'utf8')

                        await client.callTool({
                            name: 'get_document',
                            arguments: {
                                categoryId: 'developers',
                                path: '/cached/sample-doc.md',
                            },
                        })

                        await rm(dir, {recursive: true, force: true})
                    })

                    it('캐시된 문서를 응답한다', async () => {
                        const result = await client.callTool({
                            name: 'get_document',
                            arguments: {
                                categoryId: 'developers',
                                path: '/cached/sample-doc.md',
                            },
                        })

                        const {content} = result as CallToolResult
                        const response = content[0]

                        expect(response.type).toEqual('text')
                        if (response.type === 'text') {
                            expect(response.text).toEqual('# Cached Document\n\nThis is cached content.')
                        }
                    })
                })
            })

            describe('search_documents()', () => {
                describe('categoryId가 잘못된 값이라면', () => {
                    it('에러를 응답한다', async () => {
                        const result = (await client.callTool({
                            name: 'search_documents',
                            arguments: {
                                categoryId: 'invalid-id',
                                query: '인증 요청',
                            },
                        })) as CallToolResult

                        const response = result.content[0]

                        expect(result.isError).toBe(true)
                        expect(response.type).toEqual('text')
                        if (response.type === 'text') {
                            expect(response.text).toContain('Input validation error')
                        }
                    })
                })

                describe('query 필드에 값이 없다면', () => {
                    it('에러를 응답한다', async () => {
                        const result = (await client.callTool({
                            name: 'search_documents',
                            arguments: {
                                categoryId: 'developers',
                            },
                        })) as CallToolResult

                        const response = result.content[0]

                        expect(result.isError).toBe(true)
                        expect(response.type).toEqual('text')
                        if (response.type === 'text') {
                            expect(response.text).toContain('Invalid arguments for tool search_documents')
                        }
                    })
                })

                it('검색 결과를 반환한다', async () => {
                    const result = await client.callTool({
                        name: 'search_documents',
                        arguments: {
                            categoryId: 'developers',
                            query: '네이버 페이',
                            limit: 3,
                        },
                    })

                    const {content} = result as CallToolResult

                    expect(content.length).toBeLessThanOrEqual(3)

                    expect(content[0].type).toEqual('text')
                    if (content[0].type === 'text') {
                        expect(content[0].text).toContain('# API URL 형식')
                    }

                    expect(content[1].type).toEqual('text')
                    if (content[1].type === 'text') {
                        expect(content[1].text).toContain('# 인증')
                    }

                    expect(content[2].type).toEqual('text')
                    if (content[2].type === 'text') {
                        expect(content[2].text).toContain('# 방화벽')
                    }
                })
            })
        })
    })
})
