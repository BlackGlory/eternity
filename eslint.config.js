// @ts-check

import js from '@eslint/js'
import ts from 'typescript-eslint'

export default ts.config(
  js.configs.recommended
, ...ts.configs.recommended
, {
    rules: {
      '@typescript-eslint/no-unused-vars': 'off'
    , '@typescript-eslint/no-unused-expressions': 'off'
    }
  }
)
