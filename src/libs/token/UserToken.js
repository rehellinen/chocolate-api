/**
 *  BuyerToken.js
 *  Create By rehellinen
 *  Create On 2018/10/18 14:53
 */
import {Token} from "./Token"
import {UserModel} from "../../../model/UserModel"

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
    const data = await this.getFromUrl({
      grant_type: 'authorization_code',
      js_code: code
    })
    // 存入数据库并返回用户ID
    const userId = await (new UserModel()).saveOpenId(data.openid)
    // 生成需要缓存的数据
    const cachedData = {
      id: userId,
      scope: $config.SCOPE.USER
    }
    // 生成Token以及相关数据
    return this.saveToCache(cachedData)
  }
}
