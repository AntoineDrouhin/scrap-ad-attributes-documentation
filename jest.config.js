module.exports = {
  testURL: 'http://localhost',
  roots: ['<rootDir>/src'],
  verbose: true,
  testPathIgnorePatterns: ['/lib/'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/node_modules/**'],
  reporters: [
    'default',
    [
      './node_modules/jest-html-reporter',
      {
        outputPath: './reports/functional/index.html'
      }
    ]
  ],
  preset: 'ts-jest',
  testMatch: null
}
