/**
 *  Multer.js
 *  Create By rehellinen
 *  Create On 2019/3/12 12:54
 */
import Multer from 'koa-multer'
import { r, getConfig, dirExists, getTodayDate } from '../utils'

const config = getConfig('upload')

export const upload = () => async (ctx, next) => {
  // 获取当前年月日组合而成的字符串
  const today = getTodayDate()
  // 判断是否有存放文件的文件夹
  const destination = r(`${config.UPLOAD_DIR}/${today}`)
  await dirExists(destination)
  // koa-multer中间件
  const storage = Multer.diskStorage({
    destination,
    filename (ctx, file, cb) {
      const ext = file.originalname.split('.').pop()
      const filename = `${Date.now()}.${ext}`
      cb(null, filename)
    }
  })
  await Multer({ storage })
    .single(config.UPLOAD_NAME)(ctx, next)
}
