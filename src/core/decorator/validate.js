import { firstUpperCase, r, getConfig, isClass, isFunction } from '../utils'
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
    if (defaultVal != null || funcName === 'optional') {
      rules[key]._option = true
      rules[key]._default = defaultVal
    }
    if (funcName !== 'optional') {
      // 由验证函数名称、错误提示信息、验证函数额外参数构成的数组
      rules[key].push([funcName, errInfo, params])
    }
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

export const extend = (validator) => {
  return (target) => {
    const child = validateMap.get(target.prototype)
    const parent = validateMap.get(validator.prototype)
    // 处理验证规则
    for (const [key, value] of Object.entries(parent)) {
      if (!child[key]) {
        child[key] = value
      }
    }
    // 处理自定义方法
    for (const key of Reflect.ownKeys(validator.prototype)) {
      if (key === 'constructor') {
        continue
      }
      const value = validator.prototype[key]
      if (isFunction(value) && !target.prototype[key]) {
        target.prototype[key] = value
      }
    }
  }
}
