/**
 * @module errors/BadRequest
 */

import util from 'util'

class BadRequest {

  constructor (message, errorCode) {
    Error.captureStackTrace(this, this.constructor)

    this.name = 'BadRequest'
    this.message = message || 'Bad Request'
    this.statusCode = 400
    this.errorCode = errorCode || 400
  }
}

util.inherits(BadRequest, Error)

export default BadRequest
