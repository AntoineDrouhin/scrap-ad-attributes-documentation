module.exports = {
  testURL: 'http://localhost',
  roots: ['<rootDir>/tests'],
  verbose: true,
  setupTestFrameworkScriptFile: './jest.setup.js',
  testRegex: '(\\.|/)(test|spec)\\.(jsx?|tsx?)$',
  testResultsProcessor: './node_modules/jest-html-reporter',
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
