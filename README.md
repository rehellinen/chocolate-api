基于Koa2的API框架
====================

### 框架目录：
~~~
|-- config            配置文件目录
|-- controller        控制器
|-- model             模型
|-- utils             工具  
|-- common            公共模块目录
|   |-- exception     用户自定义异常 / 框架内置异常
|   |-- validate      验证器
|   |-- router        路由
|-- libs              框架核心类库
|   |-- config        配置
|   |-- decorator     装饰器
|   |-- exception     异常处理
|   |-- middleware    中间件
|   |-- model         模型
|   |-- token         Token令牌
|   |-- validate      验证器
~~~
libs 是框架核心类库，一般不需要修改其中的代码。

## 框架基本用法
### （一）路由：
路由文件存放目录：/common/router  

#### 路由定义
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
其余HTTP方式所用的装饰器: @post, @put, @del

> 建议：路由层仅负责路由转发，控制器层负责业务逻辑编写。


### （二）配置：
配置文件存放目录：/config
```
|-- config            配置文件目录
|   |-- config.js     框架核心配置文件
|   |-- custom.js     自定义配置
|   |-- database.js   数据库配置
```
> 注：配置项具体作用在文件中有详细注释

#### 获取配置
GLOBAL_CONF配置为true时，可用$config访问配置。


### （三）异常：
自定义异常存放目录：/common/exception    
#### 返回的JSON格式：
```
{
  "status": 1,
  "message": "成功访问"
}
```

#### 抛出异常
```
throw new SuccessMessage({
  status: 10000,          // 自定义错误码
  httpCode: 200,          // http状态码
  message: '成功访问',    // 返回的描述信息
  data: {success: true}   // 返回的数据
})
```

#### 自定义异常
```
export class ParamsException extends BaseException{
  constructor(config) {
    super(config)
    this.setDefault({
      httpCode: 400,
      status: 10000,
      message: '参数错误'
    })
  }
}
```
> 当发生HTTP状态码为500的错误时：  
只有DEBUG设置为true，会展示详细错误信息。


### （四）验证器
验证器存放目录：/common/validate  
#### 使用方式
需要配合路由使用：
```
@controller('index')
class IndexRouter {
  @get('user')
  @validate({name: 'index', scene: 'id'})
  // 上述代码表示去寻找IndexValidate中scene为id的字段
  async getToken (ctx, next) { }
}
```

#### 自定义验证器
```
export class IndexValidate extends BaseValidate{
  constructor() {
    super()
    this.rules = {
      id: ['require', 'id']
    }

    this.scene = {
      id: ['id']
    }
  }
}
```
rules为一个对象：  
键为需要校验的数据名称。  
值为一个数组，第一项为规则，第二项为出现错误时的错误提示。

scene为一个对象：  
键为情景名称。  
值为一个数组，数组元素为需要校验的数据名称。
