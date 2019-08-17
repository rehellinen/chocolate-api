/**
 *  router.js
 *  Create By rehellinen
 *  Create On 2018/10/25 23:19
 */
import { firstUpperCase, r } from '../utils'
// 记录路由信息
export const routerMap = new Map()

export const controller = (path = '') => {
  return (target) => {
    target.prototype.prefix = normalizePath(path)
  }
}

// 获取独一无二的key
export const getMapKey = (target, key, descriptor) => {
  return target.constructor.name +
    key +
    descriptor.initializer && descriptor.initializer.call(this)
}

export const get = (path) => baseMethod({ method: 'get', path })

export const post = (path) => baseMethod({ method: 'post', path })

export const put = (path) => baseMethod({ method: 'put', path })

export const del = (path) => baseMethod({ method: 'del', path })

export const all = (path) => baseMethod({ method: 'all', path })

// 处理路径（只能以'/'开头，而不能以'/'结尾）
const normalizePath = (path = '') => {
  path = path.startsWith('/') ? path : `/${path}`
  path = path.endsWith('/') ? path.substr(0, path.length - 1) : path
  return path
}

const baseMethod = ({ path = '', method }) => {
  return (target, key, descriptor) => {
    const routerStr = descriptor.initializer && descriptor.initializer.call(this)
    const actions = getController(routerStr)
    routerMap.set(getMapKey(target, key, descriptor), {
      method,
      target,
      actions,
      path: normalizePath(path)
    })
  }
}

// 获取控制器
const getController = (str = '') => {
  const [controller, action] = str.split('.')
  const Controller = require(
    r(`./app/controller/${firstUpperCase(controller)}.js`)
  )[`${firstUpperCase(controller)}Controller`]
  return [
    async (ctx, next) => {
      await new Controller()[action](ctx, next)
    }
  ]
}
