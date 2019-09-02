/**
 *  Validator.js
 *  Create By rehellinen
 *  Create On 2018/10/12 21:21
 */
import validator from 'validator'
import { ValidateMethods } from './ValidateMethods'
import { getParams, isFunction, toString } from '../utils'
import { validateMap } from '../decorator'
import { LibsNotFound, ParamsException } from '../exception'


export class Validator extends ValidateMethods {
  // 原始的参数列表
  rawParams = {}

  // 经过验证和转型后的参数列表
  checkedParams = {}

  // 场景配置
  scene = {}

  // 错误信息
  errors = {}

  // 当前正在处理的数据的Key
  _key = ''

  // 当前正在处理的数据的Value
  _value = ''

  /**
   * 验证主方法
   * @param ctx Koa2上下文
   * @param scene 场景
   */
  async check (ctx, scene) {
    this.rawParams = await getParams(ctx)
    // 获取该场景需要验证的所有字段
    const keys = this.scene[scene]
    // 获取所有字段的所有验证规则
    const allRules = validateMap.get(this.constructor.prototype)

    for (const key of keys) {
      this._key = key
      this._value = toString(this.rawParams[key])

      const rules = allRules[key]
      if (rules._default && !this._value.trim()) {
        // 处理默认值的情况。undefined、null、''、'   '均视为未传值
        if (isFunction(rules._default)) {
          rules._default = await rules._default()
        }
        this.checkedParams[key] = rules._default
      } else {
        for (const rule of rules) {
          await this._validate(rule)
        }
        this._convertDataType(rules)
      }
    }
    // 处理异常
    if (Object.keys(this.errors).length > 0) {
      throw new ParamsException({
        data: this.errors
      })
    }
    // 在ctx上暴露接口
    ctx.validator = this
    ctx.checkedParams = this.checkedParams
  }

  /**
   * 转换数据类型
   * @param rules
   */
  _convertDataType (rules) {
    let value = this._value
    const funcNames = rules.map((item) => item[0])

    if (funcNames.includes('isInt') || rules._type === 'int') {
      value = validator.toInt(value)
    } else if (funcNames.includes('isFloat') || rules._type === 'float') {
      value = validator.toFloat(value)
    } else if (funcNames.includes('isBoolean') || rules._type === 'boolean') {
      value = validator.toBoolean(value)
    }
    this.checkedParams[this._key] = value
  }

  /**
   * 使用验证函数进行验证
   * @param rule 由[funcName（函数名）, errInfo（错误提示）, funcParams（额外参数）]组成
   */
  async _validate (rule) {
    const [funcName, errInfo, funcParams] = rule

    if (isFunction(this[funcName])) {
      // 优先使用自定义验证函数
      if (!await this[funcName](this._key, this.rawParams[this._key], this.rawParams, ...funcParams)) {
        this._addError(errInfo)
      }
    } else if (isFunction(validator[funcName])) {
      // 第三方库 - validator.js
      if (!validator[funcName](this._value, ...funcParams)) {
        this._addError(errInfo)
      }
    } else {
      throw new LibsNotFound({
        message: `未找到验证器方法${funcName}`
      })
    }
  }

  /**
   * 保存错误信息
   * @param errInfo 错误信息
   */
  _addError (errInfo) {
    const key = this._key
    if (!Array.isArray(this.errors[key])) {
      this.errors[key] = []
    }
    this.errors[key].push(errInfo)
  }
}
