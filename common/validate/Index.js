/**
 *  validate.js
 *  Create By rehellinen
 *  Create On 2018/10/12 22:38
 */
import { rule, Validator, type, extend } from 'rehellinen-api-core'
import { BaseValidator } from './BaseValidator'

// 模拟异步请求
const http = () => new Promise(resolve => {
  setTimeout(() => {
    resolve({ res: 'test' })
  }, 500)
})

@extend(BaseValidator)
class Index extends Validator {
  scene = {
    add: ['id', 'account', 'name']
  }

  @rule('matches', '名称格式不合法', /test$/)
  name = 'foo_test'

  // isLegalAccount在BaseValidator中已定义
  @rule('isLegalAccount', '账户格式不合法')
  @type('int')
  account = async () => {
    const { res } = await http()
    return res
  }
}

export { Index }
