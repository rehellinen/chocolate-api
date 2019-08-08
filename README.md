一个基于Koa2的API框架
=======================

#### 新版框架重构中，预计八月底完成 ... 

核心思想： 用更优雅的方式编写代码。

### 框架目录：
~~~
|-- app
|   |-- router        路由
|   |-- controller        控制器
|   |-- model             模型 
|-- common            公共模块目录
|   |-- exception     用户自定义异常 / 框架内置异常
|   |-- validate      验证器
|-- config            配置文件目录
|-- core              框架核心类库
|   |-- config        配置
|   |-- decorator     装饰器
|   |-- exception     异常处理
|   |-- middleware    中间件
|   |-- model         模型
|   |-- token         Token令牌
|   |-- utils         工具
|   |-- validate      验证器
~~~

## 框架基本用法
### （一）路由
#### 存放目录
/app/router

#### 路由类可使用的装饰器
1. `@controller` - 接收一个参数，为一级URL
2. `@get`, `@post`, `@put`, `@del` - 接收一个参数，为二级URL
3. `@mixin` - 为一个路由批量增加方法
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
1. 默认为二级路由（第二级可以为空），格式类似'/index/test'
2. 上面定义了以'GET'方法访问'/index'的路由，并且将跳转至'Index'的'index'方法。
3. `@get`等等http装饰器必须在最下层。
4. `@validate`在`@auth`之上时，先验证参数再验证权限。

#### 定义路由Mixin（必须以'Mixin'结尾）
```
export class CmsMixin {
  @post('/test')
  add () {
    throw new SuccessMessage()
  }
}
```


### （二）配置
配置文件存放目录：/config
```
|-- config            配置文件目录
|   |-- config.js     框架核心配置文件
|   |-- custom.js     自定义配置
|   |-- database.js   数据库配置
```
> 注：配置项具体作用在文件中有详细注释

#### 获取配置
GLOBAL_CONF配置为true时，可通过全局变量$config访问配置。


### （三）异常
自定义异常存放目录：/common/exception    
#### 返回的JSON格式
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
`Exception` 所在文件：/libs/exception/BaseException.js
```
export class ParamsException extends Exception{
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
只有DEBUG设置为true，才展示详细错误信息。


### （四）验证器
#### 验证器存放目录
/common/validate  

#### 作用
对前端传来的数据进行校验。  
GET、POST、PUT、DELETE方法携带的数据均能进行校验。

#### 定义验证器
1. scene定义验证场景，具体使用方法查看下面的示例
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

#### 路由中使用
`@validate`接受一个对象，对象包含name和scene两个属性。name为验证器的名称，scene为场景名称
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


### （五）模型
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

### （六）工具
工具存放目录：/libs/utils

#### Token令牌
`Token` 所在目录：/libs/utils/Token.js  
内置方法：
```
/**
 * 获取Token的主方法
 * @param scope 权限值
 * @param cachedData 需要缓存的数据
 * @param key 缓存的键
 */

constructor (scope)

// 获取Token的主方法
get (cachedData)

// 验证权限是否合法
static checkScope (ctx, scope)

// 验证权限是管理员
static isSuper (ctx)

// 获取缓存的指定数据
static getSpecifiedValue (ctx, key)

// 检查Token是否过期
static checkToken (ctx)

// 获取Token：new Token($config.SCOPE.USER).get(cachedData)
```

#### multer(上传文件)
所在目录：/libs/utils/multer.js  
`multer.js` 输出变量 `fileName` 和路由中间件 `upload`   
（1）如何使用  
需配合路由使用：
```
@controller('image')
class ImageRouter {
  @post('')
  // @middleware装饰器在/libs/decorator/decorator.js
  // upload中间件在/libs/utils/multer.js
  @middleware(upload)
  async addImage (ctx, next) {
  }
}
```
（2）如何获取上传后的文件名
```
import {fileName} from "./libs/utils/multer"
```


### （七）控制器
控制器存放目录：/controller  
