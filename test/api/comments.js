
//  assert
import chai from 'chai'
import { assert, expect } from 'chai'
import should from 'should'
import chaiHttp from 'chai-http'
import server from '../setup/server'
// libs
import translate from '../../src/lib/translate'
// fistures
import fixtures from '../fixtures'
// services
import { generateToken } from '../../src/services/auth'
import { initAfter, initBefore } from '../setup'
// test keys
import { gqlKeys } from '../../src/routes/graphQueriesVars'

// Fakers
import {
  authorFaker,
  storyFaker,
  commentFaker
} from '../fixtures/faker'

const authors = fixtures.collections.authors
const pages = fixtures.collections.pages
const comments = fixtures.collections.comments

chai.use(chaiHttp)

describe('should test API for comments...', () => {
  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('create new comment', () => {

    it('should return error if not authorized', async () => {
      try {

        let response = await chai.request(server)
          .post('/v1/comments')
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

    it('should return error if missing page parameter', async () => {
      try {
        let author = authors[0]
        let token = generateToken(author['email'])

        let response = await chai.request(server)
          .post('/v1/comments')
          .set('Authorization', `Bearer ${token}`)
          .send({
            page: '',
            comment: ''
          })

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('You are missing page parameter'))
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return error if missing comment parameter', async () => {
      try {
        let author = authors[0]
        // let page = pages[0]
        let pageId = 'fakeId'
        let token = generateToken(author['email'])

        let response = await chai.request(server)
          .post('/v1/comments')
          .set('Authorization', `Bearer ${token}`)
          .send({
            pageId: pageId,
            comment: ''
          })

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('You are missing comment parameter'))
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return mongoose error if missing comment parameter', async () => {
      try {
        let author = authors[0]
        let pageId = pages[0]['_id']
        let token = generateToken(author['email'])

        let response = await chai.request(server)
          .post('/v1/comments')
          .set('Authorization', `Bearer ${token}`)
          .send({
            pageId,
            comment: ' '
          })

        should.exist(response.error)
        let error = response.error
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.include(translate.__('Comment must contain some letters'))

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return comment if everything is fine', async () => {
      try {
        let author = authors[0]
        let page = pages[0]
        let pageId = page._id
        let token = generateToken(author['email'])

        let payload = {
          pageId,
          comment: 'hej'
        }

        let response = await chai.request(server)
          .post('/v1/comments')
          .set('Authorization', `Bearer ${token}`)
          .send(payload)

        // console.log(JSON.stringify(response.body, null, 2))
        expect(response.body).to.exist.and.be.an('object')
        const { data } = response.body
        should(data).have.property('_id')
        expect(data).to.have.property('author')
        should(data.author).have.property('_id')
        should(data.author).have.property('name')
        should(data.author).have.property('username')
        should(data.author).have.property('email')
        should(data.author).have.property('avatar')
        expect(data).to.have.property('text').and.equals(payload.comment)
        expect(data).to.have.property('page').and.equals(payload.pageId)
        expect(data).to.have.property('reply').and.be.null

      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('create new comment reply', () => {

    it('should return error if not authorized', async () => {
      try {

        let response = await chai.request(server)
          .post('/v1/comments/1234/reply')
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

    it('should return error if missing comment parameter', async () => {
      try {
        let author = authors[0]
        let token = generateToken(author['email'])

        let response = await chai.request(server)
          .post(`/v1/comments/${'123'}/reply`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            comment: ''
          })

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('You are missing comment parameter'))
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return mongoose error if comment empty', async () => {
      try {
        let author = authors[0]
        let token = generateToken(author['email'])
        let commentId = comments[0]['_id']
        let response = await chai.request(server)
          .post(`/v1/comments/${commentId}/reply`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            comment: ' '
          })
        // console.log(JSON.stringify(response.body, "", 2))
        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.include(translate.__('Comment must contain some letters'))

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return comment reply if everything is fine', async () => {
      try {
        let author = authors[0]
        let commentId = comments[0]._id
        let token = generateToken(author['email'])

        let payload = {
          comment: 'reply to a comment'
        }

        let response = await chai.request(server)
          .post(`/v1/comments/${commentId}/reply`)
          .set('Authorization', `Bearer ${token}`)
          .send(payload)

        // console.log(JSON.stringify(response.body, null, 2))
        expect(response.body).to.exist.and.be.an('object')
        expect(response.body.data).to.have.property('author')
        const { data } = response.body
        should(data.author).have.property('_id')
        should(data.author).have.property('name')
        should(data.author).have.property('username')
        should(data.author).have.property('email')
        should(data.author).have.property('avatar')
        expect(data).to.have.property('text').and.equals(payload.comment)
        expect(data).to.have.property('reply').have.property('_id')
        const reply = data.reply
        assert.equal(reply._id, commentId)
        expect(data).to.have.property('reply').have.property('author')
        expect(data).to.have.property('author').have.property('_id')

      } catch (err) {
        should.not.exist(err)
      }
    })

  })

  describe('delete comment', () => {
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
        author: fakeAuthors[1].id,
        story: fakeStory.id
      })
    })

    after(async () => {
      await initAfter()
    })

    it('should return error if not authorized', async () => {
      try {
        let response = await chai.request(server)
          .delete('/v1/comments/1234')
          .set('Authorization', `Bearer `)

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

    it('should return error if not the author', async () => {
      try {
        const author = fakeAuthors[0]
        const comment = fakeComments[0]
        let token = generateToken(author.email)
        let response = await chai.request(server)
          .delete(`/v1/comments/${comment.id}`)
          .set('Authorization', `Bearer ${token}`)

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(403)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('You don\'t have a permission to delete this comment'))
        expect(errorText.statusCode).to.be.equal(403)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should delete comment', async () => {
      try {
        const author = fakeAuthors[0]
        const story = fakeStory
        const comment = await commentFaker({
          author: author._id,
          story: story._id,
          single: true
        })
        let token = generateToken(author.email)
        let response = await chai.request(server)
          .delete(`/v1/comments/${comment.id}`)
          .set('Authorization', `Bearer ${token}`)

        // console.log(JSON.stringify(response.body, null, 2))
        const { body } = response
        should(body).have.property('status')
        assert.deepEqual(body.status, true)
        should(body).have.property('data')
        assert.deepEqual(body.data._id, comment.id)
      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('edit comment', () => {
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

    it('should return error if not authorized', async () => {
      try {
        const response = await chai.request(server)
          .put('/v1/comments/1234')
          .set('Authorization', `Bearer `)
          .send({
            comment: null
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

    it('should return error, comment text is missing', async () => {
      try {
        const author = fakeAuthors[0]
        const token = generateToken(author.email)
        const commentId = fakeComment.id
        const response = await chai.request(server)
          .put(`/v1/comments/${commentId}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            comment: null
          })

        should.exist(response.error)
        const error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Comment text is required'))
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return error, user is not the comment author', async () => {
      try {
        const author = fakeAuthors[1]
        const token = generateToken(author.email)
        const commentId = fakeComment.id
        const comment = 'This is the new comment'
        const response = await chai.request(server)
          .put(`/v1/comments/${commentId}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            comment: comment
          })

        should.exist(response.error)
        const error = response.error
        expect(error.status).to.be.equal(403)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('You are not the author of the comment'))
        expect(errorText.statusCode).to.be.equal(403)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should edit comment', async () => {
      try {
        const author = fakeAuthors[0]
        const token = generateToken(author.email)
        const commentId = fakeComment.id
        const text = 'This is the new comment'
        const response = await chai.request(server)
          .put(`/v1/comments/${commentId}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            comment: text
          })

        // console.log(JSON.stringify(response.body, null, 2))
        const { body } = response
        should(body).have.property('data')
        const data = body.data
        assert.deepEqual(data._id, commentId)
        assert.deepEqual(data.text, text)
        should(data.author).have.property('_id')
        should(data.author).have.property('name')
        should(data.author).have.property('username')
        should(data.author).have.property('email')
      } catch (err) {
        should.not.exist(err)
      }
    })
  })
})

/*************************************************/
/******************** | GET | ********************/
/*************************************************/

describe('should test API for comments, GET methods', () => {
  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('comments by pageId', () => {

    let author = fixtures.collections.authors[0]
    let token = generateToken(author.email)

    it('it should return error if not authorized ', async () => {
      let author = fixtures.collections.authors[3]
      try {
        let response = await chai.request(server)
          .get(`/v1/pages/${author.id}/comments`)
          .set('Authorization', ``)

        expect(response.error).to.exist
        let error = response.error
        expect(error.status).to.be.equal(401)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Authorization token missing'))
        expect(errorText.statusCode).to.be.equal(401)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('it should return proper response with various query strings options', async () => {
      try {
        let page = 2
        let limit = 1
        let sort = 'text:asc'
        let id = pages[0]['_id']

        const endpoints = [
          `/v1/pages/${id}/comments`,
          `/v1/pages/${id}/comments?sort=${sort}&limit=${limit}&page=${page}`,
          `/v1/pages/${id}/comments?sort=${'fake'}&limita=${limit}&page=${page}`,
        ]

        /*  test multiple endpoints */

        for (let endpoint of endpoints) {

          const response = await chai.request(server)
            .get(endpoint)
            .set('Authorization', `Bearer ${token}`)

          // console.log(JSON.stringify(response.body, null, 2))
          expect(response.body).to.exist
          expect(response.status).to.equal(200)
          const data = response.body.data

          // test pagination props
          const paginationProps = ['limit', 'page', 'total', 'docs', 'pages']
          paginationProps.forEach(prop => {
            expect(data).to.have.property(prop)
          })

          const docs = data.docs
          docs.forEach(comment => {
            // test keys for first level - comment
            let commentKeys = Object.keys(comment).sort()
            let expCommentKeys = gqlKeys.comments.details.sort()
            expect(commentKeys).to.deep.equal(expCommentKeys)

            // test second level - author
            let authorKeys = Object.keys(comment.author).sort()
            let expAuthorKeys = gqlKeys.author.root.sort()
            expect(authorKeys).to.deep.equal(expAuthorKeys)
          })
        }
      } catch (err) {
        console.log('err', err.stack)
        expect(err).to.not.exist
      }
    })

  })

  describe('replies by comment', () => {

    let author = fixtures.collections.authors[0]
    let token = generateToken(author.email)

    it('it should return error if not authorized ', async () => {
      let author = fixtures.collections.authors[3]
      try {
        let response = await chai.request(server)
          .get(`/v1/comments/${author.id}/replies`)
          .set('Authorization', ``)

        expect(response.error).to.exist
        let error = response.error
        expect(error.status).to.be.equal(401)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Authorization token missing'))
        expect(errorText.statusCode).to.be.equal(401)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('it should return proper response with various query strings options', async () => {
      try {
        let page = 2
        let limit = 1
        let sort = 'text:asc'
        let id = comments[0]['_id']

        const endpoints = [
          `/v1/comments/${id}/replies`,
          `/v1/comments/${id}/replies?sort=${sort}&limit=${limit}&page=${page}`,
          `/v1/comments/${id}/replies?sort=${'fake'}&limita=${limit}&page=${page}`,
        ]

        /*  test multiple endpoints */

        for (let endpoint of endpoints) {

          let response = await chai.request(server)
            .get(endpoint)
            .set('Authorization', `Bearer ${token}`)

          // console.log(JSON.stringify(response.body, null, 2))
          expect(response.body).to.exist
          expect(response.status).to.equal(200)
          let data = response.body.data

          // test pagination props
          let paginationProps = ['limit', 'page', 'total', 'docs', 'pages']
          paginationProps.forEach(prop => {
            expect(data).to.have.property(prop)
          })

          let docs = data.docs
          docs.forEach(comment => {
            // test keys for first level - comment
            let commentKeys = Object.keys(comment).sort()
            let expCommentKeys = gqlKeys.comments.root.sort()
            expect(commentKeys).to.deep.equal(expCommentKeys)

            // test second level - author
            let authorKeys = Object.keys(comment.author).sort()
            let expAuthorKeys = gqlKeys.author.root.sort()
            expect(authorKeys).to.deep.equal(expAuthorKeys)

          })
        }
      } catch (err) {
        console.log(err.stack)
        expect(err).to.not.exist
      }
    })
  })

})
