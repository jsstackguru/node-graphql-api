/**
 * @file Following API tests
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import chai from 'chai'
import { assert, expect } from 'chai'
import should from 'should'
import fixtures from '../fixtures'
import chaiHttp from 'chai-http'
import server from '../setup/server'
// Libraries
import translate from '../../src/lib/translate'
// Services
import { generateToken } from '../../src/services/auth'
import { initAfter, initBefore } from '../setup'

chai.use(chaiHttp)

describe('should test API for following', () => {

  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe("follow", () => {

    it('should not follow author, authorization token is missing', async () => {
      try {
        let response = await chai.request(server)
          .post('/v1/authors/follow')
          .set('Authorization', '')
          .send({
            user_id: ''
          })

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(401)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Authorization token missing'))
        expect(errorText.statusCode).to.be.equal(401)

      } catch (err) {
        console.log('err', err)
        should.not.exist(err)
        throw err
      }
    })

    it('should not follow author, author id missing', async () => {
      try {
        let author = fixtures.collections.authors[0]
        let token = generateToken(author.email)

        let response = await chai.request(server)
          .post('/v1/authors/follow')
          .set('Authorization', `Bearer ${token}`)
          .send({
            user_id: ''
          })

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(422)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Missing author id'))
        expect(errorText.statusCode).to.be.equal(422)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should not follow author, author and follow are the same', async () => {
      try {
        let author = fixtures.collections.authors[0]
        let token = generateToken(author.email)

        let response = await chai.request(server)
          .post('/v1/authors/follow')
          .set('Authorization', `Bearer ${token}`)
          .send({
            authorId: author.id
          })

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(422)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('You can\'t follow yourself'))
        expect(errorText.statusCode).to.be.equal(422)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should not follow author, already following', async () => {
      try {
        let author = fixtures.collections.authors[0]
        let follows = fixtures.collections.authors[1]
        let token = generateToken(author.email)

        let response = await chai.request(server)
          .post('/v1/authors/follow')
          .set('Authorization', `Bearer ${token}`)
          .send({
            authorId: follows.id
          })

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(422)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('User is following this author already'))
        expect(errorText.statusCode).to.be.equal(422)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should follow author', async () => {
      try {
        let author = fixtures.collections.authors[0]
        let follows = fixtures.collections.authors[2]
        let token = generateToken(author.email)
        let response = await chai.request(server)
          .post('/v1/authors/follow')
          .set('Authorization', `Bearer ${token}`)
          .send({
            authorId: follows._id
          })

        // console.log(JSON.stringify(response.body, null, 2))
        let res = response.body
        // expect(res).to.have.property('status').and.true
        expect(res).to.have.property('message').and.equals(translate.__('You successfully followed author'))
        expect(res).to.have.property('data')
        let data = res.data
        expect(data).to.have.property('_id')
        expect(data.name).to.equals(follows.name)
        expect(data.username).to.equals(follows.username)
        expect(data.email).to.equals(follows.email)
      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe("unfollow", () => {

    it('should not unfollow author, authorization token is missing', async () => {
      try {
        let response = await chai.request(server)
          .post('/v1/authors/unfollow')
          .set('Authorization', 'Bearer ')
          .send({
            user_id: ''
          })

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

    it('should not follow author, author id missing', async () => {
      try {
        let author = fixtures.collections.authors[0]
        let token = generateToken(author.email)
        let response = await chai.request(server)
          .post('/v1/authors/unfollow')
          .set('Authorization', `Bearer ${token}`)
          .send({
            user_id: ''
          })

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(422)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Missing author id'))
        expect(errorText.statusCode).to.be.equal(422)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should throw err, user dont unfollow author', async () => {
      try {
        let author = fixtures.collections.authors[0]
        let follows = fixtures.collections.authors[3]
        let token = generateToken(author.email)
        let response = await chai.request(server)
          .post('/v1/authors/unfollow')
          .set('Authorization', `Bearer ${token}`)
          .send({
            authorId: follows
          })

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(422)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('User don\'t follow this author'))
        expect(errorText.statusCode).to.be.equal(422)
      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('should unfollow author', async () => {
      try {
        let author = fixtures.collections.authors[0]
        let follows = fixtures.collections.authors[1]
        let token = generateToken(author.email)
        let response = await chai.request(server)
          .post('/v1/authors/unfollow')
          .set('Authorization', `Bearer ${token}`)
          .send({
            authorId: follows._id
          })

        // console.log(JSON.stringify(response.body, null, 2))
        let res = response.body
        // expect(res).to.have.property('status').and.true
        expect(res).to.have.property('message').and.equals(translate.__('You successfully unfollowed author'))
        expect(res).to.have.property('data')
        let data = res.data
        expect(data).to.have.property('_id')
        expect(data.name).to.equals(follows.name)
        expect(data.username).to.equals(follows.username)
        expect(data.email).to.equals(follows.email)

      } catch (err) {
        expect(err).to.not.exist
      }
    })

  })

})
