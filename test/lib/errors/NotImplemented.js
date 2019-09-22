// Mini test suite for our custom error

import assert from 'assert'
import { NotImplemented } from '../../../src/lib/errors'

describe('NotImplemented error tests', () => {
  it('should pass test', (done) => {
    try {
      throw new NotImplemented('It went bad!', 501)
    } catch (err) {

      assert.strictEqual(err.name, 'NotImplemented')
      assert.strictEqual(err.message, 'It went bad!')
      assert.strictEqual(err.statusCode, 501)
      assert.strictEqual(err.errorCode, 501)

      done()
    }
  })
})