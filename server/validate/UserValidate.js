/**
 *  PushValidate.js
 *  Create By rehellinen
 *  Create On 2018/10/12 22:38
 */
import {BaseValidate} from "../libs/validate/BaseValidate"

export class UserValidate extends BaseValidate{
  constructor() {
    super()
    this.rules = {
      code: ['require|positiveInt', 'code不能为空|code必须为数字']
    }

    this.scene = {
      push: ['code']
    }
  }
}
