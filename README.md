基于Koa2的后台框架
=============

## 主要技术点：
1. AOP：异常处理层、参数校验层、权限校验层
2. 分层：router、controller、model、service
3. 权限：Token令牌
4. 函数式编程：ramda
5. ES6特性：包括装饰器、async函数等等
6. ORM：bookshelf.js

## 怎么使用？

### 路由  
router文件夹中定义路由。  
一个简单的路由定义如下：
```
@controller('token')
class TokenRouter {
  @get('user')
  async getToken (ctx, next) {
    // 调用Token控制器
    await TokenController.getToken(ctx, next)
  }
```
@controller定义控制器  
接受一个参数，为控制器的名称

@get, @post, @put, @del, @all定义方法  
接受一个参数，为方法的名称

上面定义的路由可用下面的URL访问：  
```
GET：xxx.com/token/user
``` 
