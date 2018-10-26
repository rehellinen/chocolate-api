/**
 *  utils.js
 *  Create By rehellinen
 *  Create On 2018/9/26 10:21
 */
import X2JS from 'x2js'
let x2js = new X2JS({
  escapeMode: false
})

function parseXML (xml) {
  return x2js.xml2js(xml.toString())
}

function formatMessage (data) {
  let msg = {}
  if (typeof data !== 'object') {
    return
  }

  const keys = Object.keys(data)
  for (let i = 0; i < keys.length; i++) {
    let key  = keys[i]
    let item = data[key]

    if (typeof item === 'string') {
      msg[key] = item
    }

    if (item instanceof Array) {
      // 数组不止一项
      msg[key] = []
      for (let j =  0; j < item.length; j++) {
        msg[key].push(formatMessage(item[j]))
      }
    }
  }
  return msg
}

function getRandChars (length = 16) {
  let str = ''
  let strPol = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let max = strPol.length - 1

  for (let i = 0; i < length; i++) {
    str += strPol[Math.floor(Math.random() * max)]
  }

  return str
}

function parseParams (params) {
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
    let paramsArr = params.split('&')
    for (let item of paramsArr) {
      let param = item.split('=')
      paramsObj[param[0]] = param[1]
    }
  }
  return paramsObj
}

function isEmptyObj (obj) {
  let keys = Object.keys(obj)
  return keys.length === 0;
}

export {parseXML, formatMessage, getRandChars, parseParams, isEmptyObj}
