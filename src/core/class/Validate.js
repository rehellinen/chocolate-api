/**
 *  Validate.js
 *  Create By rehellinen
 *  Create On 2018/10/12 21:21
 */
import validator from 'validator'
import { ValidateMethods } from './ValidateMethods'
import { getParams, isFunction } from '../utils'
import { validateMap } from '../decorator'
import { LibsNotFound, ParamsException } from '../exception'


export class Validate extends ValidateMethods {
  // 场景配置
  scene = {}

  // 错误信息
  errors = {}

  async check (ctx, scene) {
    const checkedParams = {}
    const params = await getParams(ctx)
    // 获取该场景需要验证的所有字段
    const fields = this.scene[scene]
    // 获取验证器定义的所有字段的验证方法
    const allRules = validateMap.get(this.constructor.prototype)

    for (const field of fields) {
      // 单个字段的所有验证方法
      const rules = allRules[field]

      for (const [funcName, errInfo, funcParams] of rules) {
        if (isFunction(this[funcName])) {
          // 优先使用自定义验证函数
          if (!this[funcName](params, field, ...funcParams)) {
            this._addError(field, errInfo)
          }
        } else if (isFunction(validator[funcName])) {
          // 第三方库 - validator.js
          if (!validator[funcName](params[field], ...funcParams)) {
            this._addError(field, errInfo)
          }
        } else {
          throw new LibsNotFound({
            message: `未找到验证器方法${funcName}`
          })
        }
      }
      checkedParams[field] = params[field]
    }
    if (Object.keys(this.errors).length > 0) {
      throw new ParamsException({
        data: this.errors
      })
    }
    ctx.checkedParams = checkedParams
  }

  _addError (field, errInfo) {
    if (!Array.isArray(this.errors[field])) {
      this.errors[field] = []
    }
    this.errors[field].push(errInfo)
  }
}
