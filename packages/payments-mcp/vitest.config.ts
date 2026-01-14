import {defineConfig} from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'node',
        setupFiles: ['./test/setup.ts'],
        globalSetup: './test/global-setup.ts',
        include: ['test/**/*.test.ts'],
        testTimeout: 11_000,
        hookTimeout: 11_000,
        coverage: {
            include: ['src/**/*.ts'],
            thresholds: {
                statements: 80,
                branches: 80,
                lines: 80,
            },
        },
    },
})
