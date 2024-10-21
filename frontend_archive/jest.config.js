module.exports = {
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.{ts,tsx}'],
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: [
        "node_modules",
        "test-config",
        "interfaces",
        "App.css.d.ts",
        "jestGlobalMocks.ts",
        ".index.ts",
        ".reportWebVitals.ts",
        "bootstrap.tsx",
        "constant.ts",
        "react-app-env.d.ts",
        "setupTests.ts",
        "authConfig.ts",
        "actionTypes.ts",
        "customMiddleware.ts",
        "globals.d.ts",
        "authService.ts",
        "abc.ts",
        "tokenUtils.ts", //Added here as not being used anywhere currently
        "evaluateExpressionString.ts", //Added here as not being used anywhere currently
        "components"
    ],
    coverageThreshold: {
        global: {
          branches: 75,
          functions: 75,
          lines: 75,
          statements: 75,
        },
    },
    preset: "ts-jest",
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        "uuid": require.resolve('uuid'),
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
        "^.+\\.(ts|tsx)?$": "ts-jest"
    },
    setupFilesAfterEnv: ["<rootDir>/test-env-setup.ts"]
}
