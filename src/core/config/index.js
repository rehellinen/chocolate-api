/**
 *  Index.js
 *  Create By rehellinen
 *  Create On 2019/3/19 22:00
 */
import dbConfig from '../../config/database'
import baseConfig from '../../config/config'
import customConfig from '../../config/custom'

export const config = Object.assign(
  {},
  baseConfig,
  customConfig,
  { DATABASE: dbConfig }
)
