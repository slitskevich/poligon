const vogels = require('vogels')
const validate = require('joi')

vogels.AWS.config.update({region: 'us-east-1'})

const Item = vogels.define('Item', {
  hashKey: 'guid',
  timestamps: true,
  schema: {
    guid: validate.string()
  }
})

function getOldItems (date, handler) {
  return Item.scan()
    .where('createdAt')
    .lte(date.toJSON())
    .loadAll()
    .exec(handler)
}
exports.getOldItems = getOldItems
