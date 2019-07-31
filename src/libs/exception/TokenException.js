import {Exception} from "./Exception"

export class TokenException extends Exception{
  constructor(config) {
    super(config)
    this.setDefault({
      httpCode: 401,
      status: 90000,
      message: 'Token已过期或无效'
    })
  }
}
