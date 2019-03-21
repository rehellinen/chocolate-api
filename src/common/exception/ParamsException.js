/**
 *  ParamException.js
 *  Create By rehellinen
 *  Create On 2018/10/13 10:34
 */
import {Exception} from "../../libs/exception/Exception"

export class ParamsException extends Exception{
  constructor(config) {
    super(config)
    this.setDefault({
      httpCode: 400,
      status: 10000,
      message: '参数错误'
    })
  }
}
