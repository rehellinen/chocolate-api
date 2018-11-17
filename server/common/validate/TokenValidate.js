/**
 *  PushValidate.js
 *  Create By rehellinen
 *  Create On 2018/10/12 22:38
 */
import {BaseValidate} from "./BaseValidate"

export class TokenValidate extends BaseValidate{
  constructor() {
    super()
    this.rules = {
      code: ['require', 'code'],
      token: ['require', 'token']
    }

    this.scene = {
      check: ['token'],
      get: ['code']
    }
  }
}
