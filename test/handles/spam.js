/**
 * @file Tests for page handles
 * @author Nikola Miljkovic <mnikson@storyr.com>
 * @version 1.0
 */

//  assertions
import chai from 'chai'
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'
// handles
import spamHndl from '../../src/handles/spam.handles'
// fixtures
import fixtures from '../fixtures'
import { initAfter, initBefore } from '../setup'

const authors = fixtures.collections.authors
const pages = fixtures.collections.pages
const stories = fixtures.collections.stories
const comments = fixtures.collections.comments
const storySpams = fixtures.collections.story_spam
const pageSpams = fixtures.collections.page_spam
const commentSpams = fixtures.collections.comment_spam

describe('Spam handles tests...', () => {

  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('reportStory', () => {
    it('should return error if not authorized', async () => {
      try {
        let userId = '58eb78b94b432a21008c2340'
        let storyId = stories[0]
        let ip = '1'
        let message = 'lorem ipsum'

        let response = await spamHndl.reportStory(userId, storyId, ip, message)

        expect(response).to.not.exist
      } catch (err) {
        expect(err).to.be.an('object')
        assert.equal(err instanceof Error, true)
        expect(err.message).to.equal('Author not found')
      }
    })

    it('should return error if story not found', async () => {
      try {
        let userId = authors[0]['_id']
        let storyId = '58eb78b94b432a21008c2340'
        let ip = '1'
        let message = 'lorem ipsum'

        let response = await spamHndl.reportStory(userId, storyId, ip, message)
        expect(response).to.not.exist
      } catch (err) {
        expect(err).to.be.an('object')
        assert.equal(err instanceof Error, true)
        expect(err.message).to.equal('Story not found')
      }
    })
    it('should return error if author is reporting his story', async () => {
      try {
        let userId = stories[1]['author']
        let storyId = stories[1]['_id']
        let ip = '1'
        let message = 'lorem ipsum'

        let response = await spamHndl.reportStory(userId, storyId, ip, message)
        expect(response).to.not.exist

      } catch (err) {
        expect(err).to.be.an('object')
        assert.equal(err instanceof Error, true)
        expect(err.message).to.equal("You can't report your story")
      }
    })
    it('should return error if author already reported same story', async () => {
      try {
        let userId = storySpams[7]['author']
        let storyId = storySpams[7]['storyId']
        let ip = '1'
        let message = 'lorem ipsum'

        let response = await spamHndl.reportStory(userId, storyId, ip, message)
        expect(response).to.not.exist

      } catch (err) {
        expect(err).to.be.an('object')
        assert.equal(err instanceof Error, true)
        expect(err.message).to.equal('You already reported this story')
      }
    })
    it('should return error if report from same ip address more than 5 times', async () => {
      try {
        let userId = authors[0]['_id']
        let storyId = stories[4]['_id']
        let ip = '123456'
        let message = 'lorem ipsum'

        let response = await spamHndl.reportStory(userId, storyId, ip, message)
        expect(response).to.not.exist

      } catch (err) {
        expect(err).to.be.an('object')
        assert.equal(err instanceof Error, true)
        expect(err.message).to.equal('You can\'t report from the same IP address')
      }
    })

    it('should return spam object if everything\'s fine', async () => {
      try {
        let userId = authors[0]['_id']
        let storyId = stories[4]['_id']
        let ip = '654321'
        let message = 'lorem ipsum'

        let response = await spamHndl.reportStory(userId, storyId, ip, message)

        expect(response).to.be.an('object')
        assert.equal(response instanceof Error, false)
        assert.equal(response.ipAddress, ip)
        assert.equal(response.message, message)
        assert.equal(response.author, userId)
        assert.equal(response.storyId, storyId)
      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('reportPage', () => {
    it('should return error if not authorized', async () => {
      try {
        let userId = '58eb78b94b432a21008c2340'
        let pageId = pages[0]
        let ip = '1'
        let message = 'lorem ipsum'

        let response = await spamHndl.reportPage(userId, pageId, ip, message)
        expect(response).to.not.exist

      } catch (err) {
        expect(err).to.be.an('object')
        assert.equal(err instanceof Error, true)
        expect(err.message).to.equal('Author not found')
      }
    })

    it('should return error if page not found', async () => {
      try {
        let userId = authors[0]['_id']
        let pageId = '58eb78b94b432a21008c2340'
        let ip = '1'
        let message = 'lorem ipsum'

        let response = await spamHndl.reportPage(userId, pageId, ip, message)
        expect(response).to.not.exist

      } catch (err) {
        expect(err).to.be.an('object')
        assert.equal(err instanceof Error, true)
        expect(err.message).to.equal('Page not found')
      }
    })

    it('should return error if author is reporting his page', async () => {
      try {
        let userId = pages[0]['author']
        let pageId = pages[1]['_id']
        let ip = '1'
        let message = 'lorem ipsum'

        let response = await spamHndl.reportPage(userId, pageId, ip, message)
        expect(response).to.not.exist

      } catch (err) {
        expect(err).to.be.an('object')
        assert.equal(err instanceof Error, true)
        expect(err.message).to.equal("You can't report your page")
      }
    })

    it('should return error if author already reported same page', async () => {
      try {
        let userId = pageSpams[7]['author']
        let pageId = pageSpams[7]['pageId']
        let ip = '1'
        let message = 'lorem ipsum'

        let response = await spamHndl.reportPage(userId, pageId, ip, message)
        expect(response).to.not.exist

      } catch (err) {
        expect(err).to.be.an('object')
        assert.equal(err instanceof Error, true)
        expect(err.message).to.equal('You already reported this page')
      }
    })

    it('should return error if report from same ip address more than 5 times', async () => {
      try {
        let userId = authors[0]['_id']
        let pageId = pages[4]['_id']
        let ip = '123456'
        let message = 'lorem ipsum'

        let response = await spamHndl.reportPage(userId, pageId, ip, message)
        expect(response).to.not.exist

      } catch (err) {
        expect(err).to.be.an('object')
        assert.equal(err instanceof Error, true)
        expect(err.message).to.equal('You can\'t report from the same IP address')
      }
    })

    it('should return spam object if everything\'s fine', async () => {
      try {
        let userId = authors[0]['_id']
        let pageId = pages[4]['_id']
        let ip = '654321'
        let message = 'lorem ipsum'

        let response = await spamHndl.reportPage(userId, pageId, ip, message)

        expect(response).to.be.an('object')
        assert.equal(response instanceof Error, false)
        assert.equal(response.ipAddress, ip)
        assert.equal(response.message, message)
        assert.equal(response.author, userId)
        assert.equal(response.pageId, pageId)
      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('reportComment', () => {
    it('should return error if not authorized', async () => {
      try {
        let userId = '58eb78b94b432a21008c2340'
        let commentId = comments[0]
        let ip = '1'
        let message = 'lorem ipsum'

        let response = await spamHndl.reportComment(userId, commentId, ip, message)
        expect(response).to.not.exist

      } catch (err) {
        expect(err).to.be.an('object')
        assert.equal(err instanceof Error, true)
        expect(err.message).to.equal('Author not found')
      }
    })

    it('should return error if comment not found', async () => {
      try {
        let userId = authors[0]['_id']
        let commentId = '58eb78b94b432a21008c2340'
        let ip = '1'
        let message = 'lorem ipsum'

        let response = await spamHndl.reportComment(userId, commentId, ip, message)
        expect(response).to.not.exist

      } catch (err) {
        expect(err).to.be.an('object')
        assert.equal(err instanceof Error, true)
        expect(err.message).to.equal('Comment not found')
      }
    })

    it('should return error if author is reporting his comment', async () => {
      try {
        let userId = comments[0]['author']
        let commentId = comments[0]['_id']
        let ip = '1'
        let message = 'lorem ipsum'

        let response = await spamHndl.reportComment(userId, commentId, ip, message)
        expect(response).to.not.exist

      } catch (err) {
        expect(err).to.be.an('object')
        assert.equal(err instanceof Error, true)
        expect(err.message).to.equal("You can't report your comment")
      }
    })

    it('should return error if author already reported same comment', async () => {
      try {
        let userId = commentSpams[7]['author']
        let commentId = commentSpams[7]['commentId']
        let ip = '1'
        let message = 'lorem ipsum'

        let response = await spamHndl.reportComment(userId, commentId, ip, message)
        expect(response).to.not.exist

      } catch (err) {
        expect(err).to.be.an('object')
        assert.equal(err instanceof Error, true)
        expect(err.message).to.equal('You already reported this comment')
      }
    })

    it('should return error if report from same ip address more than 5 times', async () => {
      try {
        let userId = authors[0]['_id']
        let commentId = comments[4]['_id']
        let ip = '123456'
        let message = 'lorem ipsum'

        let response = await spamHndl.reportComment(userId, commentId, ip, message)
        expect(response).to.not.exist

      } catch (err) {
        expect(err).to.be.an('object')
        assert.equal(err instanceof Error, true)
        expect(err.message).to.equal('You can\'t report from the same IP address')
      }
    })

    it('should return data object for emit if everything\'s fine', async () => {
      try {
        let userId = authors[0]['_id']
        let commentId = comments[4]['_id']
        let ip = '654321'
        let message = 'lorem ipsum'

        let response = await spamHndl.reportComment(userId, commentId, ip, message)

        expect(response).to.be.an('object')
        const resKeys = ['spam', 'comment', 'story']

        for (let key in response) {
          expect(resKeys).to.includes(key)
          expect(response[key]).to.exist
        }
        assert.equal(response instanceof Error, false)
        let resSpam = response.spam
        assert.equal(resSpam.ipAddress, ip)
        assert.equal(resSpam.message, message)
        assert.equal(resSpam.author, userId)
        assert.equal(resSpam.commentId, commentId)
      } catch (err) {
        should.not.exist(err)
      }
    })
  })
})

