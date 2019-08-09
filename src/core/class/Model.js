/**
 *  BaseModel.js
 *  Create By rehellinen
 *  Create On 2018/9/25 22:46
 */
import { DataBase } from './DataBase'
import { DatabaseException } from '../exception'
import { getConfig } from '../utils'

const config = getConfig()

export class Model {
  // 获取唯一的db实例
  db = DataBase.getInstance()

  // 所有需要关联的表的名称
  relation = []

  /**
   * 初始化模型
   * @param {String} tableName 表名
   * @param {Array} relationConf 配置关联模型
   *  - tableName  需要进行关联的表名
   *  - local 主键
   *  - foreign 外键
   */
  constructor ({ tableName, relationConf = [] }) {
    // 初始化关联模型
    const config = this._processRelation()
    // 初始化模型
    this._generateModel(Object.assign(config, { tableName }))
  }

  /**
   * 根据id获取数据
   * @param {Number} id 数据的ID
   * @param {Object} condition 要查询的数据的条件
   * @param {Array} relation 关联的模型名称
   * @return {Promise<void>}
   */
  async getOneById ({ id, condition = {}, relation = [] }) {
    const model = this.model.forge().where('id', id)
    this._processCondition(model, condition)

    const data = await model.fetch({ withRelated: relation })
    if (!data) {
      throw new DatabaseException()
    }
    return data.serialize()
  }

  /**
   * 获取所有数据
   * @param {Object} condition Array 查询条件
   * @param {Array} relation String 关联的模型名称
   * @param {Array} order Array 设置排序的字段
   * @return {Promise<*>}
   */
  async getAll ({ condition = {}, relation = [], order = ['id'] }) {
    const model = this.model.forge()

    this._processCondition(model, condition)
    this._processOrder(model, order)

    const data = await model.fetchAll({ withRelated: relation })

    if (data.isEmpty()) {
      throw new DatabaseException()
    }
    return data.serialize()
  }

  /**
   * 分页方法
   * @param {Object} pageConf 分页配置
   * @param {Object} condition 查询条件
   * @param {Array} relation 关联的模型名称
   * @param {Array} order 设置排序的字段
   * @return {Promise<*>}
   */
  async pagination ({ pageConf = {}, condition = {}, relation = [], order = ['id'] }) {
    const model = this.model.forge()

    this._processCondition(model, condition)
    this._processOrder(model, order)

    const data = await model.fetchPage({
      pageSize: pageConf.pageSize || config.PAGE_SIZE,
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
   * 保存数据
   * @param {Object} data 数据对象
   * @return {Promise<void>}
   */
  async save (data) {
    const model = this.model.forge(data)

    const res = await model.save(null, { method: 'insert' })

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
   * 软删除，即status设为config.STATUS.DELETED
   * @param {Number} id 主键
   * @returns {Promise<void>}
   */
  async editById (id) {
    return this.edit({
      condition: { id }
    })
  }

  /**
   * 根据特定条件修改一条数据
   * @param {Object} condition 条件对象
   * @param {Object} data 数据对象
   * @return {Promise<void>}
   */
  async edit ({ condition = {}, data }) {
    const model = this.model.forge(data)

    this._processCondition(model, condition)
    const res = await model.where(condition).save(null, { method: 'update' })

    if (!res) {
      let message = '写入数据失败'
      if (data.status === config.STATUS.DELETED) {
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
   * 软删除，即status设为config.STATUS.DELETED
   * @param {Number} id 主键
   * @returns {Promise<void>}
   */
  async deleteById (id) {
    return this.delete({
      condition: { id }
    })
  }

  /**
   * 根据特定条件删除数据
   * 软删除，即status设为config.STATUS.DELETED
   * @param {Object} condition 条件对象
   * @returns {Promise<void>}
   */
  async delete ({ condition = {} }) {
    return this.edit({
      condition,
      data: { status: config.STATUS.DELETED }
    })
  }

  /**
   * 处理关联模型配置
   * @param {Array} relationConf 关联配置对象数组
   * @private
   */
  _processRelation (relationConf = []) {
    if (!Array.isArray(relationConf)) {
      return
    }

    const conf = {}
    const _this = this
    relationConf.forEach(item => {
      this.relation.push(item.tableName)
      this._generateModel({ tableName: item.tableName })
      conf[item.tableName] = function () {
        return this[item.type ? item.type : 'hasOne'](
          _this[item.tableName],
          item.local,
          item.foreign
        )
      }
    })
    return conf
  }

  /**
   * 根据配置生成模型
    * @param {Object} config 模型配置
   * @private
   */
  _generateModel (config) {
    this[config.tableName] = this.db.Model.extend(config)
  }

  /**
   * 处理条件配置
   * @param {Object} model 模型对象
   * @param {Object|Array} condition
   * condition支持3种方式输入
   * 1. { status: 1, id: 6 }
   * 2. {status: ['=', 1], id: ['=', 6]}
   * @private
   */
  _processCondition (model, condition) {
    for (const [key, value] of condition.entries()) {
      if (Array.isArray(value)) {
        model = model.where(key, ...value)
      } else {
        model = model.where(key, '=', value)
      }
    }
  }

  /**
   * 处理排序配置
   * @param {Object} model 模型对象
   * @param {Array} order
   * order支持2种方式输入
   * 1. 数组: ['order', 'id']
   * 2. 对象数组: [ { field: 'order', rule: 'ASC' } ]
   * @private
   */
  _processOrder (model, order) {
    for (const item of order) {
      if (typeof item === 'object') {
        model = model.orderBy(item.field, item.rule)
      } else {
        model = model.orderBy(item, 'DESC')
      }
    }
  }
}
