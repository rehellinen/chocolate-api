import { r } from '../utils'
import { middleware } from './decorator'

export const validate = ({ name, scene }) => {
  // TODO: name首字母设置为大写
  name = name.substr(0, 1).toUpperCase() + name.substr(1, name.length - 1)

  const Validate = require(r(`./common/validate/${name}`))[`${name}Validate`]
  return middleware(async (ctx, next) => {
    await new Validate().check(ctx, scene)
    await next()
  })
}

export const rule = (funcName, errInfo) => {
  return (target, key) => {
    if (!target.rules) {
      target.rules = {}
    }

    if (!target.rules[key]) {
      target.rules[key] = []
    }
    target.rules[key].push([funcName, errInfo])
  }
}
