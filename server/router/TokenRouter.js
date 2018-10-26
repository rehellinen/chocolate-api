/**
 *  Token.js
 *  Create By rehellinen
 *  Create On 2018/10/25 23:08
 */
import {controller, get} from "../common/decorator/router"
import {TokenController} from "../controller/TokenController"

@controller('token')
class TokenRouter {
  @get('')
  getToken (ctx, next) {
    TokenController.getToken(ctx, next)
  }
}
