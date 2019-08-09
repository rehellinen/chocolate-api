/**
 *  cors.js
 *  Create By rehellinen
 *  Create On 2019/3/4 11:50
 */
import koaCors from 'koa2-cors'
import { getConfig } from '../utils'

const config = getConfig()

export const cors = app => {
  app.use(koaCors({
    origin: config.CORS.ORIGIN || '*',
    maxAge: config.CORS.MAX_AGE || 5,
    credentials: config.CORS.CREDENTIALS || true,
    exposeHeaders: config.CORS.EXPOSE_HEADERS ||
      ['WWW-Authenticate', 'Server-Authorization'],
    allowMethods: config.CORS.METHODS ||
      ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    allowHeaders: config.CORS.ALLOW_HEADERS ||
      ['Content-Type', 'Authorization', 'Accept', 'token', 'Content-Length', 'X-Requested-With']
  }))
}

