/**
 * @file Author API tests
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

//  assert
import chai from 'chai'
import { assert, expect } from 'chai'
import should from 'should'
import chaiHttp from 'chai-http'
import server from '../setup/server'
// libs
import translate from '../../src/lib/translate'
import utils from '../../src/lib/utils'
// fistures
import fixtures from '../fixtures'
// services
import { generateToken } from '../../src/services/auth'
import { initAfter, initBefore } from '../setup'

const stories = fixtures.collections.stories
const authors = fixtures.collections.authors
const pages = fixtures.collections.pages
const comments = fixtures.collections.comments

chai.use(chaiHttp)

describe('should test API for spam...', () => {
  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('report story as spam', () => {
    it('should return error if not authorized', async () => {
      try {

        let response = await chai.request(server)
          .post('/v1/spam/story/123')
          .set('Authorization', `Bearer `)
          .send({})

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(401)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Authorization token missing'))
        expect(errorText.statusCode).to.be.equal(401)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return status and message if OK', async () => {
      try {
        let author = authors[1]
        let token = generateToken(author['email'])
        let storyId = stories[0]['_id']
        let message = 'lorem ipsum'

        let response = await chai.request(server)
          .post(`/v1/spam/story/${storyId}`)
          .set('Authorization', `Bearer ${token}`)
          .send({message})

        // console.log(JSON.stringify(response.body, null, 2))
        expect(response.body.status).to.be.true
        expect(response.body.message).to.equals('You successfully report story')
        // let spam = response.body.data
        // should.exist(response.body)
        // assert.equal(author['_id'], spam.author)
        // assert.equal(spam.message, message)
        // assert.equal(spam.rekordId, rekordId)

      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('report page as spam', () => {
    it('should return error if not authorized', async () => {
      try {

        let response = await chai.request(server)
          .post('/v1/spam/pages/123')
          .set('Authorization', `Bearer `)
          .send({})

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(401)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Authorization token missing'))
        expect(errorText.statusCode).to.be.equal(401)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return true and message if OK', async () => {
      try {
        let author = authors[1]
        let token = generateToken(author['email'])
        let pageId = pages[0]['_id']
        let message = 'lorem ipsum'

        let response = await chai.request(server)
          .post(`/v1/spam/pages/${pageId}`)
          .set('Authorization', `Bearer ${token}`)
          .send({message})

        // console.log(JSON.stringify(response.body, null, 2))
        expect(response.body.status).to.be.true
        expect(response.body.message).to.equals('You successfully report page')
        // let spam = response.body.data
        // should.exist(response.body)
        // assert.equal(author['_id'], spam.author)
        // assert.equal(spam.message, message)
        // assert.equal(spam.pageId, pageId)

      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('report comment as spam', () => {

    it('should return error if not authorized', async () => {
      try {

        let response = await chai.request(server)
          .post('/v1/comments/123/spam')
          .set('Authorization', `Bearer `)
          .send({})

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(401)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Authorization token missing'))
        expect(errorText.statusCode).to.be.equal(401)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return error if message missing', async () => {
      try {
        let author = authors[1]
        let token = generateToken(author['email'])
        let commentId = comments[0]['_id']
        let message = ''

        let response = await chai.request(server)
          .post(`/v1/comments/${commentId}/spam`)
          .set('Authorization', `Bearer ${token}`)
          .send({message})

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(422)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Message missing!'))
        expect(errorText.statusCode).to.be.equal(422)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return status true and message if OK', async () => {
      try {
        let author = authors[1]
        let token = generateToken(author['email'])
        let commentId = comments[0]['_id']
        let message = 'lorem ipsum'

        let response = await chai.request(server)
          .post(`/v1/comments/${commentId}/spam`)
          .set('Authorization', `Bearer ${token}`)
          .send({message})

        // console.log(JSON.stringify(response.body, null, 2))
        expect(response.body.status).to.be.true
        expect(response.body.message).to.equals('You successfully report comment')
        // let spam = response.body.data
        // should.exist(response.body)
        // assert.equal(author['_id'], spam.author)
        // assert.equal(spam.message, message)
        // assert.equal(spam.commentId, commentId)

      } catch (err) {
        should.not.exist(err)
      }
    })

  })

})
