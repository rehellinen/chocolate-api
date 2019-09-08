const { Model } = require('rehellinen-api-core')

export class IndexModel extends Model {
  constructor () {
    super({
      tableName: 'article'
    })
  }
}
