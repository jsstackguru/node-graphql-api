/**
 * @module errors/requestTimeout
 */

import util from 'util'

class RequestTimeout {

  constructor (message, errorCode) {
    Error.captureStackTrace(this, this.constructor)

    this.name = this.constructor.name
    this.message = message || 'Request Timeout'
    this.statusCode = 408
    this.errorCode = errorCode || 408
  }
}

util.inherits(RequestTimeout, Error)

export default RequestTimeout
