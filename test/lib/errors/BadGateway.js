// Mini test suite for our custom error

import assert from 'assert'
import { BadGateway } from '../../../src/lib/errors'

describe('BadGateway error tests', () => {
  it('should pass test', (done) => {
    try {
      throw new BadGateway('It went bad!', 502)
    } catch (err) {

      assert.strictEqual(err.name, 'BadGateway')
      assert.strictEqual(err.message, 'It went bad!')
      assert.strictEqual(err.statusCode, 502)
      assert.strictEqual(err.errorCode, 502)

      done()
    }
  })
})