/**
 * @module errors/proxyAuthenticationRequired
 */

import util from 'util'

class ProxyAuthenticationRequired {

  constructor (message, errorCode) {
    Error.captureStackTrace(this, this.constructor)

    this.name = this.constructor.name
    this.message = message || 'Proxy Authentication Required'
    this.statusCode = 407
    this.errorCode = errorCode || 407
  }
}

util.inherits(ProxyAuthenticationRequired, Error)

export default ProxyAuthenticationRequired
