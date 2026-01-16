/**
 * Npay agent-payments-integration
 * Copyright (c) 2025-present NAVER FINANCIAL Corp.
 * Apache-2.0
 */

import nounDictionary from './noun_dictionary.json' with {type: 'json'}

const sortedEntries = Object.entries(nounDictionary).sort(([a], [b]) => b.length - a.length)

export const dictionary = new Map<string, string[]>(sortedEntries)
