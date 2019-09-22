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
import { PageSpam } from '../../src/models/page-spam'

describe('Page spam models', () => {

  after(async () => {
    await initAfter()
  })

  describe('Create', () => {

    it('should create new page spam', async () => {
      try {

        const author = ObjectId()
        const pageId = ObjectId()
        let spamObj = {
          author,
          pageId,
          ipAddress: '1:2:3',
          message: 'some message',
        }

        await PageSpam.create(spamObj)

        let newSpam = await PageSpam.findOne({author})

        expect(newSpam).to.be.an('object')
        expect(newSpam).to.have.property('created')
        expect(newSpam).to.have.property('updated')

        // all props must be the same as in spamObj
        for (let key in spamObj) {
          let prop = spamObj[key]
          expect(prop).to.deep.equal(newSpam[key])
        }

      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('should fail device props validations required', async () => {
      try {
        let spamObj = {}

        let spam = await PageSpam.create(spamObj)

        expect(spam).to.not.exist
      } catch (err) {
        let errors = [
          'page_spam validation failed',
          'Message is required',
          'IP Address is required',
          'Author ID is required'
        ]

        for (let error of errors) {
          expect(err.message).to.include(error)
        }
      }
    })

    it('should fail device props validation for cast to OID ', async () => {
      let spamObj
      try {
        spamObj = {
          author: 'fakeID1',
          pageId: 'fakeID2',
          ipAddress: '1:3:4',
          message: 'mess',
        }

        let spam = await PageSpam.create(spamObj)
        expect(spam).to.not.exist

      } catch (err) {
        let errors = [
          'page_spam validation failed',
          `Cast to ObjectID failed for value "${spamObj.author}"`,
          `Cast to ObjectID failed for value "${spamObj.pageId}"`
        ]

        for (let error of errors) {
          expect(err.message).to.include(error)
        }
      }
    })

  })

  describe('Update', () => {

    const author = ObjectId()
    const pageId = ObjectId()
    let spamObj = {
      author,
      pageId,
      ipAddress: '1:@:3',
      message: 'mess'
    }

    before( async () => {
      await PageSpam.create(spamObj)
    })

    it('should update device', async () => {
      try {
        const query = { author }
        const update = {
          ipAddress: '2:@:2',
          message: 'updated message',
        }
        const options = { new: true }
        let updatedSpam = await PageSpam.findOneAndUpdate(query, update, options)

        expect(updatedSpam).to.exist.and.be.an('object')

        for (let key in spamObj) {
          // check if props exist
          expect(updatedSpam[key]).to.exist
          // check if props updated
          if (update[key]) {
            expect(updatedSpam[key]).to.equals(update[key])
          }
        }
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('Delete', () => {

    const author = ObjectId()
    const pageId = ObjectId()
    let spamObj = {
      author,
      pageId,
      ipAddress: '1:@:3',
      message: 'mess'
    }

    before(async () => {
      await PageSpam.create(spamObj)
    })

    it('should delete invite', async () => {
      try {
        const query = { author }
        await PageSpam.findOneAndRemove(query)
        let after = await PageSpam.findOne(query)

        expect(after).to.be.null
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

})

