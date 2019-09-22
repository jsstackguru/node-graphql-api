/**
 * @file Author API tests
 * @author Nikola Miljkovic <mnikson@storyr.com>
 * @version 1.0
 */

// assert
import chai from 'chai'
import { assert, expect } from 'chai'
import should from 'should'
import chaiHttp from 'chai-http'
import server from '../setup/server'
// libs
import translate from '../../src/lib/translate'
// file system
import fs from 'fs'
// fixtures
import fixtures from '../fixtures'
import { generateToken } from '../../src/services/auth'
// services
import { initBefore, initAfter } from '../setup'
// fakers
import { authorFaker, pageFaker, storyFaker } from '../fixtures/faker'

const pages = fixtures.collections.pages
const authors = fixtures.collections.authors
const storys = fixtures.collections.stories

chai.use(chaiHttp)

describe('should test API for page', () => {

  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('copy page', () => {

    it('should return error if token not provided', async () => {
      try {

        let response = await chai.request(server)
          .post('/v1/pages/copy')
          .set('Authorization', 'Bearer ""')
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

    it('should return error if page id is not provided', async () => {
      try {
        let token = generateToken(authors[0]['email'])
        let story = storys[0]
        let page = storys[1]['pages'][0]
        let obj = {
          storyId: story._id,
        }

        let response = await chai.request(server)
          .post(`/v1/pages/copy`)
          .set('Authorization', `Bearer "${token}"`)
          .send(obj)

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Missing page id'))
        expect(errorText.statusCode).to.be.equal(400)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return error if story id is not provided', async () => {
      try {
        let token = generateToken(authors[0]['email'])
        let story = storys[0]
        let page = storys[1]['pages'][0]
        let obj = {
          pageId: page
        }

        let response = await chai.request(server)
          .post(`/v1/pages/copy`)
          .set('Authorization', `Bearer "${token}"`)
          .send(obj)

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Missing story id'))
        expect(errorText.statusCode).to.be.equal(400)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return copied page if everything is ok', async () => {
      try {
        let token = generateToken(authors[0]['email'])
        let story = storys[1]
        let page = storys[0]['pages'][0]
        let obj = {
          pageId: page,
          storyId: story._id
        }

        let response = await chai.request(server)
          .post(`/v1/pages/copy`)
          .set('Authorization', `Bearer "${token}"`)
          .send(obj)

        // console.log(JSON.stringify(response.body, null, 2))
        should.exist(response.body.data)
        let res = response.body.data
        expect(res).to.have.property('author')
        expect(res.author._id).equals(authors[0]._id.toString())
        expect(res).to.have.property('title').and.equals('page Copy')
      } catch (err) {
        should.not.exist(err)
      }
    })

  })

  describe('move page', () => {
    it('should return error if token not provided', async () => {
      try {

        let response = await chai.request(server)
          .post('/v1/pages/move')
          .set('Authorization', 'Bearer ""')
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

    it('should return error if page id is not provided', async () => {
      try {
        let token = generateToken(authors[0]['email'])
        let story = storys[0]
        let page = storys[1]['pages'][0]
        let obj = {
          storyId: story._id,
        }

        let response = await chai.request(server)
          .post(`/v1/pages/move`)
          .set('Authorization', `Bearer "${token}"`)
          .send(obj)

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Missing page id'))
        expect(errorText.statusCode).to.be.equal(400)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return error if story id is not provided', async () => {
      try {
        let token = generateToken(authors[0]['email'])
        let story = storys[0]
        let page = storys[1]['pages'][0]
        let obj = {
          pageId: page
        }

        let response = await chai.request(server)
          .post(`/v1/pages/move`)
          .set('Authorization', `Bearer "${token}"`)
          .send(obj)

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Missing story id'))
        expect(errorText.statusCode).to.be.equal(400)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return moved page if everything is ok', async () => {
      try {
        const token = generateToken(authors[0].email)
        const story = storys[1]
        const page = storys[0].pages[0]
        const obj = {
          pageId: page,
          storyId: story._id
        }

        let response = await chai.request(server)
          .post(`/v1/pages/move`)
          .set('Authorization', `Bearer "${token}"`)
          .send(obj)

        // console.log(JSON.stringify(response.body, null, 2))
        should.exist(response.body.data)
        const res = response.body.data
        expect(res).to.have.property('author')
        const author = res.author
        expect(author).to.have.property('_id')
        expect(author).to.have.property('name')
        expect(author).to.have.property('username')
        expect(author).to.have.property('avatar')
        expect(author).to.have.property('email')
        assert.equal(author._id, authors[0].id)
        expect(res).to.have.property('title').and.includes('Copy')
      } catch (err) {
        should.not.exist(err)
      }
    })

  })

  describe('Insert content', () => {

    it('should return error if token not provided', async () => {
      try {
        let page = pages[0]['_id']

        let response = await chai.request(server)
          .post(`/v1/pages/${page}/contents`)
          .set('Authorization', 'Bearer ""')
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

    it('should return error if type is not provided', async () => {
      try {
        let token = generateToken(authors[0]['email'])
        let page = pages[0]['_id']

        let response = await chai.request(server)
          .post(`/v1/pages/${page}/contents`)
          .set('Authorization', `Bearer "${token}"`)
          .field('content[type]', 'wrong')

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('You need correct file type'))
        expect(errorText.statusCode).to.be.equal(400)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return error if content not equal text, and no files', async () => {
      try {

        let token = generateToken(authors[0]['email'])
        let page = pages[0]['_id']

        let response = await chai.request(server)
          .post(`/v1/pages/${page}/contents`)
          .set('Authorization', `Bearer ${token}`)
          .field('content[type]', 'image')

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('You need to send a file'))
        expect(errorText.statusCode).to.be.equal(400)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should handle text', async () => {
      try {
        let token = generateToken(authors[0]['email'])
        let page = pages[0]
        let pageId = page._id
        let story = fixtures.collections.stories[0]

        let response = await chai.request(server)
          .post(`/v1/pages/${pageId}/contents`)
          .set('Authorization', `Bearer ${token}`)
          .field('storyId', story._id)
          .field('content[type]', 'text')
          .field('content[text]', 'lorem ipsum')

        // console.log(JSON.stringify(response.body, null, 2))
        should.exist(response)
        let res = response.body.data
        assert.equal(res._id, pageId)
        expect(res).to.have.property('slug').and.equal(page.slug)
        expect(res).to.have.property('title').and.equal(page.title)
        expect(res).to.have.property('author')
        const author = res.author
        expect(author).to.have.property('_id')
        expect(author).to.have.property('name')
        expect(author).to.have.property('username')
        expect(author).to.have.property('avatar')
        expect(author).to.have.property('email')
        assert.equal(author._id, page.author)
        let content = res.content[2]
        expect(res.content).to.be.an('array')
        assert.equal(content.type, 'text')
        assert.equal(content.text, 'lorem ipsum')

      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should handle text, insert on second place', async () => {
      try {
        let token = generateToken(authors[0]['email'])
        let page = pages[0]
        let pageId = page._id
        let story = fixtures.collections.stories[0]

        let response = await chai.request(server)
          .post(`/v1/pages/${pageId}/contents`)
          .set('Authorization', `Bearer ${token}`)
          .field('storyId', story._id)
          .field('order', 1)
          .field('content[type]', 'text')
          .field('content[text]', 'lorem ipsum')

        should.exist(response)
        let res = response.body.data
        assert.equal(res._id, pageId)
        expect(res).to.have.property('slug').and.equal(page.slug)
        expect(res).to.have.property('title').and.equal(page.title)
        expect(res).to.have.property('author')
        const author = res.author
        expect(author).to.have.property('_id')
        expect(author).to.have.property('name')
        expect(author).to.have.property('username')
        expect(author).to.have.property('avatar')
        expect(author).to.have.property('email')
        assert.equal(author._id, page.author)
        let content = res.content[1]
        expect(res.content).to.be.an('array')
        assert.equal(content.type, 'text')
        assert.equal(content.text, 'lorem ipsum')

      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

  })

  describe('Update page', () => {

    it('should return error if token not provided', async () => {
      try {
        let page = pages[0]['_id']

        let response = await chai.request(server)
          .put(`/v1/pages/`)
          .set('Authorization', 'Bearer ""')
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

    it('should return error if pageId is not provided', async () => {
      try {
        let token = generateToken(authors[0]['email'])
        let page = pages[0]['_id']
        let obj = {}

        let response = await chai.request(server)
          .put(`/v1/pages`)
          .set('Authorization', `Bearer "${token}"`)
          .send(obj)

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Missing page ID'))
        expect(errorText.statusCode).to.be.equal(400)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should update page', async () => {
      try {
        const token = generateToken(authors[0]['email'])
        const story = storys[0]
        const page = story.pages[0]
        const obj = {
          pageId: page,
          title: 'updated title',
          matchId: '234'
        }

        const response = await chai.request(server)
          .put(`/v1/pages`)
          .set('Authorization', `Bearer ${token}`)
          .send(obj)

        // console.log(JSON.stringify(response.body, null, 2))
        should.exist(response)
        const res = response.body.data

        expect(res).to.have.property('title').and.equal(obj.title)
        expect(res).to.have.property('matchId').and.equal(obj.matchId)
        expect(res).to.have.property('author')
        expect(res.author).to.have.property('_id').and.equal(story.author)
        expect(res.author).to.have.property('name')
        expect(res.author).to.have.property('username')
        expect(res.author).to.have.property('avatar')
        expect(res.author).to.have.property('email')
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

  })

  describe('Create new Page', () => {

    let author
    let story
    let pages
    let wrongStory

    beforeEach(async () => {
      await initAfter()
      author = await authorFaker({
        single: true
      })
      pages = await pageFaker({
        n: 3,
        author: author._id
      })
      story = await storyFaker({
        single: true,
        pages: pages.map(page => page._id),
        author: author._id
      })
      wrongStory = await storyFaker({
        single: true,
        pages: pages.map(page => page._id)
      })
    })

    after(async () => {
      await initAfter()
    })

    it('should not create new page, auth token missing', async () => {
      try {
        let response = await chai.request(server)
          .post(`/v1/pages`)
          .set('Authorization', 'Bearer ""')
          .send({})

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(401)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Authorization token missing'))
        expect(errorText.statusCode).to.be.equal(401)
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should not create new page, story id missing', async () => {
      try {
        let token = generateToken(author.email)
        
        let response = await chai.request(server)
          .post(`/v1/pages`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            storyId: null
          })

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Missing Story ID'))
        expect(errorText.statusCode).to.be.equal(400)
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should not create new page, content is empty', async () => {
      try {
        let token = generateToken(author.email)
        
        let response = await chai.request(server)
          .post(`/v1/pages`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            storyId: String(story._id),
            title: 'new page',
            contents: []
          })

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Story page must have at least one element'))
        expect(errorText.statusCode).to.be.equal(400)
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should not create new page, author have no access permission', async () => {
      try {
        let token = generateToken(author.email)
        let response = await chai.request(server)
          .post(`/v1/pages`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            storyId: String(wrongStory._id),
            title: 'new page',
            content: [
              {
                type: 'text',
                text: 'this is the text element',
                matchId: '1234'
              }
            ]
          })

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(401)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('You don\'t have permission for this Story'))
        expect(errorText.statusCode).to.be.equal(401)
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should create new page', async () => {
      try {
        let token = generateToken(author.email)
        
        let response = await chai.request(server)
          .post(`/v1/pages`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            storyId: String(story._id),
            title: 'new page',
            content: [
              {
                type: 'text',
                text: 'this is the text element',
                matchId: '1234'
              }
            ]
          })
        // console.log(JSON.stringify(response.body, null, 2))
        should.exist(response.body)
        let result = response.body
        should(result).be.type('object')
        should(result).have.property('_id')
        should(result).have.property('title')
        assert.equal(result.title, 'new page')
        should(result).have.property('content')
        assert.equal(result.content.length, 1)
        should(result).have.property('status')
        assert.equal(result.status, story.status)
        should(result).have.property('author')
        const pageAuthor = result.author
        pageAuthor.should.be.type('object')
        should(pageAuthor).have.property('_id')
        should(pageAuthor).have.property('name')
        should(pageAuthor).have.property('username')
        should(pageAuthor).have.property('avatar')
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should create new page with image content element', async () => {
      try {
        let token = generateToken(author.email)
        
        let response = await chai.request(server)
          .post(`/v1/pages`)
          .set('Authorization', `Bearer ${token}`)
          .field('storyId', String(story._id))
          .field('title', 'new page')
          .field('content[0][type]', 'image')
          .field('content[0][caption]', 'Test image caption')
          .attach('content[0][image]', fs.readFileSync(`${__dirname}/../media/test_image.jpg`), 'image_element.jpg')

        should.exist(response.body)
        let result = response.body
        
        should(result).be.type('object')
        should(result).have.property('_id')
        should(result).have.property('title')
        assert.equal(result.title, 'new page')
        should(result).have.property('content')
        assert.equal(result.content.length, 1)
        should(result).have.property('status')
        assert.equal(result.status, story.status)
        assert.equal(result.content.length, 1)
        const content = result.content[0]
        should(content).have.property('type')
        assert.equal(content.type, 'image')
        should(content).have.property('image')
        assert.notEqual(content.image, null)
        should(content).have.property('contentId')
        assert.notEqual(content.contentId, null)
        should(content).have.property('size')
        assert.isAbove(content.size, 0)
        should(content).have.property('caption')
        assert.equal(content.caption, 'Test image caption')
      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
        throw err
      }
    })

    it('should create new page with audio content element', async () => {
      try {
        let token = generateToken(author.email)
        
        let response = await chai.request(server)
          .post(`/v1/pages`)
          .set('Authorization', `Bearer ${token}`)
          .field('storyId', String(story._id))
          .field('title', 'new page')
          .field('content[0][type]', 'audio')
          .field('content[0][caption]', 'Test audio caption')
          .attach('content[0][audio]', fs.readFileSync(`${__dirname}/../media/test_audio.mp3`), 'audio_element.mp3')

        should.exist(response.body)
        let result = response.body
        
        should(result).be.type('object')
        should(result).have.property('_id')
        should(result).have.property('title')
        assert.equal(result.title, 'new page')
        should(result).have.property('content')
        assert.equal(result.content.length, 1)
        should(result).have.property('status')
        assert.equal(result.status, story.status)
        assert.equal(result.content.length, 1)
        const content = result.content[0]
        should(content).have.property('type')
        assert.equal(content.type, 'audio')
        should(content).have.property('url')
        assert.notEqual(content.url, null)
        should(content).have.property('contentId')
        assert.notEqual(content.contentId, null)
        should(content).have.property('size')
        assert.isAbove(content.size, 0)
        should(content).have.property('caption')
        assert.equal(content.caption, 'Test audio caption')
      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
        throw err
      }
    })

    it('should create new page and be listed in the story', async () => {
      try {
        let token = generateToken(author.email)
        
        let response = await chai.request(server)
          .post(`/v1/pages`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            storyId: String(story._id),
            title: 'new page',
            content: [
              {
                type: 'text',
                text: 'this is the text element',
                matchId: '1234'
              }
            ]
          })
        // console.log(JSON.stringify(response.body, null, 2))
        should.exist(response.body)
        let result = response.body
        should(result).be.type('object')
        should(result).have.property('_id')
        should(result).have.property('title')
        assert.equal(result.title, 'new page')
        should(result).have.property('content')
        assert.equal(result.content.length, 1)
        should(result).have.property('status')
        assert.equal(result.status, story.status)
        should(result).have.property('author')
        const pageAuthor = result.author
        pageAuthor.should.be.type('object')
        should(pageAuthor).have.property('_id')
        should(pageAuthor).have.property('name')
        should(pageAuthor).have.property('username')
        should(pageAuthor).have.property('avatar')
        const newPage = result

        response = await chai.request(server)
          .get(`/v1/stories/${story._id}`)
          .set('Authorization', `Bearer ${token}`)
        // console.log(JSON.stringify(response.body, null, 2))
        should.exist(response.body)
        result = response.body
        should(result).be.type('object')
        should(result).have.property('data')
        const { data } = result
        assert.equal(data.pages.length, 4)
        assert.equal(data.pages[3]._id, newPage._id)
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

  })

  describe('Remove content from page', () => {

    before(async () => {
      await initAfter()
      await initBefore()
    })

    after(async () => {
      await initAfter()
    })

    it('should return error, authorization missing', async () => {
      try {
        let response = await chai.request(server)
          .put(`/v1/pages/123/contents`)
          .set('Authorization', 'Bearer ""')
          .send({})

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(401)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Authorization token missing'))
        expect(errorText.statusCode).to.be.equal(401)
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should return error, missing parameters', async () => {
      try {
        let author = authors[0]
        let token = generateToken(author.email)
        let response = await chai.request(server)
          .put(`/v1/pages/123/contents`)
          .set('Authorization', `Bearer ${token}`)
          .send({})

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Bad parameters'))
        expect(errorText.statusCode).to.be.equal(400)
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should return error if not content', async () => {
      try {
        let author = authors[0]
        let token = generateToken(author.email)
        let content = {contentId: ''}
        let response = await chai.request(server)
          .put(`/v1/pages/123/contents`)
          .set('Authorization', `Bearer ${token}`)
          .send({content})

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Bad parameters'))
        expect(errorText.statusCode).to.be.equal(400)
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should return error if bad pageId', async () => {
      try {
        let author = authors[0]
        let page = pages[0]
        let pageId = page['_id']
        let contentId = page.content[0].contentId
        let token = generateToken(author.email)
        let content = {contentId}

        let response = await chai.request(server)
          .put(`/v1/pages/123/contents`)
          .set('Authorization', `Bearer ${token}`)
          .send({content})

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Bad parameters'))
        expect(errorText.statusCode).to.be.equal(400)
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should return valid response if everything\'s fine', async () => {
      try {
        let author = authors[1]
        let page = pages[7]
        let pageId = page['_id']
        let contentId = page.content[0].contentId
        let token = generateToken(author.email)
        let content = {contentId: contentId}

        let response = await chai.request(server)
          .put(`/v1/pages/${pageId}/contents`)
          .set('Authorization', `Bearer ${token}`)
          .send(content)

        // console.log(JSON.stringify(response.body, null, 2))
        should.exist(response.body)
        let res = response.body.data
        expect(response.status).to.equals(200)
        expect(res).to.have.property('_id')
        expect(res).to.have.property('title')
        expect(res).to.have.property('content')
        expect(res.content).to.be.an('array').and.have.lengthOf(1)
        expect(res).to.have.property('author')
        expect(res.author).to.have.property('_id')
        expect(res.author).to.have.property('name')
        expect(res.author).to.have.property('username')
        expect(res.author).to.have.property('avatar')
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

  })

  describe('Delete page', () => {
    let authors
    let story
    let page

    before(async () => {
      await initAfter()
      authors = await authorFaker({
        n: 2
      })
      const storyAuthor = authors[0]
      page = await pageFaker({
        single: true,
        author: storyAuthor._id
      })
      story = await storyFaker({
        single: true,
        author: storyAuthor._id,
        pages: [ page._id ]
      })
    })

    after(async () => {
      await initAfter()
    })

    it('should return error, authorization missing', async () => {
      try {
        let response = await chai.request(server)
          .post('/v1/pages/1234/delete')
          .set('Authorization', 'Bearer ""')
          .send({
            storyId: story._id,
            id: page._id
          })

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(401)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Authorization token missing'))
        expect(errorText.statusCode).to.be.equal(401)
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should return error if user is not page author', async () => {
      try {
        let author = authors[1]
        let token = generateToken(author.email)
        let response = await chai.request(server)
          .post(`/v1/pages/${page._id}/delete`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            storyId: story._id
          })

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(422)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('You don\'t have permission for this action'))
        expect(errorText.statusCode).to.be.equal(422)
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should return valid response if everything\'s fine', async () => {
      try {
        let author = authors[0]
        let pageId = page._id
        let token = generateToken(author.email)

        let response = await chai.request(server)
          .post(`/v1/pages/${pageId}/delete`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            storyId: story._id
          })

        // console.log(JSON.stringify(response.body, null, 2))
        should.exist(response.body)
        // expect(response.body.status).to.equals(true)
        expect(response.body.message).to.equals('You successfully deleted page')
        let res = response.body.data
        expect(response.status).to.equals(200)
        assert.equal(res, pageId)
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

  })
})


/*************************************************/
/******************** | GET | ********************/
/*************************************************/

describe('should test API for pages, GET methods', () => {
  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  // expected keys, need to match actual keys from response
  const keys = {
    author: ['_id', 'name', 'username', 'avatar', 'email'],
    page: ['_id', 'title', 'slug', 'matchId', 'created', 'updated', 'theme', 'place', 'author', 'content'],
    pageTheme: ['cover'],
    pagePlace: ['lat', 'lon', 'name'],
    story: ['_id', 'title', 'slug', 'created', 'updated', 'author', 'pages', 'share', 'collaborators'],
    storyShare: ['followers', 'link', 'search'],
    collaborators: ['edit', 'author']
  }

  describe('Page by ID', () => {

    let author = fixtures.collections.authors[0]
    let token = generateToken(author.email)

    it('it should return error if not authorized ', async () => {
      let author = fixtures.collections.authors[3]
      try {
        let response = await chai.request(server)
          .get(`/v1/pages/${author.id}`)
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
        const id = pages[1]._id
        const response = await chai.request(server)
          .get(`/v1/pages/${id}`)
          .set('Authorization', `Bearer ${token}`)

        // console.log(JSON.stringify(response.body, null, 2))
        expect(response.body).to.exist
        expect(response.status).to.equal(200)
        const page = response.body.data

        const authorKeys = Object.keys(page.author)
        expect(authorKeys.sort()).to.deep.equal(keys.author.sort())
        const pageKeys = Object.keys(page)
        expect(pageKeys.sort()).to.deep.equal(keys.page.sort())
        const pageThemeKeys = Object.keys(page.theme)
        expect(pageThemeKeys).to.deep.equal(keys.pageTheme).and.exist
        const pagePlaceKeys = Object.keys(page.place)
        expect(pagePlaceKeys).to.deep.equal(keys.pagePlace).and.exist

      } catch (err) {
        console.log(err.stack)
        expect(err).to.not.exist
      }
    })

  })
})
