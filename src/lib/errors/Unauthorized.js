/**
 * @module errors/unauthorizedRequest
 */

import util from 'util'

class Unauthorized {
  constructor (message, errorCode) {
    Error.captureStackTrace(this, this.constructor)

    this.name = this.constructor.name
    this.message = message || 'Unauthorized Request'
    this.statusCode = 401
    this.errorCode = errorCode || 401
  }
}

util.inherits(Unauthorized, Error)

export default Unauthorized
