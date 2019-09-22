/**
 * @file User API tests
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import { assert } from 'chai'
import should from 'should'
import { verifyToken, generateToken } from '../../src/services/auth'
import translate from '../../src/lib/translate'

describe("Authentication service tests", () => {

  it('should generate authorization token', (done) => {
    let token = generateToken('sasateodorovic57@istoryapp.com')

    should(token).be.type('string')

    done()
  })

  it('should not validate token', async () => {
    try {
      let decoded = verifyToken('1234')
    } catch (err) {
      should.exist(err)
      should(err).have.property('message')
      assert.equal(err.message, translate.__('Invalid token'))
    }
  })

  it('should validate token', (done) => {
    try {
      let token = generateToken('sasateodorovic57@istoryapp.com')
      let decoded = verifyToken(token)

      should(decoded).be.type('string')
      done()
    } catch (err) {
      should(err).not.exist
      done()
    }
  })

})
