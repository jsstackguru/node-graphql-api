/**
 * @file Export API tests
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import chai from 'chai'
import { assert, expect } from 'chai'
import should from 'should'
import chaiHttp from 'chai-http'
import translate from '../../src/lib/translate'
import fixtures from '../fixtures'
import server from '../setup/server'
// Services
import { generateToken } from '../../src/services/auth'
import { initAfter, initBefore } from '../setup'

chai.use(chaiHttp)

describe('Export API tests', () => {

  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  it('should not export data, token is missing', async () => {
    try {
      let response = await chai.request(server)
        .post('/v1/export/preview')
        .set('Authorization', `Bearer ""`)
        .send({preview: true})

      should.exist(response.error)
      let error = response.error
      expect(error.status).to.be.equal(401)
      let errorText = JSON.parse(error.text)
      expect(errorText.message).to.be.equal(translate.__('Authorization token missing'))
      expect(errorText.statusCode).to.be.equal(401)

    } catch (err) {
      should.not.exist(err)
    }
  })

  it('should not export data', async () => {
    try {
      let author = fixtures.collections.authors[0]
      let token = generateToken(author.email)
      let response = await chai.request(server)
        .post('/v1/export/preview')
        .set('Authorization', `Bearer ${token}`)
        .send({preview: true})

      should(response.body).be.type('object')
      let data = response.body
      should(data).have.property('totalSize')
      assert.equal(data.totalSize, 125000)
      should(data).have.property('fileTree')

    } catch (err) {
      should.not.exist(err)
      throw err
    }

  })

})
