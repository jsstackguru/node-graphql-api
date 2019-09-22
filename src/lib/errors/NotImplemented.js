/**
 * @module errors/notImplemented
 */

import util from 'util'

class NotImplemented {

  constructor (message, errorCode) {
    Error.captureStackTrace(this, this.constructor)

    this.name = this.constructor.name
    this.message = message || 'Not Implemented'
    this.statusCode = 501
    this.errorCode = errorCode || 501
  }
}

util.inherits(NotImplemented, Error)

export default NotImplemented
