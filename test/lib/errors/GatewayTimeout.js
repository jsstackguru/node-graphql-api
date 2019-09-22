// Mini test suite for our custom error

import assert from 'assert'
import { GatewayTimeout } from '../../../src/lib/errors'

describe('GatewayTimeout error tests', () => {
  it('should pass test', (done) => {
    try {
      throw new GatewayTimeout('It went bad!', 504)
    } catch (err) {

      assert.strictEqual(err.name, 'GatewayTimeout')
      assert.strictEqual(err.message, 'It went bad!')
      assert.strictEqual(err.statusCode, 504)
      assert.strictEqual(err.errorCode, 504)

      done()
    }
  })
})