// Mini test suite for our custom error

import assert from 'assert'
import { Unauthorized } from '../../../src/lib/errors'

describe('Unauthorized error tests', () => {
  it('should pass test', (done) => {
    try {
      throw new Unauthorized('It went bad!', 401)
    } catch (err) {

      assert.strictEqual(err.name, 'Unauthorized')
      assert.strictEqual(err.message, 'It went bad!')
      assert.strictEqual(err.statusCode, 401)
      assert.strictEqual(err.errorCode, 401)

      done()
    }
  })
})