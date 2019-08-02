/**
 *  router.js
 *  Create By rehellinen
 *  Create On 2018/10/25 23:19
 */
// 记录路由信息
export const routerMap = new Map()

export const controller = (path = '') => {
  return (target) => {
    // 路由URL的第一部分
    target.prototype.routerPrefix = normalizePath(path)
  }
}

const baseMethod = ({ path = '', method }) => {
  return (target, key) => {
    target[key] = Array.isArray(target[key]) ?  target[key] : [target[key]]

    routerMap.set({
      method,
      target,
      path: normalizePath(path)
    }, target[key])
  }
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
