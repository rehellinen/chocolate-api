/**
 *  Multer.js
 *  Create By rehellinen
 *  Create On 2019/3/12 12:54
 */
import Multer from 'koa-multer'
import fs from 'fs'
import { promisify } from 'util'
import { r, getConfig } from '../utils'

const config = getConfig('upload')

export class Upload {
  // 存放文件的路径
  destination = ''

  getMiddleware () {
    const storage = Multer.diskStorage({
      destination: this.destination,
      filename (ctx, file, cb) {
        const ext = file.originalname.split('.').pop()
        const filename = `${Date.now()}.${ext}`
        cb(null, filename)
      }
    })
    return async (ctx, next) => {
      // 生成文件夹
      await this.initDir()
      // 使用koa-multer放置文件
      await Multer({ storage })
        .single(config.UPLOAD_NAME)(ctx, next)
    }
  }

  async initDir () {
    // 获取当前年月日组合而成的字符串
    const date = new Date()
    const month = date.getMonth().toString().length === 1
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1
    const today = `${date.getFullYear()}${month}${date.getDate()}`
    // 判断是否有存放文件的文件夹
    this.destination = r(`${config.UPLOAD_DIR}/${today}`)
    try {
      await promisify(fs.readdir)(this.destination)
    } catch (e) {
      await promisify(fs.mkdir)(r(`${config.UPLOAD_DIR}`))
      await promisify(fs.mkdir)(r(`${config.UPLOAD_DIR}/${today}`))
    }
  }
}
