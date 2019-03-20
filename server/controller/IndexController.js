/**
 *  IndexController.js
 *  Create By rehellinen
 *  Create On 2019/3/19 23:06
 */
import {SuccessMessage} from "../common/exception/SuccessMessage"

export class IndexController {
  index (ctx, next) {
    throw new SuccessMessage({
      message: '成功访问'
    })
  }
}
