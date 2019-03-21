基于Koa2的API框架
====================

### 框架目录：
~~~
|-- config            配置文件目录
|-- controller        控制器
|-- model             模型 
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
|   |-- utils         工具
|   |-- validate      验证器
~~~

## 框架基本用法
### （一）路由：
路由文件存放目录：/common/router  

#### 路由定义
`@controller, @get, @post, @put, @del` 所在文件：/libs/decorator/router.js
```
@controller('index')
class IndexRouter {
  // get方法访问'index/user'的路由
  @get('user')
  async getToken (ctx, next) {
    await index.index(ctx, next)
  }
}
```

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
GLOBAL_CONF配置为true时，可通过全局变量$config访问配置。


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
验证器存放目录：/common/validate  
#### 作用
对前端传来的数据进行校验。  
GET、POST、PUT、DELETE方法携带的数据均能进行校验。

#### 使用方式
`@validate` 所在文件：/libs/decorator/decorator.js
需要配合路由使用：
```
@controller('index')
class IndexRouter {
  @get('user')
  @validate({name: 'index', scene: 'id'})
  // 表示验证IndexValidate中id情景
  async getToken (ctx, next) { }
}
```

#### 自定义验证器
`Validate` 所在文件：/libs/exception/BaseException.js
文件命名规则为 `${name}Validate`
```
export class IndexValidate extends Validate{
  constructor() {
    super()
    this.rules = {
      // 键为需要校验的数据名称
      // 值为一个数组，第一项为验证方法，第二项为出现错误时的错误提示
      id: ['require', 'id']
    }
    this.scene = {
      // 键为情景名称
      // 值为一个数组，数组元素为需要校验的数据
      id: ['id']
    }
  }
}
```

#### 验证方法
内置的验证方法：/libs/validate/Methods.js
```
require           // 不能为空
positiveInt       // 是否为正整数
```


### （五）模型
模型存放目录：/model  

#### 介绍
1. 基于Bookshelf.js，更多高级用法请参考文档
2. this.model可获取当前模型实例
  
#### 使用方式
`Model` 所在文件：/libs/exception/BaseException.js
```
export class IndexModel extends Model {
  constructor() {
    super({
      tableName: 'article'
    })
  }
}
```
构造函数接受一个对象：  
tableName - 表的名称
conf - 关联模型的配置

#### Model类内置的方法：
```
  /**
   * 参数解释
   * @param id int 数据的ID
   * @param condition Object 要查询的数据的条件
   * @param relation String 关联的模型名称
   * @param order Array 设置排序的字段  
   * @param pageConf Object 分页配置
   * @param data Object 数据
   */

  // 根据id获取数据
  async getOneById ({id, condition = {}, relation = []})
  
  // 获取所有数据
  async getAll ({condition = {}, relation = [], order = ['id']}) 
    
  // 分页方法
  async pagination ({pageConf = {}, 
    condition = {}, 
    relation = [], 
    order = ['id']
  })
  
  // 保存一条数据
  async saveOne (data)
  
  // 编辑一条数据
  async editOne ({condition = {}, data})
  
  // 根据ID删除一条数据
  async deleteById (id)
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

// 获取缓存的指定数据
static getSpecifiedValue (ctx, key)

// 检查Token是否过期
static checkToken (ctx)

// 获取Token：new Token($config.SCOPE.USER).get(cachedData)
```

### （七）控制器
控制器存放目录：/controller  
