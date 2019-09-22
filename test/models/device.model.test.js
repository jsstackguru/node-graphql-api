//  assertions
import chai from 'chai'
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'
// services
import { initBefore, initAfter } from '../setup'
import { ObjectId } from 'mongodb'
// model
import { Device } from '../../src/models/device'
import translate from '../../src/lib/translate';

describe('device models', () => {

  after(async () => {
    await initAfter()
  })

  describe('Create', () => {

    it('should create new device', async () => {
      try {

        const authorId = ObjectId()
        let deviceObj = {
          author: authorId,
          appVersion: '1',
          locale: 'us',
          osVersion: '10.1.2',
          pushToken: 'asdf1234',
          timezone: 'UTC +1',
          platform: 'iOS'
        }

        await Device.create(deviceObj)

        let newDevice = await Device.findOne({author: authorId})
        expect(newDevice).to.be.an('object')
        expect(newDevice).to.have.property('created')
        expect(newDevice).to.have.property('updated')

        // all props must be the same as in comObj
        for (let key in deviceObj) {
          let prop = deviceObj[key]
          expect(prop).to.deep.equal(newDevice[key])
        }

      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('should fail device props validations', async () => {
      let deviceObj
      try {
        deviceObj = {
          author: '',
          appVersion: '',
          locale: '',
          osVersion: '',
          pushToken: '',
          timezone: '',
          platform: ''
        }

        let device = await Device.create(deviceObj)
        expect(device).to.not.exist
      } catch (err) {
        let errors = [
          'devices validation failed',
          'Cast to ObjectID failed for value',
          'App version is required',
          'Locale is required',
          'OS version is required',
          'Push token is required',
          'Timezone is required',
          'Platform is required'
        ]

        for (let error of errors) {
          expect(err.message).to.includes(error)
        }
      }
    })

  })

  describe('Update', () => {

    const authorId = ObjectId()
    let deviceObj = {
      author: authorId,
      appVersion: '1',
      locale: 'us',
      osVersion: '10.1.2',
      pushToken: 'asdf1234',
      timezone: 'UTC +1',
      platform: 'iOS'
    }

    before( async () => {
      await Device.create(deviceObj)
    })

    it('should update device', async () => {
      try {
        const query = { author: authorId}
        const update = {
          appVersion: '2',
          locale: 'rs',
          timezone: 'UTC +2'
        }
        const options = { new: true }
        let updatedDevice = await Device.findOneAndUpdate(query, update, options)

        expect(updatedDevice).to.exist.and.be.an('object')

        for (let key in deviceObj) {
          // check if props exist
          expect(updatedDevice[key]).to.exist
          // check if props updated
          if (update[key]) {
            expect(updatedDevice[key]).to.equals(update[key])
          }
        }
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('Delete', () => {

    const authorId = ObjectId()
    let deviceObj = {
      author: authorId,
      appVersion: '1',
      locale: 'us',
      osVersion: '10.1.2',
      pushToken: 'asdf1234',
      timezone: 'UTC +1',
      platform: 'iOS'
    }

    before(async () => {
      await Device.create(deviceObj)
    })

    it('should delete device', async () => {
      try {
        const query = { author: authorId }
        await Device.findOneAndRemove(query)
        let after = await Device.findOne(query)

        expect(after).to.be.null
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

})

