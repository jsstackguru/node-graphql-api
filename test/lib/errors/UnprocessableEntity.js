// Mini test suite for our custom error

import assert from 'assert'
import { UnprocessableEntity } from '../../../src/lib/errors'

describe('UnprocessableEntity error tests', () => {
  it('should pass test', (done) => {
    try {
      throw new UnprocessableEntity('It went bad!', 422)
    } catch (err) {

      assert.strictEqual(err.name, 'UnprocessableEntity')
      assert.strictEqual(err.message, 'It went bad!')
      assert.strictEqual(err.statusCode, 422)
      assert.strictEqual(err.errorCode, 422)

      done()
    }
  })
})