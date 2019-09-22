// Mini test suite for our custom error

import assert from 'assert'
import { Gone } from '../../../src/lib/errors'

describe('Gone error tests', () => {
  it('should pass test', (done) => {
    try {
      throw new Gone('It went bad!', 410)
    } catch (err) {

      assert.strictEqual(err.name, 'Gone')
      assert.strictEqual(err.message, 'It went bad!')
      assert.strictEqual(err.statusCode, 410)
      assert.strictEqual(err.errorCode, 410)

      done()
    }
  })
})