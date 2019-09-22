/**
 * @module errors/serviceUnavailable
 */

import util from 'util'

class ServiceUnavailable {

  constructor (message, errorCode) {
    Error.captureStackTrace(this, this.constructor)

    this.name = this.constructor.name
    this.message = message || 'Service Unavailable'
    this.statusCode = 503
    this.errorCode = errorCode || 503
  }
}

util.inherits(ServiceUnavailable, Error)

export default ServiceUnavailable
