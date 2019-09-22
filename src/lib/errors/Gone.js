/**
 * @module errors/gone
 */

import util from 'util'

class Gone {

  constructor (message, errorCode) {
    Error.captureStackTrace(this, this.constructor)

    this.name = this.constructor.name
    this.message = message || 'Gone'
    this.statusCode = 410
    this.errorCode = errorCode || 410
  }
}

util.inherits(Gone, Error)

export default Gone
