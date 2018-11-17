import {controller, get, post, put} from "../common/decorator/router"
import {OrganizationController} from "../controller/OrganizationController"
import {validate, auth} from "../common/decorator/middleware"

@controller('organization')
class OrganizationRouter {
  @post('/')
  @auth('user')
  @validate({name: 'Organization', scene: 'register'})
  async register (ctx, next) {
    await OrganizationController.register(ctx, next)
  }

  @get('/')
  @auth('user')
  async get (ctx, next) {
    await OrganizationController.get(ctx, next)
  }

  @put('/')
  @auth('user')
  @validate({name: 'Organization', scene: 'edit'})
  async put (ctx, next) {
    await OrganizationController.put(ctx, next)
  }
}
