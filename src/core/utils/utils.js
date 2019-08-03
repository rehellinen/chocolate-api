/**
 *  utils.js
 *  Create By rehellinen
 *  Create On 2018/9/26 10:21
 */
import X2JS from 'x2js'
import { resolve } from 'path'

// 从根目录（index.js所在目录开始寻找）
export const r = path => resolve(__dirname, '../../', path)

export const x2js = new X2JS({
  escapeMode: false
})

export function parseXML (xml) {
  return x2js.xml2js(xml.toString())
}

export function getRandChars (length = 16) {
  let str = ''
  const strPol = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const max = strPol.length - 1

  for (let i = 0; i < length; i++) {
    str += strPol[Math.floor(Math.random() * max)]
  }

  return str
}

export function parseParams (params) {
  params = params.toString()
  let paramsObj = {}
  if (params.startsWith('<')) {
    // 处理xml
    paramsObj = x2js.xml2js(params)
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

export function isEmptyObj (obj) {
  const keys = Object.keys(obj)
  return keys.length === 0
}
