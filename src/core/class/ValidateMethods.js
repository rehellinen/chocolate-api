/**
 *  ValidateMethods.js
 *  Create By rehellinen
 *  Create On 2018/10/13 10:24
 */

export class ValidateMethods {
  require (data = {}, field = '') {
    return data[field] != null && data[field] !== ''
  }

  empty (data = {}, field = '') {
  }

  positiveInt (data = {}, field = '') {
    return /(^[1-9]\d*$)/.test(data[field])
  }
}
