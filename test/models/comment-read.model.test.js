//  assertions
import chai from 'chai'
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'
// services
import { initBefore, initAfter } from '../setup'
import { ObjectId } from 'mongodb'
// model
import { CommentRead } from '../../src/models/comment-read'

describe('comment-read models', () => {

  after(async () => {
    await initAfter()
  })

  describe('Create', () => {

    it('should create new comment-read', async () => {
      try {
        const commentId = ObjectId()
        const userId = ObjectId()
        let comObj = {
          comment: commentId,
          userRead: [userId]
        }

        let commentRead = await CommentRead.create(comObj)
        await commentRead.save()

        let newComment = await CommentRead.findOne({comment: commentId})

        expect(newComment).to.be.an('object')
        expect(newComment).to.have.property('created')
        expect(newComment).to.have.property('updated')

        // all props must be the same as in comObj
        for (let key in comObj) {
          let prop = comObj[key]
          expect(prop).to.deep.equal(newComment[key])
        }

      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('should fail comment prop validation', async () => {
      try {
        let comObj = {
          // comment: ''
        }
        let newComment = await CommentRead.create(comObj)
        expect(newComment).to.not.exist
      } catch (err) {
        let rules = ['comments_reads validation failed', 'Comment ID is required']

        for (let rule of rules) {
          expect(err.message).to.include(rule)
        }

      }
    })

    it('should fail OID validation', async () => {
      try {
        let comObj = {
          comment: 'fakeID',
          userRead: ['fakeid1']
        }
        let newComment = await CommentRead.create(comObj)
        expect(newComment).to.not.exist
      } catch (err) {
        let errors = ['comments_reads validation failed', 'Cast to ObjectID failed', 'Cast to Array failed']
        for (let rule of errors) {
          expect(err.message).to.include(rule)
        }
      }
    })
  })

  describe('Update', () => {

    const defaultCommentId = ObjectId()

    before( async () => {
      await CommentRead.create({
        comment: defaultCommentId,
      })
    })

    it('should update comment-read', async () => {
      try {
        const query = { comment: defaultCommentId}
        let user1 = ObjectId()
        let user2 = ObjectId()
        const newUserRead = [user1, user2]
        const update = {
          $push: {
            userRead: {
              $each: [user1, user2 ]
            }
          }
        }
        const options = { new: true }
        let updatedCommentRead = await CommentRead.findOneAndUpdate(query, update, options)
        expect(updatedCommentRead).to.exist.and.be.an('object').and.have.property('userRead')
        updatedCommentRead.userRead.forEach(item => {
          expect(newUserRead.map(r => String(r))).to.includes(item.toString())
        })
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('Delete', () => {
    const defaultCommentId = ObjectId()

    before(async () => {
      await CommentRead.create({
        comment: defaultCommentId,
      })
    })

    it('should delete comment-read', async () => {
      try {
        const query = { comment: defaultCommentId }
        await CommentRead.findOneAndRemove(query)
        let after = await CommentRead.find(query)

        expect(after).to.have.lengthOf(0)
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

})

