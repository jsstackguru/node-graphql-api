//  assertions
import chai from 'chai'
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'
// services
import { initBefore, initAfter } from '../setup'
import { ObjectId } from 'mongodb'
import translate from '../../src/lib/translate';
// model
import { Following } from '../../src/models/following'


describe('Following model', () => {

  after(async () => {
    await initAfter()
  })

  describe('Create', () => {

    it('should create new following', async () => {
      try {

        const author = ObjectId()
        const follows = ObjectId()
        let followObj = {
          author,
          follows,
          active: true
        }

        await Following.create(followObj)

        let newFG = await Following.findOne({author})

        expect(newFG).to.be.an('object')
        expect(newFG).to.have.property('created')
        expect(newFG).to.have.property('updated')

        // all props must be the same as in followObj
        for (let key in followObj) {
          let prop = followObj[key]
          expect(JSON.stringify(prop)).to.deep.equal(JSON.stringify(newFG[key]))
        }

      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('should fail following props validations required', async () => {
      try {
        let followObj = {}

        let following = await Following.create(followObj)
        expect(following).to.not.exist
      } catch (err) {
        let errors = [
          'followings validation failed',
          'Follows ID is required',
          'Author ID is required'
        ]

        for (let error of errors) {
          expect(err.message).to.includes(error)
        }
      }
    })

    it('should fail following props validation for cast to OID ', async () => {
      let followObj
      try {
        followObj = {
          author: '1234',
          follows: 1234,
          active: true
        }

        let following = await Following.create(followObj)
        expect(following).to.not.exist

      } catch (err) {
        let errors = [
          'followings validation failed',
          `Cast to ObjectID failed for value "${followObj.author}"`,
          `Cast to ObjectID failed for value "${followObj.follows}"`
        ]

        for (let error of errors) {
          expect(err.message).to.includes(error)
        }
      }
    })

  })

  describe('Update', () => {

    const author = ObjectId()
    const follows = ObjectId()
    let followObj = {
      author,
      follows,
      active: true
    }


    before( async () => {
      await Following.create(followObj)
    })

    it('should update following', async () => {
      try {
        const query = { author }
        const update = { token: 'updated token' }

        const options = { new: true }
        let updatedFG = await Following.findOneAndUpdate(query, update, options)

        expect(updatedFG).to.exist.and.be.an('object')

        for (let key in followObj) {
          // check if props exist
          expect(updatedFG[key]).to.exist
          // check if props updated
          if (update[key]) {
            expect(updatedFG[key]).to.equals(update[key])
          }
        }
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('Delete', () => {

    const author = ObjectId()
    const follows = ObjectId()
    let followObj = {
      author,
      follows,
      active: true
    }

    before(async () => {
      await Following.create(followObj)
    })

    it('should delete following', async () => {
      try {
        const query = { author }
        await Following.findOneAndRemove(query)
        let after = await Following.findOne(query)

        expect(after).to.be.null
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

})

