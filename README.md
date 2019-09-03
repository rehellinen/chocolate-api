基于Koa2的API框架 - rehellinen-api
=======================

#### 内置功能：
1. 装饰器实现的路由
2. 功能强大的验证器
3. 全局异常处理
4. 基于Token的权限系统
5. 文件上传
6. 配置
7. 中间件
8. 控制器、模型

### 框架目录：
~~~
|-- app
|   |-- router        路由
|   |-- controller    控制器
|   |-- model         模型 
|-- common            公共模块目录
|   |-- exception     用户自定义异常
|   |-- validate      验证器
|   |-- middleware    中间件
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
1. `@prefix` - 接收一个参数，为一级URL
2. `@get`, `@post`, `@put`, `@del` - 接收一个参数，为二级URL
3. `@middleware` - 接受一个参数，为中间件，功能为增加一个中间件到koa-router
4. `@validate` - 详情可查看`验证器`部分
5. `@auth` - 详情可查看`权限管理`部分

#### 定义路由
```
@prefix('index')
class Index {
  @validate('index', 'id') @auth('super') @get('index') 
  index = 'index.index'
}
```
几点说明：
1. 底层以koa-router实现 
2. 提供一级 / 二级路由（均可为空）的形式帮助组织路由
3. 上面定义了以'GET'方法访问'/index'的路由，并且将跳转至'Index'的'index'方法。
4. `@get`等等http动词装饰器必须在最下层。
5. `@validate`在`@auth`之上时，先验证参数再验证权限。


### （二）验证器
#### 存放目录
/common/validate  

#### 简单介绍
对前端传来的数据进行校验。  
同时对`ctx.headers`, `ctx.params`, `ctx.query`, `ctx.body`中的参数进行校验。  
若上述四个对象中出现同样的key，则会发生覆盖的情况，为避免冲突，以上四个对象中不要传入相同key的参数。

#### 在路由中使用
1. 在路由中使用`@validate`定义需要使用的验证器及其场景  
2. `@validate`接受两个参数：  
(1) 验证器的文件名称（若需要使用`Index.js`，则填入`Index`或者`index`）  
(2) 场景名称
```
// 这是路由类
@prefix('index')
class Index {
  @validate('index', 'id') @auth('super') @get('')
  index = 'index.index'
}
```

#### 验证器类可使用的装饰器
1. `@rule` - 定义验证函数。  
传入若干个参数：  
(1)验证的方法名称（必填）  
(2)验证不通过时的错误信息（必填）  
(3)其他参数：传递给验证方法的参数
2. `@type` - 定义强制类型转换。  
传入一个参数，为`int`、`float`、`boolean`中其中一个
3. `@extend` - 继承另一个验证类定义的字段、方法。  
传入一个参数，为验证器类。

#### 定义一个简单的验证器
1. 必须继承`Validator`
2. 导出的类名称必须与文件名相同，并且首字母大写
```
export class Index extends Validator {
  scene = {
    add: ['account', 'name']
    edit: ['id', 'account', 'name']
  }
  
  @rule('require', 'ID不能为空')
  id
  
  @rule('require', '账户不能为空')
  account  
  
  @rule('require', '名称不能为空')
  name
}
```
上面的代码定义了三个类属性（`id`、`account`、`name`），并且通过`@rule`指定了相应的验证规则， 
以及两个验证场景（`add`、`edit`）。

#### 关于scene
使用类属性`scene`指定场景，`scene`为一个对象，key为场景名称，value为一个数组，表示该场景需要验证的所有参数。  
上例中定义了两个验证场景：
1. add场景验证account和name两个参数。
2. edit场景验证id、account和name三个参数。

#### 自定义验证方法
直接在类中编写即可：
```
export class Index extends Validator {
  scene = { edit: ['account'] }

  @rule('isLegalAccount', '账户格式不合法')
  account

  isLegalAccount (key, value, params) {
    return value.toString().length === 10 && value.startsWith('2019')
  }
}
```
验证器方法接受三个参数：  
(1)验证参数的key  
(2)验证参数的value  
(3)所有参数组成的对象

#### 默认值与可选参数
将一个参数设置为可选参数的方式：
1. 加上装饰器`@rule('optional')`
2. 设置默认值（设置默认值的方式为给属性赋的值）
> 注意：可以赋值为函数（包括async函数），系统将取函数返回值为默认值。

```
// 模拟异步请求
const http = () => new Promise(resolve => {
  setTimeout(() => resolve({ res: 'test' }), 500)
})

export class Index extends Validator {
  scene = { edit: ['id', 'account', 'name'] }
  
  // 当用户没有传入`id`参数时，不会取得默认值 
  @rule('isInt', 'id必须为正整数', { min: 1 })
  @rule('optional')
  id
  
  // 当用户没有传入`account`参数时，取得函数返回值`test` 为默认值
  @rule('require', '账户不能为空')
  @type('int')
  account = async () => {
    const { res } = await http()
    return res
  }
  
  // 当用户没有传入`name`参数时，取得默认值`foo_test`
  @rule('require', '名称不能为空', /test$/)
  name = 'foo_test'
}
```  

#### 强制类型转换
自动转换： 
1. 当验证规则为`isInt`时，将自动转为`int`
2. 当验证规则为`isFloat`时，将自动转为`float`
3. 当验证规则为`isBoolean`时，将自动转为`boolean`

显式指定：
1. `@type('int')` - 自动转为`int`
2. `@type('float')` - 自动转为`float`
3. `@type('boolean')` - 自动转为`boolean`

```
export class Buy extends Validator {
  scene = { buy: ['price', 'account'] }
  
  // price参数将自动转为Float类型
  @rule('isFloat', '价格不合法')
  price
  
  // account将转为int类型 
  @rule('isLegalAccount', '账户格式不合法')
  @type('int')
  account
   
  isLegalAccount (key, value, params) {
    return value.toString().length === 10 && value.startsWith('2019')
  }
}
```
    

#### 内置验证方法
1. 集成了Validator.js的所有方法，更多验证函数请参考其文档。  
2. 框架内置方法：
```
require       // 不能为空
optional      // 指定该参数为可选参数
```


### （三）配置
配置文件存放目录：/config

#### 文件结构
```
|-- config                配置文件目录
|   |-- base.conf.js      基本配置
|   |-- dev.conf.js       开发环境配置
|   |-- prod.conf.js      生成环境配置
```
> 注意：dev / prod中的配置项会覆盖base中的配置项

#### 配置项解释
1. PORT - 启动的服务器端口。
2. HOST - 启动的服务器IP。
3. DEBUG - 调试模式。开启时，API会返回具体错误信息，建议生产环境关闭。
4. MIDDLEWARE - 中间件配置，详情见（六）中间件。
5. DIR - 配置控制器等等文件放置的目录（以src为根目录）
6. CORS - CORS协议详细配置
7. UPLOAD - 文件上传配置
8. TOKEN - TOKEN令牌配置
9. MODEL - MODEL配置
10. DATABASE - 数据库连接配置

#### 获取配置
使用助手函数：getConfig
```
// 获取所有配置
const config = getConfig()        // 所有配置
const token = getConfig('token')  // 所有配置的TOKEN项
const scope = getConfig('token.scope') // 所有配置的TOKEN项下的SCOPE项
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
  message: '找不到数据',     // 返回的描述信息
  data: { success: true }   // 返回的数据
})
```

#### 自定义异常
注意：必须要继承`Exception`才能被框架正确处理
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
> 当发生HTTP状态码为500的错误时，只有当DEBUG设置为true，才展示详细错误信息。


### （五）控制器
控制器存放目录：/app/controller
```
export class IndexController extends Controller {
  index () {
    this.app    // 当前应用实例
    this.ctx    // 请求上下文
    
    // 返回JSON数据
    this.json({
      message: '上传成功'
    })
  }
}
```


### （六）中间件
中间件存放目录：/common/middleware

#### 定义中间件
注意：
1. 中间件文件命名要与导出的函数命名相同。
2. 函数接受一个参数，为app（Koa2实例）
如：`example.js`
```
export const example = app => {
  app.use(async (ctx, next) => {
    console.log('example-before')
    await next()
    console.log('example-after')
  })
}
```
 
 #### 使用中间件
 需要到`base.conf.js`中的`MIDDLEWARE`数组中添加相应的文件名。  
 ```
// 使用上面定义的`example.js`
MIDDLEWARE: ['example']
```

### （七）模型
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

#### 自动转换命名法
对于变量的命名法，数据库中常使用的是下划线命名法，而前端经常使用的是驼峰命名法。
因此框架内置自动转换命名法的功能，只需要在`base.conf.js`中将MODEL.CONVERT_FIELDS设置为`true`即可。

#### Model实例方法：
参数解释:
1. id (Number) 数据的ID
2. condition (Object) 查询条件，有以下两种格式：  
 (1) { status: 1, id: 6 }  
 (2) { status: ['=', 1], id: ['=', 6] }
3. order (Array) 排序条件(默认值为['id'])  
 (1) ['order', 'id']  
 (2) [ { field: 'order', rule: 'ASC' } ]
4. relation (Array) 关联模型名称   
5. pageConf (Object) 分页的配置  
 (1) pageSize - 单页大小  
 (2) page - 页码
6. data (Object|Array) 需要添加 / 更新的数据    
```
  // 获取一条数据
  async getOne ({ condition = {}, relation = [], order = ['id'] })

  // 根据id获取数据
  getOneById ({id, relation = []})
  
  // 获取所有数据
  getAll ({condition = {}, relation = [], order = ['id']}) 
    
  // 分页方法
  async pagination ({ pageConf = {}, condition = {}, relation = [], order = ['id'] })
  
  // 保存数据
  save (data)
  
  // 根据ID修改数据
  editById (id, data)
  
  // 根据特定条件修改一条数据
  edit ({condition = {}, data})
  
  // 根据ID删除数据(软删除，即status设为config.MODEL.STATUS.DELETED)
  deleteById (id)
  
  // 根据特定条件删除数据
  delete ({ condition = {} })
```

### （八）Token

#### 获取Token
```
// scope为配置中定义的SCOPE中的其中一项
// expireTime为过期时间，单位为s
// cachedData为该Token对应的需要缓存的信息
new Token().get({ scope, expireTime, cachedData = {} })
```

#### 其他方法
```
// 验证权限是否合法
static checkScope (ctx, scope)

// 验证权限是管理员
static isSuper (ctx)

// 获取缓存的指定数据（key即为Token）
static getSpecifiedValue (ctx, key)

// 检查Token是否过期
static checkToken (ctx)
```

### （九）上传文件
底层使用的是koa-multer
#### 使用  
在路由中使用：
```
import { prefix, post, middleware, upload } from '../../core'

@prefix('image')
class Image {
  @post('') @middleware(upload)
  upload = 'index.upload'
}
```
#### 如何获取相关的文件信息
```
ctx.req.file
```
