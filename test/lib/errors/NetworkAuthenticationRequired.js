// Mini test suite for our custom error

import assert from 'assert'
import { NetworkAuthenticationRequired } from '../../../src/lib/errors'

describe('NetworkAuthenticationRequired error tests', () => {
  it('should pass test', (done) => {
    try {
      throw new NetworkAuthenticationRequired('It went bad!', 511)
    } catch (err) {

      assert.strictEqual(err.name, 'NetworkAuthenticationRequired')
      assert.strictEqual(err.message, 'It went bad!')
      assert.strictEqual(err.statusCode, 511)
      assert.strictEqual(err.errorCode, 511)

      done()
    }
  })
})