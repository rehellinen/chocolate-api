/**
 *  validate.js
 *  Create By rehellinen
 *  Create On 2018/10/12 21:24
 */
import {r} from "../utils"

export const validate = ({name, scene}) => {
  // name首字母设置为大写
  name = name.substr(0, 1).toUpperCase() + name.substr(1, name.length-1)

  const Validate = require(r(`./common/validate/${name}Validate`))[`${name}Validate`]
  return middleware(async (ctx, next) => {
    await new Validate().check(ctx, scene)
    await next()
  })
}

export const auth = (type) => {
  let scope
  if (type === 'user' || !type) {
    scope = $config.SCOPE.USER
  } else if (type === 'super') {
    scope = $config.SCOPE.SUPER
  }
  return middleware(async (ctx, next) => {
    // TODO: 取消注释
    // Token.checkScope(ctx, scope)
    await next()
  })
}

export const middleware = (middleware) => {
  return (target, key) => {
    if (!Array.isArray(target[key])){
      target[key] = [target[key]]
    }
    target[key].unshift(middleware)
  }
}
