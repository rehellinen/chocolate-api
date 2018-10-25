/**
 *  Token.js
 *  Create By rehellinen
 *  Create On 2018/10/25 23:08
 */
import {controller, get} from "../common/decorator/router"

@controller('token')
class Token {
  @get('')
  getToken () {
    console.log('getToken')
  }
}
