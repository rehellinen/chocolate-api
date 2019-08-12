import {
  controller,
  get,
  mixin,
  auth,
  validate,
  getConfig
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
}
