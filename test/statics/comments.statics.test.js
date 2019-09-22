//  assertions
import chai from 'chai'
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'
// services
import mongoose from 'mongoose'
import { initBefore, initAfter } from '../setup'
// fixtures
import fixtures from '../fixtures'
// model
import Comments from '../../src/models/comment/comment.model'

const pages = fixtures.collections.pages
const comments = fixtures.collections.comments
const authors = fixtures.collections.authors


describe('Comment statics tests...', async () => {

  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('findOneActiveById', () => {

    it('should return error if commentId is not valid ObjectId', async () => {
      try {

        let commentId = 'fakeId'
        let response = await Comments.findOneActiveById(commentId)

        expect(response).to.not.exist

      } catch (err) {
        err.should.be.type('object')
        assert.equal(err instanceof Error, true)
        expect(err.message).to.be.equal('Cast to ObjectId failed for value "fakeId" at path "_id" for model "comments"')
        // throw err
      }
    })

    it('should return document from query', async () => {
      try {

        let commentId = comments[0]['_id']
        let response = await Comments.findOneActiveById(commentId)

        response.should.be.type('object')
        expect(response).to.have.property('page')
        expect(response).to.have.property('text')
        expect(response).to.have.property('active')
        expect(response).to.have.property('created')
        // ...
        expect(response._id.toString()).to.equals(commentId)
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

  })

  describe('deleteAllPageComments', () => {

    it('should return error if commentId is not valid ObjectId', async () => {
      try {

        let authorId = 'fakeId'
        let response = await Comments.findAllAuthorsComments(authorId)

        expect(response).to.not.exist

      } catch (err) {
        err.should.be.type('object')
        assert.equal(err instanceof Error, true)
        expect(err.message).to.be.equal('Cast to ObjectId failed for value "fakeId" at path "author" for model "comments"')
        // throw err
      }
    })

    it('should return all authors comments', async () => {
      try {

        let authorId = authors[3]['_id']
        let response = await Comments.findAllAuthorsComments(authorId)

        expect(response).to.be.an('array').and.have.lengthOf(4)
        response.forEach(item => {
          expect(item).to.have.property('page')
          expect(item).to.have.property('text')
          expect(item).to.have.property('active')
          expect(item).to.have.property('created')
          // ...
          expect(item.author.toString()).to.equals(authorId)
        })
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

  })

  describe('findAllAuthorsComments', () => {

    it('should return error if commentId is not valid ObjectId', async () => {
      try {

        let pageId = 'fakeId'
        let response = await Comments.deleteAllPageComments(pageId)

        expect(response).to.not.exist

      } catch (err) {
        err.should.be.type('object')
        assert.equal(err instanceof Error, true)
        expect(err.message).to.be.equal('Cast to ObjectId failed for value "fakeId" at path "page" for model "comments"')
        // throw err
      }
    })

    it('should return all authors comments', async () => {
      try {

        let pageId = pages[0]['_id']

        // check before
        let commentsBefore = await Comments.find({
          page: pageId,
          active: true,
          deleted: false
        })
        expect(commentsBefore).to.be.an('array').with.lengthOf(5)
        commentsBefore.forEach(item => {
          expect(item.page.toString()).to.equals(pageId)
        })

        // soft delete comments
        let response = await Comments.deleteAllPageComments(pageId)

        // check after
        let commentsAfter = await Comments.find({
          page: pageId,
          active: true,
          deleted: false
        })
        expect(commentsAfter).to.be.an('array').with.lengthOf(0)

        // check finding deleted comments
        let deletedComments = await Comments.find({
          page: pageId,
          active: false,
          deleted: true
        })
        expect(deletedComments).to.be.an('array').with.lengthOf(5)

        // final check with response
        let expected = {
          n: 5,
          nModified: 5,
          ok: 1
        }
        expect(response).to.deep.equals(expected)

      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

  })

})