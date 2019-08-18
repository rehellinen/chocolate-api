/**
 *  base.conf.js
 *  Create By rehellinen
 *  Create On 2018/10/26 15:07
 */
// 框架核心功能配置
export default {
  PORT: 3000, // 端口号
  HOST: '127.0.0.1', // 地址
  DEBUG: true, // 是否开启调试模式
  // CORS相关
  CORS: {
    OPEN: false, // 是否开启
    METHODS: ['GET', 'POST', 'DELETE', 'PUT'], // 允许的方法
    ORIGIN: '*', // Access-Control-Allow-Origin
    MAX_AGE: 5, // Access-Control-Max-Age
    CREDENTIALS: true, // Access-Control-Allow-Credentials
    // Access-Control-Expose-Headers
    EXPOSE_HEADERS: ['WWW-Authenticate', 'Server-Authorization'],
    // Access-Control-Allow-Methods
    ALLOW_HEADERS: ['Content-Type', 'Authorization', 'Accept', 'token', 'Content-Length', 'X-Requested-With']
  },
  // 上传文件相关
  UPLOAD: {
    UPLOAD_DIR: 'upload', // 上传文件的根目录，upload表示/src/upload/
    UPLOAD_NAME: 'file' // 表单中表示上传文件的key
  },
  // TOKEN相关
  TOKEN: {
    TOKEN_PREFIX: 'github.com/rehellinen', // 生成token的前缀
    TOKEN_EXPIRES_IN: 7200, // token过期时间（单位为s）
    // token权限
    SCOPE: {
      USER: Symbol('user'),
      SUPER: Symbol('super')
    }
  },
  // 数据库连接
  DATABASE: {
    host: '127.0.0.1', // 主机
    port: 3306, // 端口号
    user: 'root', // 登录账户
    password: '123456', // 密码
    database: '', // 数据库名称
    charset: 'utf8' // 字符集
  },
  // 模型中用到的配置
  MODEL: {
    CONVERT_FIELDS: true, // 是否自动转换驼峰命名法 / 下划线命名法
    PAGE_SIZE: 15, // 分页大小
    // 数据库字段status的映射
    STATUS: {
      NORMAL: 1,
      ABNORMAL: 0,
      DELETED: -1
    }
  }
}
