import { SuccessMessage } from '../../core'

export class IndexController {
  index (ctx, next) {
    throw new SuccessMessage({
      message: '成功访问'
    })
  }

  upload (ctx, next) {
    throw new SuccessMessage({
      message: '上传成功'
    })
  }
}
