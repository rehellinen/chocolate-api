export class Exception extends Error {
  constructor (config = {}) {
    super()
    if (Reflect.has(config, 'httpCode')) {
      this.httpCode = config.httpCode
    }
    if (Reflect.has(config, 'status')) {
      this.status = config.status
    }
    if (Reflect.has(config, 'message')) {
      this.message = config.message
    }
    if (Reflect.has(config, 'data')) {
      this.data = config.data
    }
  }

  setDefault ({ httpCode, status, message }) {
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
