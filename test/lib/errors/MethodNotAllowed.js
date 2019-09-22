// Mini test suite for our custom error

import assert from 'assert'
import { MethodNotAllowed } from '../../../src/lib/errors'

describe('MethodNotAllowed error tests', () => {
  it('should pass test', (done) => {
    try {
      throw new MethodNotAllowed('It went bad!', 405)
    } catch (err) {

      assert.strictEqual(err.name, 'MethodNotAllowed')
      assert.strictEqual(err.message, 'It went bad!')
      assert.strictEqual(err.statusCode, 405)
      assert.strictEqual(err.errorCode, 405)

      done()
    }
  })
})