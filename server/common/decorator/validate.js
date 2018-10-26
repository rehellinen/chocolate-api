/**
 *  validate.js
 *  Create By rehellinen
 *  Create On 2018/10/12 21:24
 */
export const validate = ({name, scene}) => {
  // TODO: 验证name首字母是否大写
  const Validate = require(`../validate/${name}Validate`)[`${name}Validate`]
  return addMiddleware((ctx) => {
    new Validate().check(ctx, scene)
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
