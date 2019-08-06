/**
 *  validate.js
 *  Create By rehellinen
 *  Create On 2018/10/12 21:24
 */
import { Token } from '../utils'
import {routerMap} from './router'

export const auth = (type) => {
  let scope
  if (type === 'user' || !type) {
    scope = $config.SCOPE.USER
  } else if (type === 'super') {
    scope = $config.SCOPE.SUPER
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
