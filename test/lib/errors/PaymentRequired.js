// Mini test suite for our custom error

import assert from 'assert'
import { PaymentRequired } from '../../../src/lib/errors'

describe('PaymentRequired error tests', () => {
  it('should pass test', (done) => {
    try {
      throw new PaymentRequired('It went bad!', 402)
    } catch (err) {

      assert.strictEqual(err.name, 'PaymentRequired')
      assert.strictEqual(err.message, 'It went bad!')
      assert.strictEqual(err.statusCode, 402)
      assert.strictEqual(err.errorCode, 402)

      done()
    }
  })
})