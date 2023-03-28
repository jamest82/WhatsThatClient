/* eslint-disable linebreak-style */
module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'airbnb'
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'react'
  ],
  rules: {
    'linebreak-style': ['error', 'windows'],
    'comma-dangle': ['error', 'never'],
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }]
  }
};
