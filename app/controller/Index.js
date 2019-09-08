const { Controller } = require('rehellinen-api-core')

export class Index extends Controller {
  index () {
    this.json({
      message: '成功访问'
    })
  }

  upload () {
    this.json({
      message: '上传成功'
    })
  }
}
