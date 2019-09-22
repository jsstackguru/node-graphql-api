// Mini test suite for our custom error

import assert from 'assert'
import { HttpVersionNotSupported } from '../../../src/lib/errors'

describe('HttpVersionNotSupported error tests', () => {
  it('should pass test', (done) => {
    try {
      throw new HttpVersionNotSupported('It went bad!', 505)
    } catch (err) {

      assert.strictEqual(err.name, 'HttpVersionNotSupported')
      assert.strictEqual(err.message, 'It went bad!')
      assert.strictEqual(err.statusCode, 505)
      assert.strictEqual(err.errorCode, 505)

      done()
    }
  })
})