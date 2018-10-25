/**
 *  index.js
 *  Create By rehellinen
 *  Create On 2018/10/25 18:45
 */
require('@babel/register')({
  presets: [
    '@babel/preset-env'
  ],
  plugins: [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
  ]
})
require('@babel/polyfill')

// 启动服务器
require('./server/index')
