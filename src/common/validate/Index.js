/**
 *  validate.js
 *  Create By rehellinen
 *  Create On 2018/10/12 22:38
 */
import { rule, Validator, type } from '../../core'

// 模拟异步请求
const http = () => new Promise(resolve => {
  setTimeout(() => {
    resolve({ res: 'test' })
  }, 500)
})

export class Index extends Validator {
  scene = {
    edit: ['id', 'account', 'name']
  }

  @rule('isInt', 'id必须为正整数', { min: 1 })
  @rule('require', 'id不能为空')
  id

  @rule('matches', '名称格式不合法', /test$/)
  name = 'foo_test'

  @rule('isLegalAccount', '账户格式不合法')
  @type('int')
  account = async () => {
    const { res } = await http()
    return res
  }

  isLegalAccount (key, value, params) {
    return value.toString().length === 10 && value.startsWith('2019')
  }
}
