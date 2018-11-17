import {controller, get, post} from "../common/decorator/router"
import {OrganizationController} from "../controller/OrganizationController"
import {validate, auth} from "../common/decorator/middleware"

@controller('organization')
class OrganizationRouter {
  @post('/')
  @auth('user')
  @validate({name: 'Organization', scene: 'register'})
  async getToken (ctx, next) {
    await OrganizationController.register(ctx, next)
  }
}
