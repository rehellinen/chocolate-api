/**
 *  Methods.js
 *  Create By rehellinen
 *  Create On 2018/10/13 10:24
 */
import {ParamsException} from "../exception/ParamsException"

export class Methods {
  require (data = {}, field = '', errInfo = '') {
    if (!data[field]) {
      throw new ParamsException({
        message: `${errInfo ? errInfo : field}不能为空`
      })
    }
  }
}
