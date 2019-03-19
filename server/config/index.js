/**
 *  index.js
 *  Create By rehellinen
 *  Create On 2019/3/19 22:00
 */
import database from './database'
import config from './config'
import custom from './custom'
import wechat from './wechat'

export default Object.assign(
  {}, config, custom, {database}, {wechat}
)
