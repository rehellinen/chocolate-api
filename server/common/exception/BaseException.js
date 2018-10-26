export class BaseException extends Error{
  constructor (config = {}) {
    super()
    if (config.hasOwnProperty('httpCode')) {
      this.httpCode = config.httpCode
    }
    if (config.hasOwnProperty('status')) {
      this.status = config.status
    }
    if (config.hasOwnProperty('message')) {
      this.message = config.message
    }
    if (config.hasOwnProperty('data')) {
      this.data = config.data
    }
  }

  getError () {
    return {
      httpCode: this.httpCode,
      status: this.status,
      message: this.message,
      data: this.data
    }
  }
}
