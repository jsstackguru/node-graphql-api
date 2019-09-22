// Mini test suite for our custom error

import assert from 'assert'
import { NotAcceptable } from '../../../src/lib/errors'

describe('NotAcceptable error tests', () => {
  it('should pass test', (done) => {
    try {
      throw new NotAcceptable('It went bad!', 406)
    } catch (err) {

      assert.strictEqual(err.name, 'NotAcceptable')
      assert.strictEqual(err.message, 'It went bad!')
      assert.strictEqual(err.statusCode, 406)
      assert.strictEqual(err.errorCode, 406)

      done()
    }
  })
})