/**
 * @module errors/paymentRequired
 */

import util from 'util'

class PaymentRequired {

  constructor (message, errorCode) {
    Error.captureStackTrace(this, this.constructor)

    this.name = this.constructor.name
    this.message = message || 'Payment Required'
    this.statusCode = 402
    this.errorCode = errorCode || 402
  }
}

util.inherits(PaymentRequired, Error)

export default PaymentRequired
