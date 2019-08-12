import {
  controller,
  get,
  post,
  mixin,
  auth,
  validate,
  getConfig,
  middleware,
  Upload
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

  @middleware(new Upload().getMiddleware())
  @post('upload')
  upload = 'index.upload'
}
