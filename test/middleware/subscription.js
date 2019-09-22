/**
 * @file Tests for plan middleware
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import chai from 'chai'
import { expect } from 'chai'
import should from 'should'
import chaiHttp from 'chai-http'

// Libs
import translate from '../../src/lib/translate'

// Services
import { generateToken } from '../../src/services/auth'
import { initBefore, initAfter, server } from "../setup"
// import server from '../setup/server'

// Fixtures
import fixtures from '../fixtures'

const authors = fixtures.collections.authors
const pages = fixtures.collections.pages
const stories = fixtures.collections.stories

chai.use(chaiHttp)

describe('Plan middleware tests', () => {
  
  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('tests for the stories', () => {
    it('should disallow author to create story', async () => {
      try {
        const author = authors[2]
        const token = generateToken(author.email)
  
        const response = await chai.request(server)
          .post('/v1/stories')
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: 'new journal'
          })
  
        should.exist(response.error)
        const error = response.error
        expect(error.status).to.be.equal(422)
        const errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('You are overrun plan storage'))
        expect(errorText.statusCode).to.be.equal(422)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should disallow author to update story', async () => {
      try {
        const author = authors[2]
        const token = generateToken(author.email)
  
        const response = await chai.request(server)
          .put('/v1/stories')
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: 'updated journal'
          })
  
        should.exist(response.error)
        const error = response.error
        expect(error.status).to.be.equal(422)
        const errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('You are overrun plan storage'))
        expect(errorText.statusCode).to.be.equal(422)
      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('tests for the pages', () => {
    it('should disallow author to create page', async () => {
      try {
        const author = authors[2]
        const token = generateToken(author.email)
  
        const response = await chai.request(server)
          .post('/v1/pages')
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: 'new page'
          })
  
        should.exist(response.error)
        const error = response.error
        expect(error.status).to.be.equal(422)
        const errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('You are overrun plan storage'))
        expect(errorText.statusCode).to.be.equal(422)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should disallow author to update page', async () => {
      try {
        const author = authors[2]
        const token = generateToken(author.email)
  
        const response = await chai.request(server)
          .put('/v1/pages')
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: 'updated page'
          })
  
        should.exist(response.error)
        const error = response.error
        expect(error.status).to.be.equal(422)
        const errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('You are overrun plan storage'))
        expect(errorText.statusCode).to.be.equal(422)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should disallow author to copy page', async () => {
      try {
        const author = authors[2]
        const page = pages[2]
        const story = stories[1]
        const token = generateToken(author.email)
  
        const response = await chai.request(server)
          .put('/v1/pages')
          .set('Authorization', `Bearer ${token}`)
          .send({
            pageId: page.id,
            storyId: story.id
          })
  
        should.exist(response.error)
        const error = response.error
        expect(error.status).to.be.equal(422)
        const errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('You are overrun plan storage'))
        expect(errorText.statusCode).to.be.equal(422)
      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('tests for the content', () => {
    it('should disallow author to add contents on page', async () => {
      try {
        const author = authors[2]
        const page = pages[2]
        const token = generateToken(author.email)

        const response = await chai.request(server)
          .post(`/v1/pages/${page.id}/contents`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            pageId: page.id,
          })
  
        should.exist(response.error)
        const error = response.error
        expect(error.status).to.be.equal(422)
        const errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('You are overrun plan storage'))
        expect(errorText.statusCode).to.be.equal(422)
      } catch (err) {
        should.not.exist(err)
      }
    })
  })

})
