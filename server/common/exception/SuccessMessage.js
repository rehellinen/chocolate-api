import {BaseException} from "../../libs/exception/BaseException"

export class SuccessMessage extends BaseException{
  constructor(config) {
    super(config)
    this.setDefault({
      httpCode: 200,
      status: 1,
      message: '请求成功'
    })
  }
}
