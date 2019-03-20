import {BaseException} from "../../libs/exception/BaseException"

export class TokenException extends BaseException{
  constructor(config) {
    super(config)
    this.setDefault({
      httpCode: 401,
      status: 90000,
      message: 'Token已过期或无效'
    })
  }
}
