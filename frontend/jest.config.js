const nextJest = require('next/jest');

/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const config = {
  coverageProvider: 'v8',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  preset: 'ts-jest',
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text'],
  collectCoverage: true,
  collectCoverageFrom: [
    'core/components/**/*.{ts,tsx}',
    'core/util/**/*.{ts,tsx}',
    'core/services/**/*.{ts,tsx}',
    'core/models/**/*.{ts,tsx}',
    //Below files are added by CAM team need to remove once testcases are available
    '!core/services/auth/**/*.{ts,tsx}',
    '!app/api/**/*.{ts,tsx}',
    '!core/apis/**/*.{ts,tsx}',
    'app/convertQuestionConditions.js',
    'core/apis/add-another/InputWithDelete.tsx',
    'core/apis/add-another/addAnotherClient.tsx',
    'core/apis/common/clearOnlyAnswers.ts',
    'core/apis/common/NewDataRequired.tsx',
    '!core/services/file-service.ts',
    '!core/components/QuestionBuilder.tsx',
    '!core/components/SessionTimeout.tsx',
    '!core/components/TimeoutModal.tsx',
    '!core/components/AuthenticateProtectedComponents.tsx',
    '!core/components/SortableTable.tsx',
    '!core/components/SubNavigation.tsx',
    '!core/components/FilterPanel.tsx',
    '!core/components/FilterTable.tsx',
    '!core/components/Header.tsx',
    '!core/components/Pagination.tsx',
    '!core/components/DashboardTiles.tsx',
    '!core/components/AccountMenu.tsx',
    '!core/components/AddUserSearchResults.tsx',
    '!core/components/SummaryTable.tsx',
    '!core/components/ServerSidePagination.tsx',
    '!core/util/RedirectByUser.tsx',
    '!core/util/arrayUtils.ts',
    '!core/util/graph.ts',
    '!core/util/questionUtils.ts',
    '!core/util/checkIfMicrosoftEmailExistsInDatabase.ts',
    '!core/util/checkIfUserDetailsInSession.ts',
    '!core/util/isUserEnabled.ts',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  transformIgnorePatterns: [
    "/node_modules"
  ],
  testPathIgnorePatterns: [
    "frontend/core/test/unit/components/Header.test.tsx"
 ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  coveragePathIgnorePatterns: [
    'node_modules',
    '<rootDir>/core/test/unit/redis.test.js',
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(config);