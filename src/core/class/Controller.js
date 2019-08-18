import { types } from '../utils'

export class Controller {
  // koa-router的ctx
  ctx

  // koa-router的next
  next

  // 设置ctx和next
  setConfig (ctx, next) {
    this.ctx = ctx
    this.next = next
  }

  /**
   * 返回JSON格式的数据
   * @param status 错误码
   * @param message 提示信息
   * @param httpCode http状态码
   * @param data 需要返回的数据
   */
  json ({ status = 1, message = '', httpCode = 200, data = {} }) {
    this.ctx.type = types.json
    this.ctx.status = httpCode
    this.ctx.body = {
      status,
      message,
      data
    }
  }
}
