/**
 *  PushValidate.js
 *  Create By rehellinen
 *  Create On 2018/10/12 22:38
 */
import { rule, Validate } from '../../core'

export class IndexValidate extends Validate {
  scene = {
    id: ['id']
  }

  @rule('require', 'id不能为空')
  id
}
