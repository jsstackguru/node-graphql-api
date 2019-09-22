/**
 * @module errors/unprocessableEntity
 * @desc The 422 (Unprocessable Entity) status code means the server understands the content type of the request entity,
 * and the syntax of the request entity is correct but was unable to process the contained instructions.
 */

import util from 'util'

class UnprocessableEntity {

  constructor (message, errorCode) {
    Error.captureStackTrace(this, this.constructor)

    this.name = this.constructor.name
    this.message = message || 'Unprocessable Entity'
    this.statusCode = 422
    this.errorCode = errorCode || 422
  }
}

util.inherits(UnprocessableEntity, Error)

export default UnprocessableEntity
