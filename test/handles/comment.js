/**
 * @file Tests for page handles
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

//  assertions
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'

// services
import mongoose from 'mongoose'
const ObjectId = mongoose.Types.ObjectId
import { initBefore, initAfter } from '../setup'

// fixtures
import fixtures from '../fixtures'

// handles
import commentHndl from '../../src/handles/comment.handles'

// Fakers
import {
  authorFaker,
  storyFaker,
  commentFaker,
  pageFaker
} from '../fixtures/faker'

const authors = fixtures.collections.authors
const pages = fixtures.collections.pages
const comments = fixtures.collections.comments
const stories = fixtures.collections.stories

describe('Comment handles tests...', async () => {

  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('createComment', () => {

    it('should return error if pageId is not valid ObjectId', async () => {
      try {

        let authorId = authors[0]["_id"]
        let pageId = "notgoodobjectid"
        let text = 'test'

        let response = await commentHndl.createComment(authorId, pageId, text)

      } catch (err) {
        err.should.be.type('object')
        assert.equal(err instanceof Error, true)
        expect(err.message).to.be.equal('pageId is not valid ObjectId')
      }
    })

    it('should return error if page not found in story', async () => {
      try {
        let author = authors[0]
        let story = stories[0]
        let pageId = "5b2a7d3fd216c70e00c357d8"
        let text = 'test'

        let response = await commentHndl.createComment(author, pageId, text)

      } catch (err) {
        err.should.be.type('object')
        assert.equal(err instanceof Error, true)
        expect(err.message).to.be.equal('Story not found')
      }
    })

    it('should return error if text not provided', async () => {
      try {
        let author = authors[0]
        let pageId = pages[0]["_id"]
        let text = ''

        let response = await commentHndl.createComment(author, pageId, text)

      } catch (err) {
        err.should.be.type('object')
        assert.equal(err instanceof Error, true)
        expect(err.message).to.be.equal('You need to enter some text message')
      }
    })

    it('should return new comment', async () => {
      try {
        let author = authors[0]
        let pageId = pages[0]["_id"]
        let text = 'new comment'

        let response = await commentHndl.createComment(author, pageId, text)
        // console.log(JSON.stringify(response, null, 2))

        response.should.be.type('object')
        response.should.have.property('text').and.equal(text)
        response.should.have.property('author')
        assert.equal(response.author._id, author.id)
        response.should.have.property('page').and.deepEqual(ObjectId(pageId))
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })
  })

  describe('createCommentReply', () => {

    it('should return error if commentId is not valid ObjectId', async () => {
      try {
        let author = authors[0]
        let commentId = "notgoodobjectid"
        let text = 'test'

        let response = await commentHndl.createCommentReply(author, commentId, text)

      } catch (err) {
        err.should.be.type('object')
        assert.equal(err instanceof Error, true)
        expect(err.message).to.be.equal('commentId is not valid ObjectId')
      }
    })

    it('should return error if comment not found', async () => {
      try {
        let author = authors[0]
        let commentId = "5b2a7d3fd216c70e00c357d8"
        let text = 'test'
        let response = await commentHndl.createCommentReply(author, commentId, text)

      } catch (err) {
        err.should.be.type('object')
        assert.equal(err instanceof Error, true)
        expect(err.message).to.be.equal('Comment not found')
      }
    })

    it('should return error if text not provided', async () => {
      try {
        let author = authors[0]
        let commentId = comments[0]["_id"]
        let text = ''

        let response = await commentHndl.createCommentReply(author, commentId, text)

      } catch (err) {
        err.should.be.type('object')
        assert.equal(err instanceof Error, true)
        expect(err.message).to.be.equal('You need to enter some text message')
      }
    })

    it('should return new comment reply', async () => {
      try {
        let author = authors[0]
        let comment = comments[0]
        let commentId = comment["_id"]
        let text = 'new comment'

        let response = await commentHndl.createCommentReply(author, commentId, text)

        response.should.be.type('object')
        response.should.have.property('text').and.equal(text)
        response.should.have.property('author')
        assert.equal(response.author._id, author.id)
        response.should.have.property('reply')
        response.should.have.property('page').and.deepEqual(ObjectId(comment.page))
        const reply = response.reply
        should(reply).be.type('object')
        should(reply).have.property('_id')
        should(reply).have.property('text')
        should(reply).have.property('page')
        should(reply).have.property('author')
        should(reply.author).be.type('object')
        response.reply.should.have.property('_id').and.deepEqual(ObjectId(commentId))
      } catch (err) {
        expect(err).to.not.exist
        throw err
      }

    })
  })

  describe('Delete comment', () => {
    let fakeAuthors
    let fakeStory
    let fakeComments

    before(async () => {
      await initAfter()

      fakeAuthors = await authorFaker({
        n: 3
      })
      fakeStory = await storyFaker({
        author: fakeAuthors[0].id,
        single: true
      })
      fakeComments = await commentFaker({
        n: 1,
        author: fakeAuthors[0].id,
        story: fakeStory.id
      })
    })

    after(async () => {
      await initAfter()
    })

    it('should not delete comment, id is missing', async () => {
      try {
        const author = fakeAuthors[0]
        await commentHndl.deleteComment(null, author)
      } catch (err) {
        should.exist(err)
        assert.equal(err.statusCode, 400)
      }
    })

    it('should not delete comment, comment not found', async () => {
      try {
        const author = fakeAuthors[0]
        await commentHndl.deleteComment(ObjectId(), author)
      } catch (err) {
        should.exist(err)
        assert.equal(err.statusCode, 400)
      }
    })

    it('should not delete comment, user does\'t have permissions', async () => {
      try {
        const author = fakeAuthors[1]
        const comment = fakeComments[0]
        await commentHndl.deleteComment(comment.id, author)
      } catch (err) {
        should.exist(err)
        assert.equal(err.statusCode, 403)
      }
    })

    it('should delete comment', async () => {
      try {
        const author = fakeAuthors[0]
        const comment = fakeComments[0]
        const result = await commentHndl.deleteComment(comment.id, author)
        
        should(result).have.property('_id')
        assert.equal(result._id, comment.id)
      } catch (err) {
        console.log(err)
        should.not.exist(err)
      }
    })
  })

  describe('Edit comment', () => {
    let fakeAuthors
    let fakeComment
    let fakeStory

    before(async () => {
      await initAfter()

      fakeAuthors = await authorFaker({
        n: 2
      })
      fakeStory = await storyFaker({
        author: fakeAuthors[0].id,
        single: true
      })
      fakeComment = await commentFaker({
        single: true,
        author: fakeAuthors[0].id,
        story: fakeStory.id
      })
    })

    after(async () => {
      await initAfter()
    })

    it('should not edit comment, comment not found', async () => {
      try {
        const commentId = ObjectId()
        const text = 'New comment body'
        const author = fakeAuthors[0]
        await commentHndl.editComment(commentId, text, author.id)
      } catch (err) {
        should.exist(err)
        assert.equal(err.name, 'UnprocessableEntity')
        assert.equal(err.statusCode, 422)
      }
    })

    it('should not edit comment, user is not the author', async () => {
      try {
        const commentId = fakeComment.id
        const text = 'New comment body'
        const author = fakeAuthors[1]
        await commentHndl.editComment(commentId, text, author.id)
      } catch (err) {
        should.exist(err)
        assert.equal(err.name, 'Forbidden')
        assert.equal(err.statusCode, 403)
      }
    })

    it('should edit comment', async () => {
      try {
        const commentId = fakeComment.id
        const text = 'New comment body'
        const author = fakeAuthors[0]
        const result = await commentHndl.editComment(commentId, text, author.id)

        assert.deepEqual(result._id, commentId)
        assert.equal(result.author._id, author.id)
        assert.deepEqual(result.text, text)
      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
      }
    })
  })

  describe('get comments by page id', () => {
    let comments1
    let comments2
    let pages

    before(async () => {
      await initAfter()
      const story = await storyFaker({
        single: true
      })
      pages = await pageFaker({
        n: 2,
        author: story.author
      })
      comments1 = await commentFaker({
        n: 3,
        page: pages[0]
      })
      comments2 = await commentFaker({
        n: 2,
        page: pages[1]
      })
    })

    after(async () => {
      await initAfter()
    })

    it('should return comments by page id', async () => {
      try {
        const comments = await commentHndl.getCommentsByPage(pages[0].id)

        assert.equal(comments.length, comments1.length)
      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
      }
    })

    it('should return comments by page id', async () => {
      try {
        const comments = await commentHndl.getCommentsByPage(pages[1].id)

        assert.equal(comments.length, comments2.length)
      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
      }
    })
  })
})
