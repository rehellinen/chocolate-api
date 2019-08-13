import {
  controller,
  get,
  post,
  auth,
  validate,
  getConfig,
  middleware,
  upload
} from '../../core'

const config = getConfig('token.scope')

@controller('index')
class IndexRouter {
  @validate({
    name: 'index',
    scene: 'id'
  })
  @auth(config.SUPER)
  @get('')
  index = 'index.index'

  @middleware(upload())
  @post('upload')
  upload = 'index.upload'
}
