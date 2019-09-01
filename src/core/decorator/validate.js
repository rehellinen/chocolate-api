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
      message: `[Validate] can't find the file\nFile Path: ${path}`
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

export const rule = (funcName, errInfo) => {
  return (target, key) => {
    const rules = validateMap.get(target) || {}
    if (!rules[key]) {
      rules[key] = []
    }
    rules[key].push([funcName, errInfo])
    validateMap.set(target, rules)
  }
}
