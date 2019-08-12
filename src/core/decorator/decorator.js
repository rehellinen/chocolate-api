/**
 *  validate.js
 *  Create By rehellinen
 *  Create On 2018/10/12 21:24
 */
import { getConfig } from '../utils'
import { Token } from '../class'
import { routerMap } from './router'
import { TokenException } from '../exception'

const config = getConfig('token')

export const auth = (type) => {
  let flag = false
  for (const value of Object.values(config.SCOPE)) {
    if (type === value) {
      flag = true
    }
  }
  // 输入为空
  if (!type || !flag) {
    type = config.SCOPE.USER
  }
  // 输入的值非法
  if (!flag) {
    throw new TokenException({
      message: '@auth装饰器输入值非法！'
    })
  }
  return middleware(async (ctx, next) => {
    Token.checkScope(ctx, type)
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
