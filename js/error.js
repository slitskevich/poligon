class ExtendableError extends Error {
  constructor (message) {
    super(message)
    this.name = this.constructor.name
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = (new Error(message)).stack
    }
  }
}

class ItemNotFoundError extends ExtendableError {}

const err = new ItemNotFoundError()

console.log(`err: ${JSON.stringify(err, null, 2)}`)
console.log(`is instance? ${err instanceof ItemNotFoundError}`)
