import { firstUpperCase, r } from '../utils'
import { middleware } from './decorator'

export const validateMap = new Map()

export const validate = (name, scene) => {
  name = firstUpperCase(name)
  const Validate = require(r(`./common/validate/${name}`))[`${name}Validate`]
  return middleware(async (ctx, next) => {
    await new Validate().check(ctx, scene)
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
