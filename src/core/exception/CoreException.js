import { Exception } from './Exception'

class DatabaseException extends Exception {
  constructor (config) {
    super(config)
    this.setDefault({
      httpCode: 404,
      status: 40000,
      message: '获取数据失败'
    })
  }
}

class ParamsException extends Exception {
  constructor (config) {
    super(config)
    this.setDefault({
      httpCode: 400,
      status: 10000,
      message: '参数错误'
    })
  }
}

class TokenException extends Exception {
  constructor (config) {
    super(config)
    this.setDefault({
      httpCode: 401,
      status: 90000,
      message: 'Token已过期或无效'
    })
  }
}

export { DatabaseException, ParamsException, TokenException }
