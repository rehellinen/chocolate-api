/**
 *  config.js
 *  Create By rehellinen
 *  Create On 2018/10/26 15:07
 */

export default {
  DEBUG: true,

  WECHAT: {
    APP_ID: 'wxe869b1edab698fd5',
    APP_SECRET: 'b9ee1d34857dc6cf06a3a008e483a06b'
  },

  WECHAT_API: {
    // 需要三个参数。1.appid 2.secret 3.js_code 4.grant_type = authorization_code
    MP_OPENID: 'https://api.weixin.qq.com/sns/jscode2session'
  },

  DATABASE: {
    host: 'cdb-o82ih1uv.gz.tencentcdb.com',
    port: 10040,
    user: 'test',
    password: 'a12345678',
    database: 'competition',
    charset: 'utf8'
  },

  TOKEN_PREFIX: 'chenqixuan@github.com/rehellinen',
  TOKEN_EXPIRES_IN: 7200 * 1000,
  SCOPE: {
    USER: 10,
    SUPER: 30
  },

  STATUS: {
    NORMAL: 1,
    DELETED: -1,
    ABNORMAL: 0
  }
}
