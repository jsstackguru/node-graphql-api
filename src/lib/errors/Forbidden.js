/**
 * @module errors/forbidden
 */

import util from 'util'

class Forbidden {

  constructor (message, errorCode) {
    Error.captureStackTrace(this, this.constructor)

    this.name = this.constructor.name
    this.message = message || 'Forbidden'
    this.statusCode = 403
    this.errorCode = errorCode || 403
  }

}

util.inherits(Forbidden, Error)

export default Forbidden
