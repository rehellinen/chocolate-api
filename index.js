/**
 *  index.js
 *  Create By rehellinen
 *  Create On 2019/3/4 10:29
 */
// 启动服务器
if (process.env.NODE_ENV === 'production') {
  require('./dist/libs/index.js')
} else {
  require('@babel/register')
  require('./src/libs/index.js')
}
