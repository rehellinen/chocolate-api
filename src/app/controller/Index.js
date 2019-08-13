import { Controller } from '../../core'

export class IndexController extends Controller {
  index () {
    this.json('成功访问')
  }

  upload () {
    this.json({
      message: '上传成功'
    })
  }
}
