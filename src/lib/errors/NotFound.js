/**
 * @module errors/notFound
 */

import util from 'util'

class NotFound {

  constructor (message, errorCode) {
    Error.captureStackTrace(this, this.constructor)

    this.name = this.constructor.name
    this.message = message || 'The requested resource couldn\'t be found'
    this.statusCode = 404
    this.errorCode = errorCode || 404
  }
}

util.inherits(NotFound, Error)

export default NotFound
