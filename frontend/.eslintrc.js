module.exports = {
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:prettier/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  root: true,
  env: { es6: true },
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      extends: [
        'next/core-web-vitals',
        'eslint:recommended',
        'plugin:@typescript-eslint/disable-type-checked',
      ],
    },
    {
      files: ['*.tsx', '*.jsx'],
      rules: {
        // NextJS requires async TSX components that will likely not have awaits
        // So this rule should be disabled for TSX files
        '@typescript-eslint/require-await': 'off',
        // enforces replacing "'" with "&quot;" in paragraph blocks etc.
        'react/no-unescaped-entities': 'off',
        // Next server functions are async and often need to be passed to
        // props of components typed as void functions
        '@typescript-eslint/no-misused-promises': 'off',
      },
    },
  ],
};
