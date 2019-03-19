/**
 *  ParamException.js
 *  Create By rehellinen
 *  Create On 2018/10/13 10:34
 */
import {BaseException} from "./BaseException"

export class ParamsException extends BaseException{
  constructor(config) {
    super(config)
    if (!this.httpCode) this.httpCode = 400
    if (!this.status) this.status = 10000
    if (!this.message) this.message = '参数错误'
  }
}
