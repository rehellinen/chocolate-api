/**
 *  Methods.js
 *  Create By rehellinen
 *  Create On 2018/10/13 10:24
 */
import {ParamsException} from "../../common/exception/ParamsException"

export class Methods {
  require (data = {}, field = '', fieldCN = '') {
    if (data[field] == null) {
      this.throw(field, fieldCN, '不能为空')
    }
  }

  positiveInt (data = {}, field = '', fieldCN = '') {
    if(!/(^[1-9]\d*$)/.test(data[field])) {
      this.throw(field, fieldCN, '必须为正整数')
    }
  }

  throw (field, fieldCN, message) {
    throw new ParamsException({
      message: (fieldCN ? fieldCN : field) + message
    })
  }
}
