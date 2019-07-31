/**
 *  Multer.js
 *  Create By rehellinen
 *  Create On 2019/3/12 12:54
 */
import {r} from "./utils"
import Multer from 'koa-multer'
import config from '../config'

const uploadName = config.UPLOAD_NAME
const date = new Date()
const month = date.getMonth().toString().length  === 1
  ? '0' + (date.getMonth() + 1)
  : date.getMonth() + 1
const today = `${date.getFullYear()}${month}${date.getDate()}`
let fileName = ''

const storage = Multer.diskStorage({
  destination: r(`${config.UPLOAD_DIR}/${today}`),
  filename (ctx, file, cb) {
    const filenameArr = file.originalname.split('.')
    fileName = `${Date.now()}.${filenameArr[filenameArr.length - 1]}`
    cb(null, fileName)
  }
})

const upload = Multer({storage}).single(uploadName)
export {upload}
