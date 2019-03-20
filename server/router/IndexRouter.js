/**
 *  Token.js
 *  Create By rehellinen
 *  Create On 2018/10/25 23:08
 */
import {controller, get} from "../libs/decorator/router"
import {auth, validate} from "../libs/decorator/middleware"
import {IndexController} from "../controller/IndexController"

const index = new IndexController()

@controller('index')
class IndexRouter {
  @get('')
  @validate({name: 'Index', scene: 'id'})
  // @auth('super')
  async getToken (ctx, next) {
    await index.index(ctx, next)
  }
}
