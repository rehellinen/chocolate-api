/**
 *  BuyerToken.js
 *  Create By rehellinen
 *  Create On 2018/10/18 14:53
 */
import {Token} from "./Token"
import {BuyerModel} from "../../../../weixin_nuxt/server/model/BuyerModel"

export class UserToken extends Token{
  constructor() {
    const conf = {
      appId: $config.WECHAT.APP_ID,
      appSecret: $config.WECHAT.APP_SECRET,
      url: $config.WECHAT_API.MP_OPENID
    }
    super(conf)
  }


  async get (code) {
    // 从微信服务器拿到openId
    const data = await this.getFromWechat({
      grant_type: 'authorization_code',
      js_code: code
    })
    // 存入数据库并返回用户ID
    const userId = await (new BuyerModel()).saveOpenId(data.openid)
    // 生成需要缓存的数据
    const cachedData = {
      id: userId,
      scope: config.SCOPE.BUYER
    }
    // 生成Token以及相关数据
    return this.saveToCache(cachedData)
  }
}
