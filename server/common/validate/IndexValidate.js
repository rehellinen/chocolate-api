/**
 *  PushValidate.js
 *  Create By rehellinen
 *  Create On 2018/10/12 22:38
 */
import {BaseValidate} from "../../libs/validate/BaseValidate"

export class IndexValidate extends BaseValidate{
  constructor() {
    super()
    this.rules = {
      id: ['require', 'id']
    }

    this.scene = {
      id: ['id']
    }
  }
}
