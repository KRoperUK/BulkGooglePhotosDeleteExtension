'use strict';

// Flat config. Kept intentionally light: the project has no runtime
// dependencies and no bundler, so this lints for correctness (undeclared
// globals, unused vars, obvious mistakes) rather than imposing a heavy style.

const js = require('@eslint/js');

const browserGlobals = {
  window: 'readonly',
  document: 'readonly',
  navigator: 'readonly',
  location: 'readonly',
  console: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  setInterval: 'readonly',
  clearInterval: 'readonly',
  getComputedStyle: 'readonly',
  MouseEvent: 'readonly',
  KeyboardEvent: 'readonly',
  NodeFilter: 'readonly',
  Element: 'readonly',
  HTMLElement: 'readonly'
};

const extensionGlobals = {
  ...browserGlobals,
  chrome: 'readonly'
};

const nodeGlobals = {
  require: 'readonly',
  module: 'writable',
  __dirname: 'readonly',
  process: 'readonly',
  setTimeout: 'readonly',
  console: 'readonly'
};

module.exports = [
  {
    ignores: ['node_modules/**', 'dist/**', 'tools/**']
  },
  js.configs.recommended,
  {
    // Extension runtime scripts.
    files: ['content.js', 'background.js', 'sidepanel.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: extensionGlobals
    },
    rules: {
      'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none' }],
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      // The DOM-discovery code intentionally reassigns scratch locals in a
      // try/for pattern; this rule flags a correct defensive assignment.
      'no-useless-assignment': 'off'
    }
  },
  {
    // Node test harness and root config files.
    files: ['test/**/*.js', '*.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: nodeGlobals
    },
    rules: {
      'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none' }]
    }
  }
];
