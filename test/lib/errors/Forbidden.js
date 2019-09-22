// Mini test suite for our custom error

import assert from 'assert'
import { Forbidden } from '../../../src/lib/errors'

describe('Conflict error tests', () => {
  it('should pass test', (done) => {
    try {
      throw new Forbidden('It went bad!', 403)
    } catch (err) {

      assert.strictEqual(err.name, 'Forbidden')
      assert.strictEqual(err.message, 'It went bad!')
      assert.strictEqual(err.statusCode, 403)
      assert.strictEqual(err.errorCode, 403)

      done()
    }
  })
})