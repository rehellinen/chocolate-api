基于Koa2的API框架
====================

### 框架目录：
~~~
|-- config            配置文件目录
|-- controller        控制器
|-- exception         自定义错误类型
|-- libs              框架核心类库
|   |-- decorator     装饰器
|   |-- exception     异常
|   |-- middleware    中间件
|   |-- model         模型
|   |-- token         Token令牌
|   |-- validate      验证器
|-- model             模型
|-- router            路由
|-- validate          自定验证器
|-- utils             工具  
~~~
libs 是框架核心类库，一般不需要修改其中的代码。
其他目录在下面会有详细介绍。

## 框架基本用法
### 路由：
最简单的路由定义如下：
```
@controller('index')
class IndexRouter {
  @get('user')
  async getToken (ctx, next) {
    await index.index(ctx, next)
  }
}
```
上述代码定义了用get方法访问'index/user'的路由
其余HTTP方式用的装饰器: @post, @put, @del

>建议：路由层仅负责路由转发，控制器层负责业务逻辑编写。


### 配置：
```
|-- config            配置文件目录
|   |-- config.js     框架核心配置文件
|   |-- custom.js     自定义配置
|   |-- database.js   数据库配置
|   |-- index.js      汇总上述配置文件
```
>注：配置项在文件中有详细注释
