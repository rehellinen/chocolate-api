import { Exception } from './Exception'

class MethodNotAllowed extends Exception {
  constructor (config) {
    super(config)
    this.setDefault({
      httpCode: 405,
      status: 10002,
      message: '方法不允许'
    })
  }
}

class NotFound extends Exception {
  constructor (config) {
    super(config)
    this.setDefault({
      httpCode: 404,
      status: 10001,
      message: '该URL未定义'
    })
  }
}

export { MethodNotAllowed, NotFound }
