/**
 *  BaseValidate.js
 *  Create By rehellinen
 *  Create On 2018/10/12 21:21
 */
import { Methods } from './Methods'
import getRawBody from 'raw-body'
import { parseParams } from '../utils/utils'


export class Validate extends Methods {
  // 场景配置
  scene = {}

  async check (ctx, scene) {
    const checkedParams = {}
    const params = await this.getParams(ctx)

    // 获取该场景需要验证的所有字段
    const fields = this.scene[scene]

    for (const field of fields) {
      const rules = this.rules[field]

      for (const [funcName, errInfo] of rules) {
        this[funcName](params, field, errInfo)
      }
      checkedParams[field] = params[field]
    }

    ctx.checkedParams = checkedParams
  }

  async getParams (ctx) {
    let params
    if (ctx.method === 'GET') {
      params = ctx.query
    } else {
      const rawReqBody = await getRawBody(ctx.req, {
        length: ctx.req.headers['content-length'],
        limit: '1mb'
      })
      params = parseParams(rawReqBody)
    }
    return params
  }
}
