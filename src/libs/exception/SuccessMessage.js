import {Exception} from "./Exception"

export class SuccessMessage extends Exception{
  constructor(config) {
    super(config)
    this.setDefault({
      httpCode: 200,
      status: 1,
      message: '请求成功'
    })
  }
}
