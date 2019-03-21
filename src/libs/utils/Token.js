/**
 *  User.js
 *  Create By rehellinen
 *  Create On 2018/9/28 20:37
 */
import md5 from 'md5'
import cache from 'memory-cache'
import {getRandChars} from './utils'
import {TokenException} from "../../common/exception/TokenException"

export class Token {
  /**
   * @param scope 权限值
   */
  constructor (scope) {
    this.scope = scope
  }

  /**
   * 获取Token的主方法
   * @param cachedData 需要缓存的数据
   */
  get (cachedData) {
    Object.assign(cachedData, { scope: this.scope })
    return this._saveToCache(cachedData)
  }

  /**
   * 验证权限是否合法
   * @param ctx koa2上下文
   * @param scope 权限值
   */
  static checkScope (ctx, scope) {
    const cachedScope = Token.getSpecifiedValue(ctx, 'scope')
    if (scope !== cachedScope) {
      throw new TokenException()
    }
  }

  /**
   * 获取缓存的指定数据
   * @param ctx koa2上下文
   * @param key 缓存的键
   * @return {*}
   */
  static getSpecifiedValue (ctx, key) {
    const info = cache.get(ctx.header.token)
    const infoObj =  JSON.parse(info)
    if (!info || !infoObj[key]) {
      throw new TokenException()
    }

    return infoObj[key]
  }

  /**
   * 检查Token是否过期
   * @param ctx Koa2上下文
   */
  static checkToken (ctx) {
    const token = cache.get(ctx.header.token)
    if (!token) {
      throw new TokenException()
    }
  }

  /**
   * 生成Token令牌
   */
  static _generateToken () {
    const str = getRandChars(32)
    const time = new Date().getTime()
    const prefix = $config.TOKEN_PREFIX

    return md5(`${str}-${time}-${prefix}`)
  }

  /**
   * 保存Token到缓存
   * @param cachedValue 需要保存的信息
   */
  _saveToCache (cachedValue) {
    const cachedKey = Token._generateToken()

    cache.put(cachedKey, JSON.stringify(cachedValue), $config.TOKEN_EXPIRES_IN, () => {
      cache.del(cachedKey)
    })
    return cachedKey
  }
}
