/**
 *  Token.js
 *  Create By rehellinen
 *  Create On 2018/10/25 23:08
 */
import {controller, get} from "../common/decorator/router"
import {TokenController} from "../controller/TokenController"
import {validate, auth} from "../common/decorator/middleware"

@controller('token')
class TokenRouter {
  @get('user')
  @auth('user')
  @validate({name: 'User', scene: 'push'})
  async getToken (ctx, next) {
    await TokenController.getToken(ctx, next)
  }


  @get('check')
  @auth('user')
  @validate({name: 'User', scene: 'push'})
  async checkToken (ctx, next) {
    await TokenController.checkToken(ctx, next)
  }
}
