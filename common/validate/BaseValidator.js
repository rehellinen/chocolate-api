const { Validator, rule } = require('rehellinen-api-core')

export class BaseValidator extends Validator {
  @rule('isInt', 'id必须为正整数', { min: 1 })
  @rule('require', 'id不能为空')
  id

  isLegalAccount (key, value, params) {
    return value.toString().length === 10 && value.startsWith('2019')
  }
}
