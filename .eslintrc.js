module.exports = {
  root: true,
  extends: [
    'standard'
  ],
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    node: true,
    es6: true
  },
  rules: {
    'no-unused-vars': 1,
    'no-multiple-empty-lines': [2, {
      max: 2
    }]
  },
  globals: {
  }
}
