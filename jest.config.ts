import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'jsdom',
  modulePathIgnorePatterns: ['dist'],
  cacheDirectory: './node_modules/.cache/jest/',
  coverageProvider: 'v8',
  clearMocks: true,
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  globals: {
    'ts-jest': {
      useESM: true,
      isolatedModules: true
    }
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'packages/fe/**/*.{ts,tsx}',
    '!packages/fe/src/index.tsx'
  ]
}

export default config
