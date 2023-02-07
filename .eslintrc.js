module.exports = {
  env: { browser: true, es2021: true, node: true, 'cypress/globals': true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json' /*'./cypress/tsconfig.json'*/],
    ecmaVersion: 2022,
    tsconfigRootDir: __dirname,
  },
  plugins: [
    'prettier',
    '@typescript-eslint',
    'simple-import-sort',
    'promise',
    'unicorn',
    'unused-imports',
    'import',
    'cypress',
  ],
  extends: [
    'eslint:recommended',
    'airbnb',
    'airbnb-typescript',
    'next',
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'next/core-web-vitals',
    'plugin:promise/recommended',
    'plugin:prettier/recommended',
    'plugin:cypress/recommended',
    'prettier',
  ],
  rules: {
    // 'no-unused-vars': 'off',
    'no-console': 'warn',
    'no-alert': 'error',
    'no-empty': 'error',
    'no-implicit-coercion': 'error',
    'no-underscore-dangle': 'off',
    'no-var': 'warn',
    'no-void': 'off',
    'no-empty-function': 'warn',
    'no-confusing-arrow': ['error', { allowParens: true }],
    'no-mixed-operators': 'error',
    'no-plusplus': ['warn', { allowForLoopAfterthoughts: true }],
    'no-param-reassign': ['error', { props: false }],

    'prettier/prettier': [
      'error',
      { singleQuote: true, semi: true, jsxSingleQuote: true },
      { usePrettierrc: true },
    ],

    'lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],

    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        functions: false,
        classes: true,
        variables: true,
        typedefs: true,
      },
    ],

    'promise/catch-or-return': 'error',

    // #region  //*=========== Import Sort ===========
    'sort-imports': 'off',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/order': 'off',
    'import/prefer-default-export': 'off',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          // ext library & side effect imports
          ['^@?\\w', '^\\u0000'],
          // {s}css files
          ['^.+\\.s?css$'],
          // Lib and hooks
          ['^@/lib', '^@/hooks'],
          // static data
          ['^@/data'],
          // components
          ['^@/components', '^@/container'],
          // zustand store
          ['^@/store'],
          // Other imports
          ['^@/'],
          ['^~/'],
          // relative paths up until 3 level
          [
            '^\\./?$',
            '^\\.(?!/?$)',
            '^\\.\\./?$',
            '^\\.\\.(?!/?$)',
            '^\\.\\./\\.\\./?$',
            '^\\.\\./\\.\\.(?!/?$)',
            '^\\.\\./\\.\\./\\.\\./?$',
            '^\\.\\./\\.\\./\\.\\.(?!/?$)',
          ],
          ['^@/types'],
          // other that didnt fit in
          ['^'],
        ],
      },
    ],
    // cypress
    'cypress/no-pause': 'error',
    'cypress/no-force': 'warn',
    'cypress/no-assigning-return-values': 'error',
    'cypress/no-unnecessary-waiting': 'error',

    // #endregion  //*======== Import Sort ===========
    'react-hooks/exhaustive-deps': 'warn',
    'react/function-component-definition': 'off',
    'react/display-name': 'warn',
    'react/no-unstable-nested-components': 'off',
    'react/require-default-props': 'off',
    'react/jsx-curly-brace-presence': [
      'warn',
      { props: 'never', children: 'never' },
    ],
    'jsx-a11y/no-noninteractive-tabindex': [
      'error',
      { tags: ['div'], roles: ['tabpanel'] },
    ],
    'jsx-a11y/media-has-caption': 'off',
  },
  ignorePatterns: [
    'node_modules/',
    '*config.js',
    '.eslintrc.js',
    'next-env.d.ts',
    // '**/*.cy.*',
  ],
  globals: {
    React: true,
    JSX: true,
  },
  overrides: [
    {
      // disable some rules for cypress tests files
      files: ['**/*.cy.*'],
      rules: {
        'promise/always-return': 'off',
        'promise/catch-or-return': 'off',
        'promise/no-nesting': 'off',
        '@typescript-eslint/no-namespace': 'off',
      },
    },
  ],
};
