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
    allowMethods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    // TODO: CORS做成配置文件
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'token', 'Content-Length', 'X-Requested-With']
  }))
}

