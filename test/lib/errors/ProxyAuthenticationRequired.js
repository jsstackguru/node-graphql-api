// Mini test suite for our custom error

import assert from 'assert'
import { ProxyAuthenticationRequired } from '../../../src/lib/errors'

describe('ProxyAuthenticationRequired error tests', () => {
  it('should pass test', (done) => {
    try {
      throw new ProxyAuthenticationRequired('It went bad!', 407)
    } catch (err) {

      assert.strictEqual(err.name, 'ProxyAuthenticationRequired')
      assert.strictEqual(err.message, 'It went bad!')
      assert.strictEqual(err.statusCode, 407)
      assert.strictEqual(err.errorCode, 407)

      done()
    }
  })
})