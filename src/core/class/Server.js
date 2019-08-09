/**
 *  Server.js
 *  Create By rehellinen
 *  Create On 2019/3/19 22:39
 */
import Koa from 'koa'
import R from 'ramda'
import chalk from 'chalk'
import { r, getConfig } from '../utils'

const config = getConfig()

export class Server {
  // Koa2实例
  app = new Koa()

  // 中间件配置
  middlewares = ['exception', 'router']

  // 监听IP
  host = process.env.HOST || config.HOST || '127.0.0.1'

  // 监听端口
  port = process.env.PORT || config.PORT || 3000

  constructor () {
    if (config.CORS.OPEN) {
      this.middlewares.splice(1, 0, 'cors')
    }
  }

  start () {
    // 使用中间件
    this.useMiddlewares()(this.middlewares)
    // 设置监听
    this.app.listen(this.port, this.host)
    console.log(chalk.blue(`Welcome to use rehellinen-api ^ ^`))
    console.log(chalk.blue(`Server listens on ${this.host}:${this.port}`))
  }

  useMiddlewares () {
    return R.map(R.pipe(
      item => `${r('./core/middleware')}/${item}`,
      require,
      R.map(item => item(this.app))
    ))
  }
}
