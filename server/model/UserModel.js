/**
 *  UserModel.js
 *  Create By rehellinen
 *  Create On 2018/10/26 15:30
 */
import {BaseModel} from "./BaseModel"

export class UserModel extends BaseModel{
  constructor () {
    super()

    this.model = this.db.Model.extend({
      tableName: 'USER'
    })
  }
}
