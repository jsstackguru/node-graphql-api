/**
 * @module errors/conflict
 */

import util from 'util'

class Conflict {

  constructor (message, errorCode) {
    Error.captureStackTrace(this, this.constructor)

    this.name = this.constructor.name
    this.message = message || 'Conflict'
    this.statusCode = 409
    this.errorCode = errorCode || 409
  }
}

util.inherits(Conflict, Error)

export default Conflict
