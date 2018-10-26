/**
 *  router.js
 *  Create By rehellinen
 *  Create On 2018/10/25 23:19
 */
export const routerMap = new Map()

export const controller = (path) => {
  return (target) => {
    path = normalizePath(path)
    target.prototype.routerPrefix = path
  }
}

export const get = (path) => {
  return baseMethod({ method: 'get', path })
}

export const post = (path) => {
  return baseMethod({ method: 'post', path })
}

export const put = (path) => {
  return baseMethod({ method: 'put', path })
}

export const del = (path) => {
  return baseMethod({ method: 'del', path })
}

export const all = (path) => {
  return baseMethod({ method: 'all', path })
}

const normalizePath = (path) => {
  return path.startsWith('/') ? path : `/${path}`
}

const baseMethod = (conf) => {
  return (target, key) => {
    target[key] = Array.isArray(target[key]) ?  target[key] : [target[key]]

    const length = target[key].length
    let action = target[key][length - 1]

    action.prototype.method = conf.method
    conf.path = normalizePath(conf.path)
    conf.target = target
    routerMap.set(conf, target[key])
  }
}
