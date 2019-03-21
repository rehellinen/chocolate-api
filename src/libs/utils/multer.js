/**
 *  Multer.js
 *  Create By rehellinen
 *  Create On 2019/3/12 12:54
 */
import {r} from "../utils/utils"
import Multer from 'koa-multer'

const uploadName = $config.UPLOAD_NAME
const date = new Date()
const today = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`
let fileName = ''

const storage = Multer.diskStorage({
  destination: r(`../../${$config.UPLOAD_DIR}/${today}`),
  filename (ctx, file, cb) {
    const filenameArr = file.originalname.split('.')
    fileName = `${Date.now()}.${filenameArr[filenameArr.length - 1]}`
    cb(null, fileName)
  }
})

const upload = Multer({storage}).single(uploadName)
export {fileName, upload}
