/**
 *  cors.js
 *  Create By rehellinen
 *  Create On 2019/3/4 11:50
 */
import koaCors from 'koa2-cors'

export const cors = app => {
  app.use(koaCors({
    origin: '*',
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'token']
  }))

  // 处理options请求
  app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set(
      'Access-Control-Allow-Headers',
      'token, Content-Type, Content-Length, Authorization, Accept, X-Requested-With'
    )
    ctx.set('Access-Control-Allow-Methods',
      'PUT, POST, GET, DELETE, OPTIONS'
    )
    if (ctx.method === 'OPTIONS') ctx.body = 200
    else await next()
  })
}

