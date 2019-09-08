// 启动服务器
require('@babel/register')
const { Server } = require('rehellinen-api-core')

new Server()
  .start()
  .then(() => {})
