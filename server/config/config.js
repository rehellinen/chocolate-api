/**
 *  config.js
 *  Create By rehellinen
 *  Create On 2018/10/26 15:07
 */
// 框架核心功能配置
export default {
  // 是否开启调试模式
  DEBUG: true,
  // 生成token的前缀
  TOKEN_PREFIX: 'chenqixuan@github.com/rehellinen',
  // token过期时间（单位为ms）
  TOKEN_EXPIRES_IN: 7200 * 1000,
  // token的作用域
  SCOPE: {
    USER: 10,
    SUPER: 30
  },
}
