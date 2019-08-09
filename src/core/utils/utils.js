/**
 *  utils.js
 *  Create By rehellinen
 *  Create On 2018/9/26 10:21
 */
import X2JS from 'x2js'
import { resolve } from 'path'
import getRawBody from 'raw-body'

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
  if (ctx.method === 'GET') {
    return ctx.query
  } else {
    const rawReqBody = await getRawBody(ctx.req, {
      length: ctx.req.headers['content-length'],
      limit: '1mb'
    })
    return parseBody(rawReqBody)
  }
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

export const isProduction = process.env.NODE_ENV === 'production'
