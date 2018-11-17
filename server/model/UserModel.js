/**
 *  UserModel.js
 *  Create By rehellinen
 *  Create On 2018/10/26 15:30
 */
import {BaseModel} from "./BaseModel"

export class UserModel extends BaseModel{
  constructor () {
    super({
      relation: ['image']
    })

    let that = this
    this.model = this.db.Model.extend({
      tableName: 'USER',
      image: function () {
        return this.hasOne(that.image, 'id', 'image_id')
      }
    })
  }
}
