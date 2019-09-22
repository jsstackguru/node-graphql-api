//  assertions
import chai from 'chai'
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'
// services
import { initBefore, initAfter } from '../setup'
import { ObjectId } from 'mongodb'
// model
import { Activity } from '../../src/models/activity'
import translate from '../../src/lib/translate';

describe('activity model', () => {

  after(async () => {
    await initAfter()
  })

  describe('Create', () => {

    it('should create new activity', async () => {
      try {

        const authorId = ObjectId()
        let activityObj = {
          author: authorId,
          type: 'rand type',
          data: {a: 1, b: ['r', 'a', 'n', 'd']}
        }

        await Activity.create(activityObj)

        let newActivity = await Activity.findOne({author: authorId})

        expect(newActivity).to.be.an('object')
        expect(newActivity).to.have.property('created')
        expect(newActivity).to.have.property('updated')

        // all props must be the same as in comObj
        for (let key in activityObj) {
          let prop = activityObj[key]
          expect(prop).to.deep.equal(newActivity[key])
        }

      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('should fail activity props validations', async () => {
      let activityObj
      try {
        const authorId = ObjectId()
        activityObj = {
          author: '',
          type: '',
          // data: ''
        }

        let device = await Activity.create(activityObj)
        expect(device).to.not.exist
      } catch (err) {
        let rules = ['activities validation failed', 'Cast to ObjectID failed', 'Type is required', 'Data is required']
        for (let rule of rules) {
          expect(err.message).to.include(rule)
        }
      }
    })

  })

  describe('Update', () => {

    const authorId = ObjectId()
    let activityObj = {
      author: authorId,
      type: 'rand type',
      data: {a: 1, b: ['r', 'a', 'n', 'd']}
    }

    before( async () => {
      await Activity.create(activityObj)
    })

    it('should update activity', async () => {
      try {
        const newAuthor = ObjectId()
        const query = { author: authorId}
        const update = {
          author: newAuthor,
          type: 'new updated type',
          data: {updated: true}
        }
        const options = { new: true }
        let updatedDevice = await Activity.findOneAndUpdate(query, update, options)

        expect(updatedDevice).to.exist.and.be.an('object')

        for (let key in activityObj) {
          // check if props exist
          expect(updatedDevice[key]).to.exist
          // check if props updated
          if (update[key]) {
            expect(updatedDevice[key]).to.deep.equals(update[key])
          }
        }
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('Delete', () => {

    const authorId = ObjectId()
    let activityObj = {
      author: authorId,
      type: 'rand type',
      data: {a: 1, b: ['r', 'a', 'n', 'd']}
    }

    before(async () => {
      await Activity.create(activityObj)
    })

    it('should delete activity', async () => {
      try {
        const query = { author: authorId }
        await Activity.findOneAndRemove(query)
        let after = await Activity.findOne(query)

        expect(after).to.be.null
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

})

