/**
 *  PushValidate.js
 *  Create By rehellinen
 *  Create On 2018/10/12 22:38
 */
import {Validate} from "../../core"

export class IndexValidate extends Validate{
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
