/**
 * @module errors/methodNotAllowed
 */

import util from 'util'

class MethodNotAllowed {

  constructor (message, errorCode) {
    Error.captureStackTrace(this, this.constructor)

    this.name = this.constructor.name
    this.message = message || 'Method Not Allowed'
    this.statusCode = 405
    this.errorCode = errorCode || 405
  }

}

util.inherits(MethodNotAllowed, Error)

export default MethodNotAllowed
