module.exports = {
  root: true
, parser: '@typescript-eslint/parser'
, plugins: [
    '@typescript-eslint'
  ]
, extends: [
    'eslint:recommended'
  , 'plugin:@typescript-eslint/recommended'
  ]
, rules: {
    '@typescript-eslint/ban-types': 'off'
  , '@typescript-eslint/no-extra-semi': 'off'
  , '@typescript-eslint/no-unused-vars': 'off'
  , '@typescript-eslint/ban-ts-comment': 'off'
  }
}
