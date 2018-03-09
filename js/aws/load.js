// const aws = require('aws-sdk')
const vogels = require('vogels')
const validate = require('joi')

vogels.AWS.config.update({region: 'us-east-1'})

const sinon = require('sinon')
const awsMock = require('aws-sdk-mock')
awsMock.setSDKInstance(vogels.AWS)

var scanSpy = sinon.spy()
awsMock.mock('DynamoDB', 'scan', scanSpy)

const Item = vogels.define('Item', {
  hashKey: 'guid',
  timestamps: true,
  schema: {
    guid: validate.string()
  }
})
const dynamodb = new vogels.AWS.DynamoDB()

const dbParams = {
  TableName: 'ActivitiesDb'
}

Item.scan().exec((err, result) => {
  if (err) {
    console.log(`err: ${err}`)
  } else {
    console.log(`result: ${result}`)
  }
})
// dynamodb.scan(dbParams, function (err, data) {
//   console.log(`data: ${data}`)
//   console.log(`error: ${err}`)
//   awsMock.restore('DynamoDB')
// })

console.log(`was spy called: ${scanSpy.called}`)
