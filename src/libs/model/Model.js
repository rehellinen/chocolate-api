/**
 *  BaseModel.js
 *  Create By rehellinen
 *  Create On 2018/9/25 22:46
 */
import {DataBase} from './DataBase'
import {DatabaseException} from "../../common/exception/DatabaseException"

export class Model {
  // 获取唯一的db实例
  db = DataBase.getInstance()
  // 所有需要关联的表的名称
  relation = []


  /**
   * 初始化模型
   * @param tableName 表名
   * @param relationConf 配置关联模型
   *  - tableName  需要进行关联的表名
   *  - local 主键
   *  - foreign 外键
   */
  constructor ({tableName, relationConf = []}) {
    // 初始化关联模型
    const config = this._processRelation()
    // 初始化模型
    this._generateModel(Object.assign(config, { tableName }))
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
   * 根据ID修改数据
   * 软删除，即status设为$config.STATUS.DELETED
   * @param {Number} id 主键
   * @returns {Promise<void>}
   */
  async editById (id) {
    return await this.edit({
      condition: { id }
    })
  }

  /**
   * 根据特定条件修改一条数据
   * @param {Object} condition 条件对象
   * @param {Object} data 数据对象
   * @return {Promise<void>}
   */
  async edit ({condition = {}, data}) {
    let model = this.model.forge(data)

    this._processCondition(model, condition)
    const res = await model.where(condition).save(null, {method: 'update'})

    if (!res) {
      let message = '写入数据失败'
      if (data.status === $config.STATUS.DELETED) {
        message = '删除数据失败'
      }
      throw new DatabaseException({
        message,
        status: 40001
      })
    }

    return res
  }

  /**
   * 根据ID删除数据
   * 软删除，即status设为$config.STATUS.DELETED
   * @param {Number} id 主键
   * @returns {Promise<void>}
   */
  async deleteById (id) {
    return await this.delete({
      condition: { id }
    })
  }

  /**
   * 根据特定条件删除数据
   * 软删除，即status设为$config.STATUS.DELETED
   * @param {Object} condition 条件对象
   * @returns {Promise<void>}
   */
  async delete ({ condition = {} }) {
    return await this.edit({
      condition,
      data: { status: $config.STATUS.DELETED }
    })
  }

  // 处理关联模型配置
  _processRelation (relationConf = []) {
    if (!Array.isArray(relationConf)) {
      return
    }

    let conf = {}
    let _this = this
    relationConf.forEach(item => {
      this._generateModel({ tableName: item.tableName })
      conf[item.tableName] = function () {
        return this[item.type ? item.type : 'hasOne']
        (
          _this[`_${item.tableName}`],
          item.local,
          item.foreign
        )
      }
    })
    return conf
  }

  // 根据配置生成模型
  _generateModel (config) {
    this[`_${config.tableName}`] = this.db.Model.extend(config)
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
