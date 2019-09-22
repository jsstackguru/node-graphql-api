/**
 * @module errors/internalServerError
 */

import util from 'util'

class InternalServerError {

  constructor (message, errorCode) {
    Error.captureStackTrace(this, this.constructor)

    this.name = this.constructor.name
    this.message = message || 'Internal Server Error'
    this.statusCode = 500
    this.errorCode = errorCode || 500
  }

}

util.inherits(InternalServerError, Error)

export default InternalServerError
