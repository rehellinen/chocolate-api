/**
 *  utils.js
 *  Create By rehellinen
 *  Create On 2018/9/26 10:21
 */
import X2JS from 'x2js'
import { mkdir, stat } from 'fs'
import { promisify } from 'util'
import { resolve, parse } from 'path'
import getRawBody from 'raw-body'
import chalk from 'chalk'

/**
 * 以src为根目录
 * @param path
 * @returns {string}
 */
export const r = path => resolve(__dirname, '../../', path)

/**
 * 解析XML
 * @param xml xml数据
 */
export function parseXML (xml) {
  const x2js = new X2JS({
    escapeMode: false
  })
  return x2js.xml2js(xml.toString())
}

/**
 * 获取一段随机字符串
 * @param length 长度
 */
export function getRandChars (length = 16) {
  let str = ''
  const strPol = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const max = strPol.length - 1

  for (let i = 0; i < length; i++) {
    str += strPol[Math.floor(Math.random() * max)]
  }

  return str
}

/**
 * 解析body数据
 * @param params
 */
export function parseBody (params) {
  params = params.toString()
  let paramsObj = {}
  if (params.startsWith('<')) {
    // 处理xml
    paramsObj = parseXML(params)
  } else if (params.startsWith('{')) {
    // 处理json
    paramsObj = JSON.parse(params)
  } else {
    // 处理表单
    const paramsArr = params.split('&')
    for (const item of paramsArr) {
      const param = item.split('=')
      paramsObj[param[0]] = param[1]
    }
  }
  return paramsObj
}

/**
 * 根据不同HTTP方法获取相应的请求携带数据
 * @param ctx
 * @returns {Promise<*>}
 */
export const getParams = async (ctx) => {
  const params = Object.assign({},
    ctx.headers,
    ctx.params,
    ctx.query
  )
  if (ctx.method !== 'GET') {
    const body = await getRawBody(ctx.req, {
      length: ctx.headers['content-length'],
      limit: '5mb'
    })
    Object.assign(params, parseBody(body))
  }
  return params
}

/**
 * 判断一个对象是否为空
 * @param obj
 * @returns {boolean}
 */
export function isEmptyObj (obj) {
  const keys = Object.keys(obj)
  return keys.length === 0
}


/**
 * 字符串首字母大写
 * @param str 字符串
 * @returns {string}
 */
export const firstUpperCase = ([first, ...rest]) => first.toUpperCase() + rest.join('')

/**
 * 是否为生产环境
 * @type {boolean}
 */
export const isProduction = process.env.NODE_ENV === 'production'

/**
 * 路径是否存在，不存在则创建
 * @param {string} path 路径
 */
export const dirExists = async (path) => {
  try {
    const pathStat = await promisify(stat)(path)
    if (pathStat && pathStat.isDirectory()) {
      // 该路径文件夹，返回true
      return true
    } else if (pathStat) {
      // 该路径为文件，返回false
      return false
    }
    // 拿到上级路径
    const tempDir = parse(path).dir
    // 递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
    const status = await dirExists(tempDir)
    let mkdirStatus
    if (status) {
      mkdirStatus = await promisify(mkdir)(path)
    }
    return mkdirStatus
  } catch (e) {
  }
}

export const getTodayDate = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() < 10
    ? '0' + (date.getMonth() + 1)
    : date.getMonth() + 1
  const day = date.getDate()

  return `${year}${month}${day}`
}

export const warn = (msg) => {
  console.log(chalk.yellow(`warning: ${msg}`))
}

export const error = (msg) => {
  console.log(chalk.red(`error: ${msg}`))
}

export const snakeCase = (string) => [...string]
  .reduce((result, word, index) => (
    result +
    (index && word >= 'A' && word <= 'Z' ? '_' : '') +
    word.toLowerCase()
  ), '')

export const camelCase = (string) => [...string]
  .reduce((result, word, index, arr) => {
    if (word === '_') {
      arr[index + 1] = arr[index + 1].toUpperCase()
      return result
    } else {
      return result + word
    }
  }, '')
