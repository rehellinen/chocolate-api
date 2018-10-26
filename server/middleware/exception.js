import {types} from "../utils/mime"
import {BaseException} from "../common/exception/BaseException"

export const exception = (app) => {
  const exceptionHandler = async (ctx, next) => {
    try {
      await next()
    } catch (e) {
      if (e instanceof BaseException) {
        ctx.status = e.httpCode
        ctx.type = types.json
        ctx.body = e.getError()
      } else {
        console.log(e.toString())
        ctx.body = e.toString()
      }
    }
  }

  app.use(exceptionHandler)
}
