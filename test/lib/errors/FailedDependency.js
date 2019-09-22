// Mini test suite for our custom error

import assert from 'assert'
import { FailedDependency } from '../../../src/lib/errors'

describe('FailedDependency error tests', () => {
  it('should pass test', (done) => {
    try {
      throw new FailedDependency('It went bad!', 424)
    } catch (err) {

      assert.strictEqual(err.name, 'FailedDependency')
      assert.strictEqual(err.message, 'It went bad!')
      assert.strictEqual(err.statusCode, 424)
      assert.strictEqual(err.errorCode, 424)

      done()
    }
  })
})