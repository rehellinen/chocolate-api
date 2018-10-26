/**
 *  Token.js
 *  Create By rehellinen
 *  Create On 2018/10/26 14:59
 */
import {UserToken} from "../common/service/UserToken"
import {SuccessMessage} from "../common/exception/SuccessMessage"

export class TokenController {
  static async getToken (ctx) {
    const token = await (new UserToken()).get(ctx.query.code)
    console.log(token)
    throw new SuccessMessage({
      data: {token}
    })
  }

  static checkToken () {

  }
}
