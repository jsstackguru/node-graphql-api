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
import { CommentSpam } from '../../src/models/comment-spam'


describe('Comment spam models', () => {

  after(async () => {
    await initAfter()
  })

  describe('Create', () => {

    it('should create new comment spam', async () => {
      try {

        const author = ObjectId()
        const commentId = ObjectId()
        let spamObj = {
          author,
          commentId,
          ipAddress: '1:2:3',
          message: 'some message',
          reason: 1
        }

        await CommentSpam.create(spamObj)

        let newSpam = await CommentSpam.findOne({author})

        expect(newSpam).to.be.an('object')
        expect(newSpam).to.have.property('created')
        expect(newSpam).to.have.property('updated')
        expect(newSpam).to.have.property('reason')
        expect(newSpam).to.have.property('message')

        // all props must be the same as in spamObj
        for (let key in spamObj) {
          let prop = spamObj[key]
          expect(prop).to.deep.equal(newSpam[key])
        }

      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('should fail comment spam props validations required', async () => {
      try {
        let spamObj = {}

        let spam = await CommentSpam.create(spamObj)

        expect(spam).to.not.exist
      } catch (err) {
        let errors = [
          'comment_spam validation failed',
          'Message is required',
          'IP address is required',
          'Comment ID is required',
          'Author ID is required'
        ]
        for (let error of errors) {
          expect(err.message).to.include(error)
        }
      }
    })

    it('should fail comment spam props validation for cast to OID ', async () => {
      try {
        let inviteObj = {
          author: 'fakeID1',
          commentId: 'fakeID2',
          ipAddress: '1:3:4',
          message: 'mess',
          reason: 1
        }

        let spam = await CommentSpam.create(inviteObj)
        expect(spam).to.not.exist

      } catch (err) {
        let errors = err.errors
        for (let key in errors) {
          let prop = errors[key]
          expect(prop.message).to.includes('Cast to ObjectID failed for value')
          expect(prop.name).to.equal('CastError')
        }
      }
    })

  })

  describe('Update', () => {

    const author = ObjectId()
    const commentId = ObjectId()
    let spamObj = {
      author,
      commentId,
      ipAddress: '1:@:3',
      message: 'mess',
      reason: 1
    }

    before( async () => {
      await CommentSpam.create(spamObj)
    })

    it('should update comment spam', async () => {
      try {
        const query = { author }
        const update = {
          ipAddress: '2:@:2',
          message: 'updated message',
        }
        const options = { new: true }
        let updatedSpam = await CommentSpam.findOneAndUpdate(query, update, options)

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
    const commentId = ObjectId()
    let spamObj = {
      author,
      commentId,
      ipAddress: '1:@:3',
      message: 'mess',
      reason: 1
    }

    before(async () => {
      await CommentSpam.create(spamObj)
    })

    it('should delete comment spam', async () => {
      try {
        const query = { author }
        await CommentSpam.findOneAndRemove(query)
        let after = await CommentSpam.findOne(query)

        expect(after).to.be.null
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

})

