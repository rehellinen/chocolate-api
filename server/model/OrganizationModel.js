import {BaseModel} from "./BaseModel"

export class OrganizationModel extends BaseModel{
  constructor () {
    super()

    this.model = this.db.Model.extend({
      tableName: 'ORGANI'
    })
  }
}
