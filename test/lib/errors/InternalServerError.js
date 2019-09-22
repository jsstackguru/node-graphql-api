// Mini test suite for our custom error

import assert from 'assert'
import { InternalServerError } from '../../../src/lib/errors'

describe('InternalServerError error tests', () => {
  it('should pass test', (done) => {
    try {
      throw new InternalServerError('It went bad!', 500)
    } catch (err) {

      assert.strictEqual(err.name, 'InternalServerError')
      assert.strictEqual(err.message, 'It went bad!')
      assert.strictEqual(err.statusCode, 500)
      assert.strictEqual(err.errorCode, 500)

      done()
    }
  })
})