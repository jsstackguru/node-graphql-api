//  assertions
import chai from 'chai'
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'
// services
import { initBefore, initAfter } from '../setup'
import { ObjectId } from 'mongodb'
// model
import { Comment } from '../../src/models/comment'

describe('comment models', () => {

  before(async () => {
    // await initBefore()
    let newComment = await Comment.create({
      text: 'default comment', author: ObjectId(), page: ObjectId()
    })
    await newComment.save()
  })

  after(async () => {
    await initAfter()
  })

  describe('Create', () => {

    it('should create new comment', async () => {
      try {
        let comObj = {
          text: 'asdf',
          author: ObjectId(),
          page: ObjectId(),
          spam: 3,
          reply: ObjectId(),
        }

        let comment = await Comment.create(comObj)
        await comment.save()

        let newComment = await Comment.findOne({text: 'asdf'})

        expect(newComment).to.be.an('object')
        expect(newComment).to.have.property('created')
        expect(newComment).to.have.property('updated')

        // all props must be the same as in comObj
        for (let key in comObj) {
          let prop = comObj[key]
          expect(prop).to.deep.equal(newComment[key])
        }

      } catch (err) {
        expect(err).to.exist
      }
    })

    it('should fail required validation', async () => {
      try {
        let comObj = {}

        let newComment = await Comment.create(comObj)
        expect(newComment).to.not.exist
      } catch (err) {
        let errors = [
          'comments validation failed',
          'Text field is required',
          'Page ID is required',
          'Author ID is required'
        ]
        for (let error of errors) {
          expect(err.message).to.includes(error)
        }
      }
    })

    it('should fail custom validation and OID', async () => {
      let comObj
      try {
        comObj = {
          author: 'fakeID',
          page: 'fakeID2',
          reply: 'fakeID3',
          text: '  '
        }

        let newComment = await Comment.create(comObj)
        expect(newComment).to.not.exist
      } catch (err) {
        let errors = [
          'comments validation failed',
          `Cast to ObjectID failed for value "${comObj['author']}"`,
          `Cast to ObjectID failed for value "${comObj['page']}"`,
          `Cast to ObjectID failed for value "${comObj['reply']}"`,
          'Comment must contain some letters'
        ]
        for (let error of errors) {
          expect(err.message).to.includes(error)
        }
      }
    })

  })

  describe('Update', () => {
    it('should update default comment', async () => {
      try {
        const query = { text: 'default comment'}
        const update = { deleted: true, deletedAt: new Date()}
        const options = { new: true }

        let updatedComment = await Comment.findOneAndUpdate(query, update, options)

        expect(updatedComment).to.exist.and.be.an('object')
        for (let key in update) {
          let prop = update[key]
          expect(prop).to.deep.equal(update[key])
        }
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('Delete', () => {
    it('should delete default comment', async () => {
      try {
        const query = { text: 'default comment'}
        await Comment.findOneAndRemove(query)
        let after = await Comment.find(query)

        expect(after).to.have.lengthOf(0)
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

})

