// Mini test suite for our custom error

import assert from 'assert'
import { ServiceUnavailable } from '../../../src/lib/errors'

describe('ServiceUnavailable error tests', () => {
  it('should pass test', (done) => {
    try {
      throw new ServiceUnavailable('It went bad!', 503)
    } catch (err) {

      assert.strictEqual(err.name, 'ServiceUnavailable')
      assert.strictEqual(err.message, 'It went bad!')
      assert.strictEqual(err.statusCode, 503)
      assert.strictEqual(err.errorCode, 503)

      done()
    }
  })
})