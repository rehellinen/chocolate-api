import { Exception } from './Exception'

export class DatabaseException extends Exception {
  constructor (config) {
    super(config)
    this.setDefault({
      httpCode: 404,
      status: 40000,
      message: '获取数据失败'
    })
  }
}
