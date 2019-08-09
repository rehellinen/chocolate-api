/**
 *  Index.js
 *  Create By rehellinen
 *  Create On 2019/3/19 22:00
 */
import baseConf from '../../config/base.conf'
import devConf from '../../config/dev.conf'
import prodConf from '../../config/prod.conf'
import { isProduction } from '../utils'

export default {
  ...baseConf,
  ...(isProduction ? prodConf : devConf)
}
