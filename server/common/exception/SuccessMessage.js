import {BaseException} from "./BaseException"

export class SuccessMessage extends BaseException{
  constructor(config) {
    super(config)
    if (!this.httpCode) this.httpCode = 200
    if (!this.status) this.status = 1
    if (!this.message) this.message = '请求成功'
  }
}
