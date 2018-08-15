module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'no-unused-vars': 0,
    'indent': ['error', 2, {FunctionDeclaration: {parameters: 'first'}, FunctionExpression: {parameters: 'first'}}],
    'semi': ['error', 'always'],
    'space-before-function-paren': ['error', 'never'],
    'no-multiple-empty-lines': ['error', {'max': 2}]
  },
  parserOptions: {
    parser: 'typescript-eslint-parser'
  }
}
