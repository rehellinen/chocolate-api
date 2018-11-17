/**
 *  Token.js
 *  Create By rehellinen
 *  Create On 2018/10/26 14:59
 */
import {UserToken} from "../common/service/UserToken"
import {SuccessMessage} from "../common/exception/SuccessMessage"
import {Token} from "../common/service/Token"

export class TokenController {
  static async getToken (ctx) {
    const token = await new UserToken().get(ctx.query.code)
    throw new SuccessMessage({ data: token })
  }

  static checkToken (ctx) {
    Token.checkToken(ctx)
    throw new SuccessMessage()
  }
}
