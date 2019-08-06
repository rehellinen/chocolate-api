import { controller, get, mixin, auth, validate } from '../../core'

@controller('index')
class Index {
  @validate({
    name: 'index',
    scene: 'id'
  })
  @auth('super')
  @get('')
  index = 'index.index'
}
