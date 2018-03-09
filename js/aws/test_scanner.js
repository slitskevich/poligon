const rewire = require('rewire')
const scanner = rewire('./scanner.js')

function mockItem (set) {
  const result = {
    data: set,
    scanResult: null,
    field: null,

    scan: function () {
      this.scanResult = this.data
      return this
    },
    where: function (field) {
      this.field = field
      return this
    },
    lte: function (value) {
      console.log(`lte: ${value}`)
      for (var i = 0; i < this.scanResult.length; i += 1) {
        if (this.scanResult[i][this.field] > value) {
          this.scanResult.splice(i, 1)
          i -= 1
        }
      }
      return this
    },
    loadAll: function () {
      return this
    },
    exec: function (handler) {
      handler(null, this.scanResult)
    }
  }

  return result
}

const setA = [
  {createdAt: '2018-02-25T11:31:47.541Z'},
  {createdAt: '2018-02-15T11:31:47.541Z'},
  {createdAt: '2018-02-05T11:31:47.541Z'},
  {createdAt: '2018-03-05T11:31:47.541Z'},
  {createdAt: '2018-03-15T11:31:47.541Z'}
]
const mockA = mockItem(setA)

scanner.__set__('Item', mockA)

const now = new Date()
scanner.getOldItems(now, (err, result) => {
  if (err) {
    console.log(`err: ${err}`)
  } else {
    console.log(`result: ${JSON.stringify(result, null, 2)}`)
  }
})
