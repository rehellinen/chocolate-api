import { firstUpperCase, r, getConfig, isClass } from '../utils'
import { middleware } from './decorator'
import { LibsNotFound } from '../exception'

export const validateMap = new Map()

export const validate = (name, scene) => {
  name = firstUpperCase(name)
  const path = r(getConfig('dir.validate'), `${name}.js`)
  let file
  try {
    file = require(path)
  } catch (e) {
    throw new LibsNotFound({
      message: `[Validator] can't find the file\nFile Path: ${path}`
    })
  }
  const Validator = file[name]
  if (!isClass(Validator)) {
    throw new LibsNotFound({
      message: `[Validator] '${name}' is not a constructor\nFile Path: ${path}`
    })
  }
  return middleware(async (ctx, next) => {
    await new Validator().check(ctx, scene)
    await next()
  })
}

export const rule = (funcName, errInfo, ...params) => {
  return (target, key, descriptor) => {
    const defaultVal = descriptor.initializer && descriptor.initializer.call(this)
    const rules = validateMap.get(target) || {}
    if (!rules[key]) {
      rules[key] = []
      validateMap.set(target, rules)
    }
    // 由验证函数名称、错误提示信息、验证函数额外参数构成的数组
    rules[key].push([funcName, errInfo, params])
    rules[key]._default = defaultVal
  }
}

export const type = (type) => {
  return (target, key) => {
    const rules = validateMap.get(target) || {}
    if (!rules[key]) {
      rules[key] = []
      validateMap.set(target, rules)
    }
    rules[key]._type = type
  }
}
