/**
 * @module errors/notAcceptable
 */

import util from 'util'

class NotAcceptable {

  constructor (message, errorCode) {
    Error.captureStackTrace(this, this.constructor)

    this.name = this.constructor.name
    this.message = message || 'Not Acceptable'
    this.statusCode = 406
    this.errorCode = errorCode || 406
  }
}

util.inherits(NotAcceptable, Error)

export default NotAcceptable
