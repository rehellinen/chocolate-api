import { controller, get, mixin, auth, validate } from '../../core'

@controller('index')
class IndexRouter {
  @validate({
    name: 'index',
    scene: 'id'
  })
  @auth('super')
  @get('')
  index = 'index.index'
}
