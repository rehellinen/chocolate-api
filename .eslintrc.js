module.exports = {
  root: true,
  extends: [
    'standard'
  ],
  parser: 'eslint-parser',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    node: true,
    es6: true
  },
  rules: {
    'no-multiple-empty-lines': [2, {
      max: 2
    }]
  },
  globals: {
  }
}
