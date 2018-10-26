/**
 *  config.js
 *  Create By rehellinen
 *  Create On 2018/10/26 15:07
 */

export default {
  WECHAT: {
    APP_ID: 'test',
    APP_SECRET: 'test'
  },

  WECHAT_API: {
    // 需要三个参数。1.appid 2.secret 3.js_code 4.grant_type = authorization_code
    MP_OPENID: 'https://api.weixin.qq.com/sns/jscode2session'
  },

  DATABASE: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'lecture',
    charset: 'utf8'
  }
}
