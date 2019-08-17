/**
 *  User.js
 *  Create By rehellinen
 *  Create On 2018/9/28 20:37
 */
import md5 from 'md5'
import cache from 'memory-cache'
import { getRandChars, getConfig } from '../utils'
import { TokenException } from '../exception'

const config = getConfig('token')

export class Token {
  expireTime = config.TOKEN_EXPIRES_IN


  /**
   * 获取Token的主方法
   * @param scope 权限值
   * @param expireTime 过期时间（单位为秒）
   * @param cachedData 需要缓存的数据
   */
  get ({ scope, expireTime, cachedData = {} }) {
    if (expireTime) {
      this.expireTime = expireTime * 1000
    }
    Object.assign({}, cachedData, { scope })
    return this._saveToCache(cachedData)
  }

  /**
   * 验证权限是管理员
   */
  static isSuper () {
    Token.checkScope(this.ctx, config.SCOPE.SUPER)
  }

  /**
   * 验证权限是否合法
   * @param scope 权限值
   */
  static checkScope (scope) {
    const cachedScope = Token.getSpecifiedValue(this.ctx, 'scope')
    if (scope !== cachedScope) {
      throw new TokenException()
    }
  }

  /**
   * 获取缓存的指定数据
   * @param key 缓存的键
   * @return {*}
   */
  static getSpecifiedValue (key) {
    const info = cache.get(this.ctx.header.token)

    if (!info || !JSON.parse(info)[key]) {
      throw new TokenException()
    }

    return JSON.parse(info)[key]
  }

  /**
   * 检查Token是否过期
   */
  static checkToken () {
    const token = cache.get(this.ctx.header.token)
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
    const prefix = config.TOKEN_PREFIX

    return md5(`${str}-${time}-${prefix}`)
  }

  /**
   * 保存Token到缓存
   * @param cachedValue 需要保存的信息
   */
  _saveToCache (cachedValue) {
    const cachedKey = Token._generateToken()
    cache.put(cachedKey, JSON.stringify(cachedValue),
      this.expireTime, () => cache.del(cachedKey)
    )
    return cachedKey
  }
}
