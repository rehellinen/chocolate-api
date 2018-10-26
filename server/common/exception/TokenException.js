import {BaseException} from "./BaseException"

export class TokenException extends BaseException{
  constructor(config) {
    super(config)
    if (!this.httpCode) this.httpCode = 401
    if (!this.status) this.status = 90000
    if (!this.message) this.message = 'Token已过期或无效'
  }
}
