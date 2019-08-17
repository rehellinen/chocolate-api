/**
 *  router.js
 *  Create By rehellinen
 *  Create On 2018/10/25 20:37
 */
import Router from 'koa-router'
import glob from 'glob'
import R from 'ramda'
import { r } from '../utils'
import { routerMap } from '../decorator'

export const router = app => {
  const router = new Router()
  // 执行路由文件
  R.map(require)(glob.sync(r('./app/router/**/*.js')))
  // 生成路由
  for (const conf of routerMap.values()) {
    const routerPath = conf.target.prefix + conf.path
    router[conf.method](routerPath, ...conf.actions)
  }
  app.use(router.routes())
  app.use(router.allowedMethods())
}
