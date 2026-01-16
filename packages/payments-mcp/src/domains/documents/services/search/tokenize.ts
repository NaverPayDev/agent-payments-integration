/**
 * Npay agent-payments-integration
 * Copyright (c) 2025-present NAVER FINANCIAL Corp.
 * Apache-2.0
 */

import {dictionary} from './config/dictionary.js'

const TEXT_SPLIT = /[\s\n\r\t.,;:!?'"()[\]{}~`@#$%^&*\-_+=|\\<>/\p{Z}\p{P}]+/u
const KOR_ENG_SPLIT = /(?<=[가-힣])(?=[a-zA-Z])|(?<=[a-zA-Z])(?=[가-힣])/

export function tokenize(text: string): string[] {
    return text
        .split(TEXT_SPLIT)
        .flatMap((token) => token.trim().split(KOR_ENG_SPLIT))
        .filter((token) => token.length > 0)
}

export function processTerm(term: string): string[] | null {
    const normalized = term.normalize('NFC').toLowerCase().trim()
    if (normalized.length <= 1) {
        return null
    }

    for (const [mainNoun, subNouns] of dictionary) {
        if (normalized.startsWith(mainNoun)) {
            return [...subNouns]
        }
    }

    return [normalized]
}
