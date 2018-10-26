/**
 *  PushValidate.js
 *  Create By rehellinen
 *  Create On 2018/10/12 22:38
 */
import {BaseValidate} from "./BaseValidate"

export class UserValidate extends BaseValidate{
  constructor() {
    super()
    this.rules = {
      number: ['require', '学号'],
      telephone: ['require', '手机号'],
      type: ['require', '类型']
    }

    this.scene = {
      push: ['number', 'telephone', 'type']
    }
  }
}
