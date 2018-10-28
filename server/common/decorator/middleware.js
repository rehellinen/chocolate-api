/**
 *  validate.js
 *  Create By rehellinen
 *  Create On 2018/10/12 21:24
 */
import {Token} from "../service/Token"

export const validate = ({name, scene}) => {
  // TODO: 验证name首字母是否大写
  const Validate = require(`../validate/${name}Validate`)[`${name}Validate`]
  console.log('validate')
  return addMiddleware(async (ctx) => {
    await new Validate().check(ctx, scene)
  })
}

export const auth = (type) => {
  let scope
  if (type === 'user') {
    scope = $config.SCOPE.USER
  } else if (type === 'super') {
    scope = $config.SCOPE.SUPER
  }
  console.log('auth')
  return addMiddleware((ctx) => {
    Token.checkScope(ctx, scope)
  })
}

const addMiddleware = (middleware) => {
  return (target, key) => {
    if (!Array.isArray(target[key])){
      target[key] = [target[key]]
    }
    target[key].unshift(middleware)
  }
}
