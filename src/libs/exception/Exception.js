export class Exception extends Error{
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

  setDefault ({httpCode, status, message}) {
    if (!this.httpCode) this.httpCode = httpCode
    if (!this.status) this.status = status
    if (!this.message) this.message = message
  }

  getError () {
    return {
      status: this.status,
      message: this.message,
      data: this.data || {}
    }
  }
}
