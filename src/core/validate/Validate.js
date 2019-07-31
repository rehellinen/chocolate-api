/**
 *  BaseValidate.js
 *  Create By rehellinen
 *  Create On 2018/10/12 21:21
 */
import {Methods} from "./Methods"
import getRawBody from 'raw-body'
import {parseParams} from "../utils/utils"

export class Validate extends Methods{
  constructor (rules = {}, scene = {}) {
    super()
    this.rules = rules
    this.scene = scene
    this.checkedParams = {}
  }

  async check (ctx, scene) {
    const checkedParams = {}
    const params = await this.getParams(ctx)

    const rules = this.scene[scene]

    for (let field of rules) {
      const rule = this.rules[field]
      const validateFunc = rule[0].split('|')
      const errInfo = rule[1].split('|')

      validateFunc.forEach((item, index) => {
        this[item](params, field, errInfo[index])
      })

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
