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


### 路由篇：

