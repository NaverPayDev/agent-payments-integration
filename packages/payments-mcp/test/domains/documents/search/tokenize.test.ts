/**
 * Npay agent-payments-integration
 * Copyright (c) 2025-present NAVER FINANCIAL Corp.
 * Apache-2.0
 */

import {describe, it, expect} from 'vitest'

import {tokenize, processTerm} from '../../../../src/domains/documents/services/search/tokenize.js'

describe('tokenize', () => {
    describe('tokenize()', () => {
        describe('text가 공백, 구두점으로만 이루어져 있다면', () => {
            it('빈 배열을 반환한다', () => {
                const text = '   ...  ||| --- ,,, \n \t !! '

                const tokens = tokenize(text)

                expect(tokens).toEqual([])
            })
        })

        it('공백, 구분자 그리고 한영 경계를 기준으로 토큰화한다', () => {
            const text = `
    네이버페이API 서버는 IP 주소 기반 ACL(access control list)을 사용하지 않습니다.
    
    \`\`\`
    X-Naver-Client-Id: {Client ID}
    X-Naver-Client-Secret: {Client Secret}
    \`\`\`
    
    | HTTP Status Code | 설명                                                                   |
    | ---------------- | ---------------------------------------------------------------------- |
    | 200              | OK, 요청이 성공한 경우                                                 |
    `

            const tokens = tokenize(text)

            expect(tokens).toEqual([
                '네이버페이',
                'API',
                '서버는',
                'IP',
                '주소',
                '기반',
                'ACL',
                'access',
                'control',
                'list',
                '을',
                '사용하지',
                '않습니다',
                'X',
                'Naver',
                'Client',
                'Id',
                'Client',
                'ID',
                'X',
                'Naver',
                'Client',
                'Secret',
                'Client',
                'Secret',
                'HTTP',
                'Status',
                'Code',
                '설명',
                '200',
                'OK',
                '요청이',
                '성공한',
                '경우',
            ])
        })
    })

    describe('processTerm()', () => {
        it.each([
            ['네이버페이', ['네이버', '페이', '네이버페이']],
            ['API', ['api']],
            ['서버는', ['서버']],
            ['IP', ['ip']],
            ['주소', ['주소']],
            ['기반', ['기반']],
            ['ACL', ['acl']],
            ['access', ['access']],
            ['control', ['control']],
            ['list', ['list']],
            ['을', null],
            ['사용하지', ['사용']],
            ['않습니다', ['않습니다']],
            ['X', null],
            ['Naver', ['naver']],
            ['Client', ['client']],
            ['Id', ['id']],
            ['Client', ['client']],
            ['ID', ['id']],
            ['X', null],
            ['Naver', ['naver']],
            ['Client', ['client']],
            ['Secret', ['secret']],
            ['Client', ['client']],
            ['Secret', ['secret']],
            ['HTTP', ['http']],
            ['Status', ['status']],
            ['Code', ['code']],
            ['설명', ['설명']],
            ['200', ['200']],
            ['OK', ['ok']],
            ['요청이', ['요청']],
            ['성공한', ['성공']],
            ['경우', ['경우']],
            ['없는명사', ['없는명사']],
            ['간편결제', ['간편결제']],
        ])('명사 사전을 이용해 "%s"를 "%j"로 처리한다', (term, expected) => {
            expect(processTerm(term)).toEqual(expected)
        })
    })
})
