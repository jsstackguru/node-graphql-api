/**
 * @module errors/networkAuthenticationRequired
 * @desc  The client needs to authenticate to gain network access.
 * Intended for use by intercepting proxies used to control access to the network.
 */

import util from 'util'

class NetworkAuthenticationRequired {

  constructor (message, errorCode) {
    Error.captureStackTrace(this, this.constructor)

    this.name = this.constructor.name
    this.message = message || 'Network Authentication Required'
    this.statusCode = 511
    this.errorCode = errorCode || 511
  }

}

util.inherits(NetworkAuthenticationRequired, Error)

export default NetworkAuthenticationRequired
