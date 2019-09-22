/**
 * @file Author API tests
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

//  assert
import chai from 'chai'
import { assert, expect } from 'chai'
import should from 'should'
import chaiHttp from 'chai-http'
import server from '../setup/server'
// libs
import translate from '../../src/lib/translate'
// router
import deviceRtr from '../../src/routes/device'
// fistures
import fixtures from '../fixtures'
// services
import { generateToken } from '../../src/services/auth'
import { initAfter, initBefore } from '../setup'

const authors = fixtures.collections.authors
const devices = fixtures.collections.devices

chai.use(chaiHttp)

describe('should test API for device...', () => {
  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('create devices', () => {
    it('should return error if not authorized', async () => {
      try {

        let response = await chai.request(server)
          .post('/v1/devices')
          .set('Authorization', `Bearer `)
          .send({})

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

    it('should return error if fields are missing', async () => {
      try {
        let author = authors[1]
        let token = generateToken(author['email'])
        let data = {
          author: author.id,
          locale: 'rs'
        }

        let response = await chai.request(server)
          .post('/v1/devices')
          .set('Authorization', `Bearer ${token}`)
          .send(data)

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Fields not found'))
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return internal server error ', async () => { //TODO: sigurno postoji bolji nacin za testiranje catch blocka
      try {
        let response = await deviceRtr.registerDevice()
        expect(response).to.not.exist
      } catch (err) {
        should.exist(err)
        assert.equal(err instanceof Error, true)
      }
    })

    it('should return device object', async () => {
      try {
        let author = authors[1]
        let token = generateToken(author['email'])
        let data = devices[2]

        let response = await chai.request(server)
          .post(`/v1/devices`)
          .set('Authorization', `Bearer ${token}`)
          .send(data)

        // console.log(JSON.stringify(response.body, null, 2))
        let result = response.body
        expect(result).to.have.property('data')
        should.not.exist(result.error)
        let device = result.data
        should(device).have.property('_id')
        device.should.have.property('locale').and.equal(data['locale'])
        device.should.have.property('timezone').and.equal(data['timezone'])
        device.should.have.property('platform').and.equal(data['platform'])

      } catch (err) {
        should.not.exist(err)
      }
    })
  })

})
