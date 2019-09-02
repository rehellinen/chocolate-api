/**
 *  ValidateMethods.js
 *  Create By rehellinen
 *  Create On 2018/10/13 10:24
 */

export class ValidateMethods {
  require (key, value, params) {
    if (typeof value === 'string') {
      value = value.trim()
    }
    return value != null && value !== ''
  }
}
