/**
 * @module errors/badGateway
 */

import util from 'util'

class BadGateway {

  constructor (message, errorCode) {
    Error.captureStackTrace(this, this.constructor)

    this.name = this.constructor.name
    this.message = message || 'Bad Gateway'
    this.statusCode = 502
    this.errorCode = errorCode || 502
  }
}

util.inherits(BadGateway, Error)

export default BadGateway
