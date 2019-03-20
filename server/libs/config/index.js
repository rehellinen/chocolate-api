/**
 *  index.js
 *  Create By rehellinen
 *  Create On 2019/3/19 22:00
 */
import database from '../../config/database'
import config from '../../config/config'
import custom from '../../config/custom'

export default Object.assign(
  {}, config, custom, {database}
)
