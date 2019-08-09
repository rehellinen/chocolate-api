/**
 *  validate.js
 *  Create By rehellinen
 *  Create On 2018/10/12 21:24
 */
import { getConfig } from '../utils'
import { Token } from '../class'
import { routerMap } from './router'

const config = getConfig()

export const auth = (type) => {
  let scope
  if (type === 'user' || !type) {
    scope = config.TOKEN.SCOPE.USER
  } else if (type === 'super') {
    scope = config.TOKEN.SCOPE.SUPER
  }
  return middleware(async (ctx, next) => {
    Token.checkScope(ctx, scope)
    await next()
  })
}

export const middleware = (middleware) => {
  return (target, key) => {
    routerMap
      .get(key)
      .action
      .unshift(middleware)
  }
}
