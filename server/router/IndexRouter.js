/**
 *  Token.js
 *  Create By rehellinen
 *  Create On 2018/10/25 23:08
 */
import {controller, get} from "../libs/decorator/router"
import {auth, validate} from "../libs/decorator/middleware"

@controller('index')
class IndexRouter {
  @get('user')
  @validate({name: 'Index', scene: 'get'})
  @auth('super')
  async getToken (ctx, next) {
    await TokenController.getToken(ctx, next)
  }
}
