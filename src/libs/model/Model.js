/**
 *  BaseModel.js
 *  Create By rehellinen
 *  Create On 2018/9/25 22:46
 */
import {DataBase} from './DataBase'
import {DatabaseException} from "../../common/exception/DatabaseException"

export class Model {
  /**
   * 初始化模型
   * @param tableName
   * @param conf Object
   *  - relation Array 定义需要进行关联的模型
   */
  constructor ({tableName, relation = [], relationFunc = []}) {
    // 获取唯一的db实例
    this.db = DataBase.getInstance()
    // 初始化需要进行关联的模型
    this.relation = relation
    if (Array.isArray(relation) && relation.length > 0) {
      for (let item of relation) {
        this.generateModel(item)
      }
    }
    // 初始化当前模型对应的表
    this.generateModel('model', tableName, relationFunc)
  }

  generateModel (modelName, tableName = modelName, relationFunc) {
    const conf = {tableName}

    let that = this
    if (Array.isArray(relationFunc) && relationFunc.length > 0) {
      for (let item of relationFunc) {
        conf[item.modelName] = function () {
          return this[item.type ? item.type : 'hasOne'](
            that[item.modelName],
            item.local,
            item.foreign
          )
        }
      }
    }

    this[modelName] = this.db.Model.extend(conf)
  }

  /**
   * 根据id获取数据
   * @param id int 数据的ID
   * @param condition Object 要查询的数据的条件
   * @param relation String 关联的模型名称
   * @return {Promise<void>}
   */
  async getOneById ({id, condition = {}, relation = []}) {
    let data
    let model = this.model.forge().where('id', id)
    this._processCondition(model, condition)

    data = await model.fetch({withRelated: relation})
    if (!data) {
      throw new DatabaseException()
    }
    return data.serialize()
  }

  /**
   * 获取所有数据
   * @param condition Array 查询条件
   * @param relation String 关联的模型名称
   * @param order Array 设置排序的字段
   * @return {Promise<*>}
   */
  async getAll ({condition = {}, relation = [], order = ['id']}) {
    let data
    let model = this.model.forge()

    this._processCondition(model, condition)
    this._processOrder(model, order)

    data = await model.fetchAll({withRelated: relation})

    if (data.isEmpty()) {
      throw new DatabaseException()
    }
    return data.serialize()
  }

  /**
   * 分页方法
   * @param pageConf Object 分页配置
   * @param condition Object 查询条件
   * @param relation String 关联的模型名称
   * @param order Array 设置排序的字段
   * @return {Promise<*>}
   */
  async pagination ({pageConf = {}, condition = {}, relation = [], order = ['id']}) {
    let data
    let model = this.model.forge()

    this._processCondition(model, condition)
    this._processOrder(model, order)

    data = await model.fetchPage({
      pageSize: pageConf.pageSize || $config.PAGE_SIZE,
      page: pageConf.page || 1,
      withRelated: relation
    })

    if (data.isEmpty()) {
      throw new DatabaseException()
    }

    return {
      data: data.serialize(),
      page: data.pagination
    }
  }

  /**
   * 保存一条数据
   * @param data
   * @return {Promise<void>}
   */
  async saveOne (data) {
    let model = this.model.forge(data)

    const res = await model.save(null, {method: 'insert'})

    if (!res) {
      throw new DatabaseException({
        message: '写入数据失败',
        status: 40001
      })
    }

    return res
  }

  /**
   * 编辑一条数据
   * @param condition
   * @param data
   * @return {Promise<void>}
   */
  async editOne ({condition = {}, data}) {
    let model = this.model.forge(data)

    this._processCondition(model, condition)
    const res = await model.where(condition).save(null, {method: 'update'})

    if (!res) {
      throw new DatabaseException({
        message: '写入数据失败',
        status: 40001
      })
    }

    return res
  }

  async deleteById (id) {
    return await this.editOne({
      condition: {id},
      data: {status: $config.STATUS.DELETED}
    })
  }

  // 支持三种方式输入condition
  // 1. 对象：{ status: 1, id: 6 }
  // 2. 数组: ['status', '=', '1']
  // 3. 二维数组: [ ['status', '=', '1'], ['id', '=', '6'] ]
  _processCondition (model, condition) {
    if (Array.isArray(condition)) {
      if (Array.isArray(condition[0])) {
        for (let item of condition) {
          model = model.where(...item)
        }
        return
      }
      model = model.where(...condition)
      return
    }

    for (let key in condition) {
      model = model.where(key, 'in', condition[key])
    }
  }

  _processOrder (model, order) {
    for (let item of order) {
      if (typeof item === 'object') {
        model = model.orderBy(item.field, item.orderRule)
      } else {
        model = model.orderBy(item, 'DESC')
      }
    }
  }
}
