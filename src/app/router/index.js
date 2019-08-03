/**
 *  Token.js
 *  Create By rehellinen
 *  Create On 2018/10/25 23:08
 */
import {controller, get, mixin} from "../../core"
import {auth, validate} from "../../core"
import {IndexController} from "../controller/IndexController"
import {CmsMixin} from './mixins'

const index = new IndexController()

@mixin(CmsMixin)
@controller('index')
class Index {
  @get('')
  @validate({name: 'index', scene: 'id'})
  // @auth('super')
  async getToken (ctx, next) {
    await index.index(ctx, next)
  }
}
