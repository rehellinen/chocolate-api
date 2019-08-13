import { types } from '../utils'

export class Controller {
  /**
   * 返回JSON格式的数据
   * @param data
   */
  json (data = {}) {
    this.ctx.status = 200
    this.ctx.type = types.json
    this.ctx.body = data
  }
}
