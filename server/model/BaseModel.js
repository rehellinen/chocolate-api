/**
 *  BaseModel.js
 *  Create By rehellinen
 *  Create On 2018/9/25 22:46
 */
import {DataBase} from './DataBase'
import {DatabaseException} from "../common/exception/DatabaseException"

export class BaseModel {
  /**
   * 初始化模型
   * @param conf Object
   *  - relation Array 定义需要进行关联的模型
   */
  constructor (conf = {}) {
    this.db = DataBase.getInstance()

    // 初始化需要进行关联的模型
    if (conf.relation && Array.isArray(conf.relation)) {
      for (let item of conf.relation) {
        this.generateModel(item)
      }
    }
  }

  generateModel (modelName) {
    this[modelName] = this.db.Model.extend({
      tableName: modelName
    })
  }

  /**
   * 根据id获取数据
   * @param id int 数据的ID
   * @param condition Object 要查询的数据的条件
   * @param relation String 关联的模型名称
   * @return {Promise<void>}
   */
  async getOneById (id, condition = {}, relation = []) {
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
  async getAll (condition = {}, relation = [], order = []) {
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
  async pagination (pageConf = {}, condition = {}, relation = [], order = ['id']) {
    let data
    let model = this.model.forge()

    this._processCondition(model, condition)
    this._processOrder(model, order)

    data = await model.fetchPage({
      pageSize: pageConf.pageSize,
      page: pageConf.page,
      withRelated: relation
    })

    if (data.isEmpty()) {
      throw new DatabaseException()
    }
    return data.serialize()
  }

  /**
   * 将openId保存到数据库
   * @param openid
   * @return {Promise<*>}
   */
  async saveOpenId (openid) {
    let userId
    const savedData = {
      UOPENID: openid,
      USTATE: $config.STATUS.NORMAL
    }
    const user = await this.model
      .where(savedData)
      .fetch()

    if (!user) {
      const res = await this.saveOne(savedData)
      userId = res.UID
    } else {
      userId = user.attributes.UID
    }
    return userId
  }

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

  async editOne (condition = {}, data) {
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

  _processCondition (model, condition) {
    for (let key in condition) {
      model = model.where(key, 'in', condition[key])
    }
  }

  _processOrder (model, order) {
    for (let item of order) {
      model = model.orderBy(item, 'DESC')
    }
  }
}
