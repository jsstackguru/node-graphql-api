/**
 * @module errors/gatewayTimeout
 */

import util from 'util'

class GatewayTimeout {

  constructor (message, errorCode) {
    Error.captureStackTrace(this, this.constructor)

    this.name = this.constructor.name
    this.message = message || 'Gateway Timeout'
    this.statusCode = 504
    this.errorCode = errorCode || 504
  }
}

util.inherits(GatewayTimeout, Error)

export default GatewayTimeout
