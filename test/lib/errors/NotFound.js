// Mini test suite for our custom error

import assert from 'assert'
import { NotFound } from '../../../src/lib/errors'

describe('NotFound error tests', () => {
  it('should pass test', (done) => {
    try {
      throw new NotFound('It went bad!', 404)
    } catch (err) {

      assert.strictEqual(err.name, 'NotFound')
      assert.strictEqual(err.message, 'It went bad!')
      assert.strictEqual(err.statusCode, 404)
      assert.strictEqual(err.errorCode, 404)

      done()
    }
  })
})