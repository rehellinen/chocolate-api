import {post, put} from '../../../core/decorator'
import {SuccessMessage} from '../../../core/exception'

export class CmsMixin {
  @post('/test')
  add () {
    throw new SuccessMessage()
  }

  @put('/test')
  edit () {
    throw new SuccessMessage()
  }
}
