/**
 *  config.js
 *  Create By rehellinen
 *  Create On 2018/10/26 15:07
 */
// 框架核心功能配置
export default {
  // 端口号
  PORT: 9528,
  // 地址
  HOST: '127.0.0.1',
  // 是否开启调试模式
  DEBUG: true,
  // 是否允许API跨域访问
  ALLOW_CORS: false,
  // 是否把配置放到全局作用域（全局变量名称为：$config）
  GLOBAL_CONF: true,
  // 上传文件的根目录，upload表示/src/upload/
  UPLOAD_DIR: 'upload',
  // 上传文件的名称
  UPLOAD_NAME: 'file',
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
