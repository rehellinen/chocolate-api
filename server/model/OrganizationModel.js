import {BaseModel} from "./BaseModel"

export class OrganizationModel extends BaseModel{
  constructor () {
    super()

    this.model = this.db.Model.extend({
      tableName: 'ORGANI'
    })
  }

  async getByUID (uid) {
    const data = await this.getAll({UID: uid})
    return data[0]
  }

  async editByUID (uid, data) {
    return await this.editOne({UID: uid}, data)
  }
}
