const {
  prefix,
  get,
  post,
  auth,
  validate,
  getConfig,
  middleware,
  upload
} = require('rehellinen-api-core')

const config = getConfig('token.scope')

@prefix('index')
class IndexRouter {
  @validate('index', 'add') @auth(config.SUPER) @post('')
  index = 'index.index'

  @middleware(upload()) @post('upload')
  upload = 'index.upload'
}
