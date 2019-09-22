// Mini test suite for our custom error

import assert from 'assert'
import { BadRequest } from '../../../src/lib/errors'

describe('BadRequest error tests', () => {
  it('should pass test', (done) => {
    try {
      throw new BadRequest('It went bad!', 400)
    } catch (err) {

      assert.strictEqual(err.name, 'BadRequest')
      assert.strictEqual(err.message, 'It went bad!')
      assert.strictEqual(err.statusCode, 400)
      assert.strictEqual(err.errorCode, 400)

      done()
    }
  })
})