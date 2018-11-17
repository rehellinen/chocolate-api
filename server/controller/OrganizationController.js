/**
 *  Token.js
 *  Create By rehellinen
 *  Create On 2018/10/26 14:59
 */
import {SuccessMessage} from "../common/exception/SuccessMessage"
import {OrganizationModel} from "../model/OrganizationModel"
import {Token} from "../common/service/Token"

export class OrganizationController {
  static async register (ctx) {
    let savedData = ctx.checkedParams
    savedData.UID = Token.getSpecifiedValue(ctx)
    const token = await new OrganizationModel().saveOne(savedData)
    throw new SuccessMessage({ data: token })
  }
}
