/**
 * @module errors/httpVersionNotSupported
 */

import util from 'util'

class HttpVersionNotSupported {

  constructor (message, errorCode) {
    Error.captureStackTrace(this, this.constructor)

    this.name = this.constructor.name
    this.message = message || 'HTTP Version Not Supported'
    this.statusCode = 505
    this.errorCode = errorCode || 505
  }
}

util.inherits(HttpVersionNotSupported, Error)

export default HttpVersionNotSupported
