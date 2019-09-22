/**
 * @file Tests for page handles
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

//  assertions
import chai from 'chai'
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'
// handles
import deviceHndl from '../../src/handles/device.handles'
// fixtures
import fixtures from '../fixtures'
import { initAfter, initBefore } from '../setup'

const authors = fixtures.collections.authors
const devices = fixtures.collections.devices
const stories = fixtures.collections.stories

describe('Device handles tests...', () => {

  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('registerDevice', () => {

    it('should return new device if no pushToken', async () => {
      try {
        let author = authors[0]
        let data = {
          appVersion: '11.4',
          locale: 'ar-SA',
          osVersion: '12.4.5',
          pushToken: '53fa0905ec359a06bc88755217e76de6633a30087cf531b7131f031a92af5c47',
          timezone: 'Europe/Belgrade',
          platform: 'ios'
        }

        let response = await deviceHndl.registerDevice(author._id, data)

        expect(response).to.be.an('object')
        assert.equal(response instanceof Error, false)

        for (let key in data) {
          let prop = data[key]
          assert.equal(response[key], prop)
        }
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return updated device if token match and user not', async () => {
      try {
        let user = authors[0]
        let device = devices[0]
        let deviceAuthor = authors[3]
        let data = device
        data.author = deviceAuthor._id

        expect(device.author).not.equal(user._id)

        let response = await deviceHndl.registerDevice(user._id, data)

        expect(response).to.be.an('object')
        assert.equal(response instanceof Error, false)
        expect(response.author.toString()).to.equal(user._id)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return same object same devices data provided', async () => {
      try {

        let data = devices[2]
        let userId = data.author

        let response = await deviceHndl.registerDevice(userId, data)

        expect(response).to.be.an('object')
        assert.equal(response instanceof Error, false)

        for (let key in data) {
          let prop = data[key]
          assert.equal(response[key], prop)
        }

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return internal error', async () => {
      try {

        let response = await deviceHndl.registerDevice()
        assert.equal(response instanceof Error, true)

      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('getUsersDevices', () => {
    it('should return error if false argument', async () => {
      try {
        // case 1
        let response = await deviceHndl.getUsersDevices('')
        expect(response).to.be.throw
        assert.equal(response.message.startsWith('Cast to ObjectId failed for value ""'), true)
        // case 2
        response = await deviceHndl.getUsersDevices('asdfkdfjsl3234')
        expect(response).to.be.throw
        assert.equal(response.message.startsWith('Cast to ObjectId failed for value "asdfkdfjsl3234"'), true)
      } catch (err) {
        should.not.exist(err)
      }
    })
    it('should return single user devices', async () => {
      try {
        let user = authors[0]
        let userId =  user._id
        let tempDevice = devices[0]

        let response = await deviceHndl.getUsersDevices(userId)
        let responseObj = response[0]

        assert.equal(response instanceof Error, false)
        expect(response).to.be.an('array').lengthOf(1)

        for (let key in tempDevice) {
          expect(responseObj).to.have.property(key)
        }
      } catch (err) {
        should.not.exist(err)
      }
    })
    it('should return multiple users devices', async () => {
      try {
        let tempDevice = devices[0]
        let users = [authors[0]['_id'], authors[1]['_id'], authors[2]['_id']]

        let response = await deviceHndl.getUsersDevices(users)

        assert.equal(response instanceof Error, false)
        expect(response).to.be.an('array')

        response.forEach(device => {
          for (let key in tempDevice) {
            expect(device).to.have.property(key)
          }
        })
      } catch (err) {
        should.not.exist(err)
      }
    })
  })

})

