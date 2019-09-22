// Mini test suite for our custom error

import assert from 'assert'
import { Conflict } from '../../../src/lib/errors'

describe('Conflict error tests', () => {
  it('should pass test', (done) => {
    try {
      throw new Conflict('It went bad!', 409)
    } catch (err) {

      assert.strictEqual(err.name, 'Conflict')
      assert.strictEqual(err.message, 'It went bad!')
      assert.strictEqual(err.statusCode, 409)
      assert.strictEqual(err.errorCode, 409)

      done()
    }
  })
})