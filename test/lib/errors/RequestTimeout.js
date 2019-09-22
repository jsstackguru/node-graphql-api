// Mini test suite for our custom error

import assert from 'assert'
import { RequestTimeout } from '../../../src/lib/errors'

describe('RequestTimeout error tests', () => {
  it('should pass test', (done) => {
    try {
      throw new RequestTimeout('It went bad!', 408)
    } catch (err) {

      assert.strictEqual(err.name, 'RequestTimeout')
      assert.strictEqual(err.message, 'It went bad!')
      assert.strictEqual(err.statusCode, 408)
      assert.strictEqual(err.errorCode, 408)

      done()
    }
  })
})