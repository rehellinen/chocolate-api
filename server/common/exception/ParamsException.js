/**
 *  ParamException.js
 *  Create By rehellinen
 *  Create On 2018/10/13 10:34
 */
import {BaseException} from "../../libs/exception/BaseException"

export class ParamsException extends BaseException{
  constructor(config) {
    super(config)
    this.setDefault({
      httpCode: 400,
      status: 10000,
      message: '参数错误'
    })
  }
}
