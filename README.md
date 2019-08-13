基于Koa2的API框架 - rehellinen-api
=======================

#### 新版框架重构中，预计八月底完成 ... 

#### 内置功能：
路由、控制器、配置、异常、验证器、模型、Token、文件上传等等。

### 框架目录：
~~~
|-- app
|   |-- router        路由
|   |-- controller    控制器
|   |-- model         模型 
|-- common            公共模块目录
|   |-- exception     用户自定义异常
|   |-- validate      验证器
|-- config            配置文件目录
|-- core              框架核心类库
|   |-- class         类文件
|   |-- decorator     装饰器
|   |-- exception     异常
|   |-- middleware    中间件
|   |-- utils         工具
~~~

## 框架基本用法
> 框架所有内置方法、类都通过 `/core/index.js` 获取
### （一）路由
#### 存放目录
/app/router

#### 路由类可使用的装饰器
1. `@controller` - 接收一个参数，为一级URL
2. `@get`, `@post`, `@put`, `@del` - 接收一个参数，为二级URL
3. `@middleware` - 增加一个中间件到koa-router
4. `@validate` - 详情可查看`验证器`部分
5. `@auth` - 详情可查看`权限管理`部分

#### 定义路由
```
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
```
几点说明：
1. 底层以koa-router实现 
2. 默认为二级路由（第二级可以为空），格式类似'/index/test'
3. 上面定义了以'GET'方法访问'/index'的路由，并且将跳转至'Index'的'index'方法。
4. `@get`等等http装饰器必须在最下层。
5. `@validate`在`@auth`之上时，先验证参数再验证权限。


### （二）控制器
控制器存放目录：/app/controller  

### （三）配置
配置文件存放目录：/config
```
|-- config                配置文件目录
|   |-- base.conf.js      基本配置
|   |-- dev.conf.js       自定义配置
|   |-- prod.conf.js      数据库配置
```
> 注：配置项具体作用在文件中有详细注释

#### 获取配置
使用助手函数：getConfig
```
// 获取所有配置
const config = getConfig()
```


### （四）异常
自定义异常存放目录：/common/exception    
#### 返回的JSON格式
```
{
  "status": 1,
  "message": "错误描述",
  "data": {}
}
```

#### 抛出异常
```
throw new DataBaseException({
  status: 10000,            // 自定义错误码
  httpCode: 404,            // http状态码
  message: '找不到数据',    // 返回的描述信息
  data: {success: true}    // 返回的数据
})
```

#### 内置异常
1. DataBaseException - 数据库错误
2. ParamsException - 参数错误
3. TokenException - 权限校验错误

#### 自定义异常
```
export class MyException extends Exception{
  constructor(config) {
    super(config)
    this.setDefault({
      httpCode: 401,
      status: 99999,
      message: '自定义异常'
    })
  }
}
```
> 当发生HTTP状态码为500的错误时：  
只有DEBUG设置为true，才展示详细错误信息。


### （五）验证器
#### 验证器存放目录
/common/validate  

#### 作用
对前端传来的数据进行校验。  
对GET、POST、PUT、DELETE方法携带的数据与路由参数均能进行校验。

#### 定义验证器
1. scene对象定义验证场景，可参考下面示例
2. `@rule`传入两个参数：  
(1)验证的方法名称。  
(2)验证不通过时的错误信息。
```
export class Index extends Validate {
  scene = {
    add: ['name'],
    edit: ['id', 'name']
  }

  @rule('require', 'id不能为空')
  @rule('positiveInt', 'id必须为正整数')
  id
  
  @rule('require', 'name不能为空')
  name
}
```

#### 使用验证器
1. 在路由中使用验证器  
2. `@validate`接受一个对象，对象包含name和scene两个属性  
(1) name为验证器的名称  
(2) scene为场景名称
```
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
```

#### 验证方法
```
require           // 不能为空
positiveInt       // 必须为正整数
```


### （六）模型
模型存放目录：/app/model  

#### 介绍
1. 基于Bookshelf.js，更多高级用法请参考Bookshelf文档
2. this.model可获取当前模型实例
  
#### 使用方式
`Model` 所在文件：/libs/model/Model.js
```
自定义模型：
export class IndexModel extends Model {
  constructor() {
    super({
      // 表名 
      tableName: 'article',
      // 定义关联模型
      relationConf: [
        {
          tableName: 'user', // 关联表名称
          local: 'id', // 主键
          foreign: 'user_id' // 外键
        }
      ]
    })
  }
}
```

#### Model实例方法：
参数解释:
1. id (Number) 数据的ID
2. condition (Object) 查询条件，有以下两种格式：  
    1. { status: 1, id: 6 }
    2. { status: ['=', 1], id: ['=', 6] }
3. order (Array) 排序条件
    1. ['order', 'id']   
    2. [ { field: 'order', rule: 'ASC' } ]
4. relation (Array) 关联模型名称   
5. pageConf (Object) 分页的配置
    1. pageSize - 单页大小
    2. page - 页码
6. data (Object|Array) 需要添加 / 更新的数据    
```
  // 根据id获取数据
  getOneById ({id, condition = {}, relation = []})
  
  // 获取所有数据
  getAll ({condition = {}, relation = [], order = ['id']}) 
    
  // 分页方法
  pagination ({
    pageConf = {}, 
    condition = {}, 
    relation = [], 
    order = ['id']
  })
  
  // 保存数据
  save (data)
  
  // 根据ID修改数据
  editById (id)
  
  // 根据特定条件修改一条数据
  edit ({condition = {}, data})
  
  // 根据ID删除数据
  deleteById (id)
  
  // 根据特定条件删除数据
  delete ({ condition = {} })
```

###（七）Token

#### 获取Token
```
new Token(scope).get(cachedData)
```

#### 其他方法
```
// 验证权限是否合法
static checkScope (ctx, scope)

// 验证权限是管理员
static isSuper (ctx)

// 获取缓存的指定数据
static getSpecifiedValue (ctx, key)

// 检查Token是否过期
static checkToken (ctx)
```

###（八）上传文件
底层使用的是koa-multer
（1）使用  
在路由中使用：
```
import { controller, post, middleware, upload } from '../../core'

@controller('image')
class ImageRouter {
  @post('')
  @middleware(upload)
  upload = 'index.upload'
}
```
（2）如何获取上传后的文件名
```
ctx.file / ctx.files中获取
```
