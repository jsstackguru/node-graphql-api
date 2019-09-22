//  assertions
import chai from 'chai'
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'
// models
import { Comment } from '../../src/models/comment'
// faker
import commentFaker from '../fixtures/faker/comment/comment.faker'
// after hooks
import { initAfter } from '../setup/'
// utils
import { ObjectId } from 'mongodb'

describe('comment faker', () => {

  const expectedKeys = [
    '_id', 'author', 'page', 'text', 'active', 'deleted', 'spam', 'reply'
   ]

  afterEach(async () => {
    await initAfter()
  })

  it('should create comments with default params if no args', async () => {
    await commentFaker({})

    let comments = await Comment.find({})

    expect(comments).to.be.an('array').and.have.lengthOf(1)

    comments.forEach(invite => {
      expectedKeys.forEach(key => {
        expect(invite[key]).to.exist
      })
    })
  })

  it('should create comments with only number of comment arg', async () => {
    let params = {
      n: 12,
    }
    await commentFaker(params)
    let comments = await Comment.find({})

    expect(comments).to.have.lengthOf(params.n)
    comments.forEach(comment => {
      expectedKeys.forEach(key => {
        expect(comment[key]).to.exist
      })
    })
  })

  it('should create comments with all args', async () => {
    let params = {
      n: 3,
      author: ObjectId(),
      page: ObjectId(),
      active: false,
      reply: ObjectId(),
    }
    await commentFaker(params)
    let comments = await Comment.find({})
    expect(comments).to.have.lengthOf(params.n)
    comments.forEach(comment => {
      expectedKeys.forEach(key => {
        expect(comment[key]).to.exist
      })
      expect(comment.author).to.deep.equals(params.author)
      expect(comment.page).to.deep.equals(params.page)
      expect(comment.active).to.equals(params.active)
      expect(comment.reply).to.deep.equals(params.reply)
    })
  })

})
