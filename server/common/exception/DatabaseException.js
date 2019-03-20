import {BaseException} from "../../libs/exception/BaseException"

export class DatabaseException extends BaseException{
  constructor(config) {
    super(config)
    this.setDefault({
      httpCode: 404,
      status: 40000,
      message: '获取数据失败'
    })
  }
}
