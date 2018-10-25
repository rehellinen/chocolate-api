/**
 *  index.js
 *  Create By rehellinen
 *  Create On 2018/10/25 19:06
 */

import Koa from 'koa'

const app = new Koa()

app.use(async (ctx) => {
  ctx.body = 'hello world'
})

app.listen(9527)
