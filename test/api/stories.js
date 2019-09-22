/**
 * @file Story API tests
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import chai from 'chai'
import { assert, expect } from 'chai'
import should from 'should'
import fixtures from '../fixtures'
import chaiHttp from 'chai-http'
import fs from 'fs'
import server from '../setup/server'
import { ObjectId } from 'mongodb'

// gqlKeys
import { gqlKeys } from '../../src/routes/graphQueriesVars'

// Libraries
import translate from '../../src/lib/translate'

// Services
import { generateToken } from '../../src/services/auth'
import { initAfter, initBefore } from '../setup'

// Fakers
import {
  authorFaker,
  collaborationInviteFaker,
  storyFaker,
  favoriteFaker,
  pageFaker
} from '../fixtures/faker';
import { Story } from '../../src/models/story';

chai.use(chaiHttp)

//  Fixtures
const authors = fixtures.collections.authors
const stories = fixtures.collections.stories


describe('should test API for stories', () => {
  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('create story tests', () => {

    it('should not create story, authorization token is missing', async () => {
      try {
        let response = await chai.request(server)
          .post('/v1/stories')
          .set('Authorization', '')
          .send({})

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

    it('should not create story, title missing', async () => {
      try {
        let author = authors[0]
        let token = generateToken(author.email)

        let response = await chai.request(server)
          .post('/v1/stories')
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: ''
          })

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Title missing'))
        expect(errorText.statusCode).to.be.equal(400)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should not create story, privacy type missing', async () => {
      try {
        let author = authors[0]
        let token = generateToken(author.email)

        let response = await chai.request(server)
          .post('/v1/stories')
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: 'New title'
          })

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Privacy type missing'))
        expect(errorText.statusCode).to.be.equal(400)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should not create story, page missing', async () => {
      try {
        let author = authors[0]
        let token = generateToken(author.email)

        let response = await chai.request(server)
          .post('/v1/stories')
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: 'New title',
            privacyType: 'private',
          })

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Story must have at least one page'))
        expect(errorText.statusCode).to.be.equal(400)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should not create story, page element missing', async () => {
      try {
        let author = authors[0]
        let token = generateToken(author.email)

        let response = await chai.request(server)
          .post('/v1/stories')
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: 'New title',
            privacyType: 'private',
            page: {
              title: 'New page title',
            },
            content: null
          })

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Story page must have at least one element'))
        expect(errorText.statusCode).to.be.equal(400)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should create story', async () => {
      try {
        const author = authors[0]
        const token = generateToken(author.email)
        const title = 'New title'
        const privacyType = 'private'
        let response = await chai.request(server)
          .post('/v1/stories')
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: title,
            privacyType: privacyType,
            page: {
              title: 'New page title',
              place: null
            },
            content: [
              {
                type: 'text',
                text: 'This is the text',
              }
            ],
            email_addresses: [],
            email_text: null,
            collaborators: [],
          })

        // console.log(JSON.stringify(response.body, null, 2))
        should(response.body).have.property('data')
        let result = response.body.data
        should(result).have.property('_id')
        should(result).have.property('author')
        assert.strictEqual(result.title, title)
        should(result).have.property('status')
        assert.strictEqual(result.status, privacyType)
        should(result).have.property('active')
        assert.strictEqual(result.active, true)
        should(result).have.property('deleted')
        assert.strictEqual(result.deleted, false)
        should(result).have.property('author')
        should(result.author).be.type('object')
        should(result.author).have.property('_id')
        assert.deepEqual(result.author._id, author.id)
        should(result).have.property('pages')
        assert.equal(result.pages.length, 1)
        const page = result.pages[0]
        should(page).have.property('_id')
        should(page).have.property('title')
        should(page).have.property('content')
        should(page).have.property('author')
        should(page).have.property('place')
        assert.deepEqual(page.place, { id: null, name: null, lon: null, lat: null })
        should(page.author).be.type('object')
        should(page.author).have.property('_id')
      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
      }
    })

    it('should create story with an dummy place', async () => {
      try {
        const author = authors[0]
        const token = generateToken(author.email)
        const title = 'New title'
        const privacyType = 'private'
        const place = null
        let response = await chai.request(server)
          .post('/v1/stories')
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: title,
            privacyType: privacyType,
            page: {
              title: 'New page title',
              place
            },
            content: [
              {
                type: 'text',
                text: 'This is the text',
              }
            ],
            email_addresses: [],
            email_text: null,
            collaborators: [],
          })

        should(response.body).have.property('data')
        let result = response.body.data
        should(result).have.property('_id')
        should(result).have.property('author')
        assert.strictEqual(result.title, title)
        should(result).have.property('status')
        assert.strictEqual(result.status, privacyType)
        should(result).have.property('active')
        assert.strictEqual(result.active, true)
        should(result).have.property('deleted')
        assert.strictEqual(result.deleted, false)
        should(result).have.property('author')
        should(result.author).be.type('object')
        should(result.author).have.property('_id')
        assert.deepEqual(result.author._id, author.id)
        should(result).have.property('pages')
        assert.equal(result.pages.length, 1)
        const page = result.pages[0]
        should(page).have.property('_id')
        should(page).have.property('title')
        should(page).have.property('content')
        should(page).have.property('author')
        should(page.author).be.type('object')
        should(page.author).have.property('_id')
        assert.deepEqual(page.place, {
          id: null,
          name: null,
          lat: null,
          lon: null
        })
      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
      }
    })

  })

  describe('Update story', () => {

    let author
    let story
    let fakePages
    let token

    before(async () => {
      await initAfter()
      author = await authorFaker({
        single: true
      })
      token = generateToken(author.email)
      fakePages = await pageFaker({
        n: 3,
        author: author._id
      })
      story = await storyFaker({
        single: true,
        author: author._id,
        pages: fakePages.map(page => page._id)
      })
    })

    after(async () => {
      await initAfter()
    })

    it('should not update story, authorization token is missing', async () => {
      try {
        const response = await chai.request(server)
          .put('/v1/stories')
          .set('Authorization', '')
          .send({})

        should.exist(response.error)
        const error = response.error
        expect(error.status).to.be.equal(401)
        const errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Authorization token missing'))
        expect(errorText.statusCode).to.be.equal(401)

      } catch (err) {
        console.log('err', err)
        should.not.exist(err)
        throw err
      }
    })

    it('should not update story, story id missing', async () => {
      try {
        const response = await chai.request(server)
          .put('/v1/stories')
          .set('Authorization', `Bearer ${token}`)
          .send({})

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Story ID missing'))
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        console.log('err', err)
        should.not.exist(err)
        throw err
      }
    })

    it('should not update story, story title missing', async () => {
      try {
        const response = await chai.request(server)
          .put('/v1/stories')
          .set('Authorization', `Bearer ${token}`)
          .send({
            id: story._id
          })

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Title missing'))
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        console.log('err', err)
        should.not.exist(err)
        throw err
      }
    })

    it('should update story', async () => {
      try {
        const title = 'Updated title'
        const response = await chai.request(server)
          .put('/v1/stories')
          .set('Authorization', `Bearer ${token}`)
          .send({
            id: story._id,
            title: title,
          })

        // console.log(JSON.stringify(response.body, null, 2))
        should(response.body).have.property('data')
        const data = response.body.data
        should(data).have.property('_id')
        should(data).have.property('title')
        assert.strictEqual(data.title, title)
        should(data).have.property('slug')
        assert.strictEqual(data.slug, 'updated-title')
      } catch (err) {
        console.log('err', err)
        should.not.exist(err)
        throw err
      }
    })

    it('should update story with cover', async () => {
      try {
        const title = 'Updated title'
        const response = await chai.request(server)
          .put('/v1/stories')
          .set('Authorization', `Bearer ${token}`)
          .field('id', String(story._id))
          .field('title', title)
          .attach('cover', fs.readFileSync(`${__dirname}/../media/test_image.jpg`), 'test_image.jpg')

        should(response.body).have.property('data')
        const data = response.body.data
        should(data).have.property('_id')
        should(data).have.property('title')
        assert.strictEqual(data.title, title)
        should(data).have.property('slug')
        assert.strictEqual(data.slug, 'updated-title')
        should(data).have.property('theme')
        should(data.theme).have.property('cover')
        assert.notEqual(data.theme.cover, story.theme.cover)

      } catch (err) {
        console.log('err', err)
        should.not.exist(err)
        throw err
      }
    })

    it('should update story with a new page', async () => {
      try {
        const newTitle = 'new page'
        const newPage = await pageFaker({
          single: true,
          author: author._id,
          title: newTitle
        })
        const title = 'Updated title'
        const response = await chai.request(server)
          .put('/v1/stories')
          .set('Authorization', `Bearer ${token}`)
          .send({
            id: String(story._id),
            title: title,
            pageIds: story.pages.concat([newPage._id])
          })

        // console.log(JSON.stringify(response.body, null, 2))
        should(response.body).have.property('data')
        const data = response.body.data
        should(data).have.property('_id')
        should(data).have.property('title')
        assert.strictEqual(data.title, title)
        should(data).have.property('slug')
        assert.strictEqual(data.slug, 'updated-title')
        assert.strictEqual(data.pages.length, 4)
        assert.strictEqual(data.pages[3].title, newTitle)
      } catch (err) {
        console.log('err', err)
        should.not.exist(err)
        throw err
      }
    })

  })

  describe('export content tests', () => {

    describe('export preview', () => {
      let author
      let pages

      before(async () => {
        await initAfter()
        author = await authorFaker({
          single: true
        })
        pages = await pageFaker({
          n: 10,
          author: author._id
        })
        await storyFaker({
          pages: pages.map(page => page._id),
          author: author._id
        })
      })

      after(async () => {
        await initAfter()
      })

      it('should not preview export content, authorization token is missing', async () => {
        try {
          let response = await chai.request(server)
            .post('/v1/export/preview')
            .set('Authorization', '')
            .send({})

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

      it('should preview export content', async () => {
        try {
          const token = generateToken(author.email)
          let response = await chai.request(server)
            .post('/v1/export/preview')
            .set('Authorization', `Bearer ${token}`)
            .send({})

          const result = response.body
          should(result).have.property('totalSize')
          should(result).have.property('fileTree')
          should(result.fileTree).be.type('object')
          should(result).not.be.empty()
          const fileTree = result.fileTree
          const keys = Object.keys(fileTree)
          // const entries = Object.entries(fileTree)
          keys.map(key => {
            const file = fileTree[key]
            should(file).have.property('cover')
            should(file).have.property('pages')
            should(file.pages).be.type('object')
            for (let page of file.pages) {
              should(page).be.type('object')
              should(page).have.property('title')
              should(page).have.property('content')
              should(page.content).be.type('object')
            }
          })
        } catch (err) {
          console.log('err', err)
          should.not.exist(err)
          throw err
        }
      })
    })

    describe('export download', () => {

      before(async () => {
        try {
          await initAfter()
          await initBefore()
        } catch (e) {
          throw e
        }
      })

      after(async () => {
        try {
          await initAfter()
        } catch (e) {
          throw e
        }
      })

      it('should not export content, authorization token is missing', async () => {
        try {
          let response = await chai.request(server)
            .post('/v1/export/download')
            .set('Authorization', '')
            .send({})

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

      it('should export content', async () => {
        try {
          const author = authors[0]
          const token = generateToken(author.email)
          let response = await chai.request(server)
            .post('/v1/export/download')
            .set('Authorization', `Bearer ${token}`)
            .send({})

          const header = response.header
          should(header).have.property('content-type')
          const regex = RegExp('attachment; filename=*')
          const contentDisposition = header['content-disposition']
          assert.strictEqual(regex.test(contentDisposition), true)
          const contentType = header['content-type']
          assert.strictEqual(contentType, 'application/zip')
        } catch (err) {
          console.log('err', err)
          should.not.exist(err)
          throw err
        }
      })
    })

  })

  describe('delete story', () => {

    before(async () => {
      try {
        await initAfter()
        await initBefore()
      } catch (e) {
        throw e
      }
    })

    after(async () => {
      try {
        await initAfter()
      } catch (e) {
        throw e
      }
    })

    it('should not delete story, authorization token is missing', async () => {
      try {
        let story = stories[0]
        let response = await chai.request(server)
          .delete('/v1/stories/123')
          .set('Authorization', '')

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

    it('should delete story', async () => {
      try {
        let cDate = new Date()
        const author = authors[0]
        const story = stories[0]
        const token = generateToken(author.email)

        let response = await chai.request(server)
          .delete(`/v1/stories/${story._id}`)
          .set('Authorization', `bearer ${token}`)

        // console.log(JSON.stringify(response.body, null, 2))

        let res = response.body
        expect(res).to.be.an('object')
        expect(res).to.has.property('message').and.equals('You successfully deleted story')
        expect(res.data).to.equals(story._id)

        // check does story exist in db
        const storyExist = await Story.findOneActiveById(story._id)
        expect(storyExist).to.equals(null)
      } catch (err) {
        expect(err).to.not.exist
        throw err
      }
    })
  })
})

/*************************************************/
/******************** | GET | ********************/
/*************************************************/

describe('should test API for stories, GET methods', () => {
  before(async () => {
    await initAfter()
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('my stories', () => {

    let author = fixtures.collections.authors[0]
    let token = generateToken(author.email)

    it('it should return error if not authorized ', async () => {
      let author = fixtures.collections.authors[3]
      try {
        let response = await chai.request(server)
          .get('/v1/stories/my')
          .set('Authorization', '')

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

    it('it should return error if filter deleted not used properly', async () => {
      let author = fixtures.collections.authors[3]
      try {
        let response = await chai.request(server)

          .get('/v1/stories/my?deleted=asdf')
          .set('Authorization', `${token}`)

        expect(response.error).to.exist
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.includes('Cast to Boolean failed for value')
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('it should return proper response with various query strings options', async () => {
      try {
        let page = 1
        let limit = 3
        let search = ''
        let deleted = true
        let sort = 'title:desc'

        const endpoints = [
          `/v1/stories/my`,
          `/v1/stories/my?searc=${search}&sorass=${sort}&limifake=${limit}`,
          `/v1/stories/my?search=${search}&sort=${sort}&limit=${limit}&page=${page}`,
          `/v1/stories/my?deleted=${deleted}&search=${search}&sort=${sort}&limit=${limit}&page=${page}`,
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
          docs.forEach(story => {
            // test keys for first level - story
            let authorKeys = Object.keys(story.author)
            expect(authorKeys.sort()).to.deep.equal(gqlKeys.story.author.sort())
            let storyKeys = Object.keys(story)
            expect(gqlKeys.story.root.sort()).to.deep.equal(storyKeys.sort())
            let storyShareKeys = Object.keys(story.share)
            expect(storyShareKeys.sort()).to.deep.equal(gqlKeys.story.share.sort())

            // test keys for second level - story.collaborators
            let collaborators = story.collaborators
            collaborators.forEach(collaborator => {
              let authorKeys = Object.keys(collaborator.author)
              expect(authorKeys.sort()).to.deep.equal(gqlKeys.author.root.sort())
              let collaboratorKeys = Object.keys(collaborator)
              expect(collaboratorKeys.sort()).to.deep.equal(gqlKeys.story.collaborators.sort())
            })

            // test keys for second level - story.pages
            let pages = story['pages']
            pages.forEach(page => {
              let authorKeys = Object.keys(page.author)
              expect(authorKeys.sort()).to.deep.equal(gqlKeys.author.root.sort())
              let pageKeys = Object.keys(page)
              expect(pageKeys.sort()).to.deep.equal(gqlKeys.page.root.sort())
              let pageThemeKeys = Object.keys(page.theme)
              expect(pageThemeKeys).to.deep.equal(gqlKeys.page.theme)
            })

          })
        }

      } catch (err) {
        expect(err).to.not.exist
      }
    })

  })

  describe('my collaboration', () => {

    let author = fixtures.collections.authors[0]
    let token = generateToken(author.email)

    it('it should return error if not authorized ', async () => {
      let author = fixtures.collections.authors[3]
      try {
        let response = await chai.request(server)
          .get('/v1/stories/my')
          .set('Authorization', '')

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
        let page = 1
        let limit = 3
        let search = 'a'
        let sort = 'title:desc'

        const endpoints = [
          '/v1/stories/collaboration',
          `/v1/stories/collaboration?searc=${search}&sorass=${sort}&limifake=${limit}`,
          `/v1/stories/collaboration?search=${search}&sort=${sort}&limit=${limit}&page=${page}`,
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
          docs.forEach(story => {
            // test keys for first level - story
            let authorKeys = Object.keys(story.author)
            expect(authorKeys.sort()).to.deep.equal(gqlKeys.story.author.sort())
            let storyKeys = Object.keys(story)
            expect(gqlKeys.story.root.sort()).to.deep.equal(storyKeys.sort())
            let storyShareKeys = Object.keys(story.share)
            expect(storyShareKeys.sort()).to.deep.equal(gqlKeys.story.share.sort())

            // test keys for second level - story.collaborators
            let collaborators = story.collaborators
            collaborators.forEach(collaborator => {
              let authorKeys = Object.keys(collaborator.author)
              expect(authorKeys.sort()).to.deep.equal(gqlKeys.author.root.sort())
              let collaboratorKeys = Object.keys(collaborator)
              expect(collaboratorKeys.sort()).to.deep.equal(gqlKeys.story.collaborators.sort())
            })

            // test keys for second level - story.pages
            let pages = story['pages']
            pages.forEach(page => {
              let authorKeys = Object.keys(page.author)
              expect(authorKeys.sort()).to.deep.equal(gqlKeys.author.root.sort())
              let pageKeys = Object.keys(page)
              expect(pageKeys.sort()).to.deep.equal(gqlKeys.page.root.sort())
              let pageThemeKeys = Object.keys(page.theme)
              expect(pageThemeKeys).to.deep.equal(gqlKeys.page.theme)
            })

          })
        }

      } catch (err) {
        expect(err).to.not.exist
      }
    })

  })

  describe('my feed', () => {

    let author = fixtures.collections.authors[1]
    let token = generateToken(author.email)

    it('it should return error if not authorized ', async () => {
      let author = fixtures.collections.authors[3]
      try {
        let response = await chai.request(server)
          .get(`/v1/stories/feed`)
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

    it('it should return error if deleted not used properly', async () => {
      let author = fixtures.collections.authors[3]
      try {
        let response = await chai.request(server)

          .get(`/v1/stories/my?deleted=asdf`)
          .set('Authorization', `${token}`)

        expect(response.error).to.exist
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.includes('Cast to Boolean failed for value')
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('it should return proper response with various query strings options', async () => {
      try {
        const page = 1
        const limit = 3
        const search = ''
        const filter = 'shared'
        const sort = 'title:desc'

        const endpoints = [
          '/v1/stories/feed',
          `/v1/stories/feed?searc=${search}&sorass=${sort}&limifake=${limit}`,
          `/v1/stories/feed?search=${search}&sort=${sort}&limit=${limit}&page=${page}`
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
          docs.forEach(story => {
            // test keys for first level - story
            let authorKeys = Object.keys(story.author)
            expect(authorKeys.sort()).to.deep.equal(gqlKeys.story.author.sort())
            let storyKeys = Object.keys(story)
            expect(gqlKeys.story.root.sort()).to.deep.equal(storyKeys.sort())
            let storyShareKeys = Object.keys(story.share)
            expect(storyShareKeys.sort()).to.deep.equal(gqlKeys.story.share.sort())

            // test keys for second level - story.collaborators
            let collaborators = story.collaborators
            collaborators.forEach(collaborator => {
              let authorKeys = Object.keys(collaborator.author)
              expect(authorKeys.sort()).to.deep.equal(gqlKeys.author.root.sort())
              let collaboratorKeys = Object.keys(collaborator)
              expect(collaboratorKeys.sort()).to.deep.equal(gqlKeys.story.collaborators.sort())
            })

            // test keys for second level - story.pages
            let pages = story.pages
            pages.forEach(page => {
              let authorKeys = Object.keys(page.author)
              expect(authorKeys.sort()).to.deep.equal(gqlKeys.author.root.sort())
              let pageKeys = Object.keys(page)
              expect(pageKeys.sort()).to.deep.equal(gqlKeys.page.root.sort())
              let pageThemeKeys = Object.keys(page.theme)
              expect(pageThemeKeys).to.deep.equal(gqlKeys.page.theme)
            })

          })
        }

      } catch (err) {
        expect(err).to.not.exist
      }
    })

  })

  describe('story by id', () => {

    let author = fixtures.collections.authors[1]
    let token = generateToken(author.email)

    it('it should return error if not authorized ', async () => {
      let author = fixtures.collections.authors[3]
      try {
        let response = await chai.request(server)
          .get(`/v1/stories/${author.id}`)
          .set('Authorization', '')

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
        const id = stories[5]['id']

        const endpoints = [
          `/v1/stories/${id}`,
        ]

        /*  test multiple endpoints */

        for (let endpoint of endpoints) {

          const response = await chai.request(server)
            .get(endpoint)
            .set('Authorization', `Bearer ${token}`)

          // console.log(JSON.stringify(response.body, null, 2))
          expect(response.body).to.exist
          expect(response.status).to.equal(200)
          const story = response.body.data
          expect(story).to.have.property('isFavorite')
          expect(story.isFavorite).equal(false)
          // test keys for first level - story
          const authorKeys = Object.keys(story.author)
          expect(authorKeys.sort()).to.deep.equal(gqlKeys.story.author.sort())
          const storyKeys = Object.keys(story)
          expect(gqlKeys.story.details.sort()).to.deep.equal(storyKeys.sort())
          const storyShareKeys = Object.keys(story.share)
          expect(storyShareKeys.sort()).to.deep.equal(gqlKeys.story.share.sort())
          expect(story.author).to.have.property('isFollowed')
          expect(story.author.isFollowed).to.equal(false)

          // test keys for second level - story.collaborators
          const collaborators = story.collaborators
          collaborators.forEach(collaborator => {
            const authorKeys = Object.keys(collaborator.author)
            expect(authorKeys.sort()).to.deep.equal(gqlKeys.author.root.sort())
            const collaboratorKeys = Object.keys(collaborator)
            expect(collaboratorKeys.sort()).to.deep.equal(gqlKeys.story.collaborators.sort())
          })

          // test keys for second level - story.pages
          const pages = story['pages']
          pages.forEach(page => {
            const authorKeys = Object.keys(page.author)
            expect(authorKeys.sort()).to.deep.equal(gqlKeys.author.root.sort())
            const pageKeys = Object.keys(page)
            expect(pageKeys.sort()).to.deep.equal(gqlKeys.page.root.sort())
            const pageThemeKeys = Object.keys(page.theme)
            expect(pageThemeKeys).to.deep.equal(gqlKeys.page.theme)
          })

        }

      } catch (err) {
        console.log(err.stack)
        expect(err).to.not.exist
      }
    })
  })

  describe('pages from story', () => {
    let author1, author2, page, story
    beforeEach(async () => {
      // authors
      let fakerAuthors = await authorFaker({n: 2})
      author1 = fakerAuthors[0]
      author2 = fakerAuthors[1]
      // pages
      let fakerPages = await pageFaker({
        author: author1.id
      })
      page = fakerPages[0]
      // stories
      let stories = await storyFaker({ author: author1.id, pages: [page.id], status: 'private'})
      story = stories[0]
    })
    afterEach(async () => {
      await initAfter()
    })

    it('should not get pages, authentication failed', async () => {
      let id = story.id

      const endpoint = [
        `/v1/stories/${id}/pages`,
      ]

      let response = await chai.request(server)
        .get(endpoint)
        .set('Authorization', 'Bearer')

      // console.log(JSON.stringify(response.body, null, 2))
      expect(response.body).to.exist
      expect(response.status).to.equal(401)
    })

    it('should get story pages', async () => {
      let id = story.id
      const token = generateToken(author1.email)
      const endpoint = [
        `/v1/stories/${id}/pages`,
      ]

      let response = await chai.request(server)
        .get(endpoint[0])
        .set('Authorization', `Bearer ${token}`)

      // console.log(JSON.stringify(response.body, null, 2))
      expect(response.body).to.exist
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('data')
      const { data } = response.body;
      expect(data).to.have.property('pages')
      const storyFirstPageId = story.pages[0]
      const resultFirstPage = data.pages[0]
      expect(resultFirstPage).to.have.property('_id')
      expect(resultFirstPage._id).to.equal(storyFirstPageId.toString())
      expect(resultFirstPage).to.have.property('author')
      expect(resultFirstPage.author).to.have.property('_id')
      assert.equal(resultFirstPage.author._id, story.author)
    })

    it.skip('should not get story pages, access denied', async () => { //TODO: fix this
      try {
        const id = story.id
        const token = generateToken(author2.email)

        const endpoint = [
          `/v1/stories/${id}/pages`,
        ]
        let response = await chai.request(server)
          .get(endpoint[0])
          .set('Authorization', `Bearer ${token}`)

        // console.log(JSON.stringify(response.body, null, 2))
        expect(response.body).to.exist
        expect(response.status).to.equal(400)
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('favorite stories', async () => {
    let authors
    let favorites
    let stories

    before(async () => {
      await initAfter()
      // insert authors
      authors = await authorFaker({n: 2})
      stories = await storyFaker({n: 3})
      favorites = stories.map(
        async story => await favoriteFaker({
          author: authors[0],
          story: story
        })
      )
    })

    after(async () => {
      await initAfter()
    })

    it('should not get favorites, authentication failed', async () => {
      try {
        const author = authors[0]
        const token = generateToken(author.email)
        const story = stories[0]
        let id = story.id
        let response = await chai.request(server)
          .get('/v1/stories/favorites')
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

    it('should not get favorites, no stories for the author', async () => {
      try {
        const author = authors[0]
        const token = generateToken(author.email)
        let response = await chai.request(server)
          .get('/v1/stories/favorites')
          .set('Authorization', `Bearer ${token}`)

        expect(response.body).to.exist
        expect(response.status).to.equal(200)
        expect(response.body).to.have.property('data')
        const { data } = response.body;
        expect(data.docs).to.be.an('array')
        assert.equal(data.total, 3)
        assert.equal(data.limit, 10)
        assert.equal(data.page, 1)
        assert.equal(data.pages, 1)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should get favorites', async () => {
      try {
        const author = authors[1]
        const token = generateToken(author.email)
        let response = await chai.request(server)
          .get('/v1/stories/favorites')
          .set('Authorization', `Bearer ${token}`)

        // console.log(JSON.stringify(response.body, null, 2))
        expect(response.body).to.exist
        expect(response.status).to.equal(200)
        expect(response.body).to.have.property('data')
        const { data } = response.body;
        expect(data.docs).to.be.an('array')
        assert.equal(data.total, 0)
        assert.equal(data.limit, 10)
        assert.equal(data.page, 1)
        assert.equal(data.pages, 1)
      } catch (err) {
        should.not.exist(err)
      }
    })

  })

  describe('unfavorite story', async () => {
    let authors
    let stories
    let favorites

    before(async () => {
      await initAfter()
      // insert authors
      authors = await authorFaker({ n: 2 })
      stories = await storyFaker({ n: 3 })
      const promiseArray = []
      stories.forEach(async story => {
        promiseArray.push(
          favoriteFaker({
            author: authors[0],
            story: story
          })
        )
      })
      favorites = await Promise.all(promiseArray)
    })

    after(async () => {
      await initAfter()
    })

    it('should not unfavorite story, authentication failed', async () => {
      try {
        let response = await chai.request(server)
          .delete('/v1/stories/123/favorite')
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

    it('should unfavorite story', async () => {
      try {
        const author = authors[0]
        const favorite = favorites[0][0]
        const story = favorite.story
        const token = generateToken(author.email)
        let response = await chai.request(server)
          .delete(`/v1/stories/${story.id}/favorite`)
          .set('Authorization', `Bearer ${token}`)

        // console.log(JSON.stringify(response.body, null, 2))
        expect(response.body).to.exist
        expect(response.status).to.equal(200)
        const result = response.body;
        should(result).be.type('object')
        assert.deepEqual(result.story, story.id)
      } catch (err) {
        console.log(err)
        should.not.exist(err)
      }
    })
  })

  describe('get story', () => {
    let authors
    let stories

    before(async () => {
      await initAfter()
      authors = await authorFaker({
        n: 3
      })
      stories = await storyFaker({
        n: 2,
        author: authors[0].id,
        status: 'private'
      })
    })

    after(async () => {
      await initAfter()
    })

    it('should not return story, story with id doesn\'t exist', async () => {
      try {
        const storyId = ObjectId()
        const author = authors[0]
        const token = generateToken(author.email)
        const response = await chai.request(server)
          .get(`/v1/stories/${storyId}`)
          .set('Authorization', `Bearer ${token}`)

        expect(response.error).to.exist
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Story doesn\'t exist'))
        expect(errorText.statusCode).to.be.equal(400)
      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
      }
    })

    it('should not return story, author don\'t have permission', async () => {
      try {
        const author = authors[2]
        const story = stories[0]
        const token = generateToken(author.email)
        const response = await chai.request(server)
          .get(`/v1/stories/${story.id}`)
          .set('Authorization', `Bearer ${token}`)

        expect(response.error).to.exist
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(
          translate.__('You don\'t have permission for this action')
        )
        expect(errorText.statusCode).to.be.equal(400)
      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
      }
    })

    it('should return story with id', async () => {
      try {
        const author = authors[0]
        const story = stories[0]
        const token = generateToken(author.email)
        const response = await chai.request(server)
          .get(`/v1/stories/${story.id}`)
          .set('Authorization', `Bearer ${token}`)

        expect(response.body).to.exist
        expect(response.status).to.equal(200)
        const result = response.body;
        should(result).be.type('object')
        should(result).have.property('data')
        assert.deepEqual(result.data._id, story.id)
      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
      }
    })
  })

  describe('search collaborators', () => {
    let authors
    let collaborators = []
    let req
    let story

    before(async () => {
      await initAfter()
      authors = await authorFaker({
        n: 17
      })
      const targetAuthorsPromise = []
      targetAuthorsPromise.push(
        authorFaker({
          single: true,
          username: 'istoryauthor',
          name: 'John Doe',
          email: 'istoryauthor@gmail.com'
        })
      )
      targetAuthorsPromise.push(
        authorFaker({
          single: true,
          username: 'istoryauthortoo',
          name: 'John Trapper',
          email: 'istoryauthortoo@gmail.com'
        })
      )
      const targetAuthors = await Promise.all(targetAuthorsPromise)
      authors = authors.concat(targetAuthors)
      authors.forEach((author, index) => {
        if (index > 0) {
          let edit = false
          if (index > 3) {
            edit = true
          }
          collaborators.push({
            author: author._id,
            edit
          })
        }
      })
      story = await storyFaker({
        single: true,
        author: authors[0]._id,
        collaborators
      })

      req = {
        user: authors[0]
      }
    })

    after(async () => {
      await initAfter()
    })

    it('should not search collaborators, not authorized', async () => {
      try {
        const story = stories[0]
        const token = ''
        const response = await chai.request(server)
          .get(`/v1/stories/${story.id}/collaborators`)
          .set('Authorization', `Bearer ${token}`)

        const error = response.error
        expect(error.status).to.be.equal(401)
        const errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Authorization token missing'))
        expect(errorText.statusCode).to.be.equal(401)
      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
      }
    })

    it('should not search collaborators, story not found', async () => {
      try {
        const author = authors[0]
        const story = ObjectId()
        const token = generateToken(author.email)
        const response = await chai.request(server)
          .get(`/v1/stories/${story}/collaborators`)
          .set('Authorization', `Bearer ${token}`)

        expect(response.body).to.exist
        expect(response.status).to.equal(400)
        const result = response.body;
        should(result).be.type('object')
        expect(result).to.have.property('message')
        assert.equal(result.message, 'Story not found')
      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
      }
    })

    it('should not search collaborators', async () => {
      try {
        const author = authors[0]
        const token = generateToken(author.email)
        const response = await chai.request(server)
          .get(`/v1/stories/${story.id}/collaborators`)
          .set('Authorization', `Bearer ${token}`)

        expect(response.body).to.exist
        expect(response.status).to.equal(200)
        const result = response.body;
        should(result).be.type('object')
        expect(result).to.have.property('data')
        const { data } = result
        expect(data).to.have.property('docs')
        assert.equal(data.docs.length, 10)
        expect(data).to.have.property('limit')
        assert.equal(data.limit, 10)
        expect(data).to.have.property('total')
        assert.equal(data.total, 15)
        expect(data).to.have.property('page')
        assert.equal(data.page, 1)
        expect(data).to.have.property('pages')
        assert.equal(data.pages, 2)
      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
      }
    })

    it('should not search collaborators, second page', async () => {
      try {
        const author = authors[0]
        const token = generateToken(author.email)
        const response = await chai.request(server)
          .get(`/v1/stories/${story.id}/collaborators?page=2`)
          .set('Authorization', `Bearer ${token}`)

        expect(response.body).to.exist
        expect(response.status).to.equal(200)
        const result = response.body;
        should(result).be.type('object')
        expect(result).to.have.property('data')
        const { data } = result
        expect(data).to.have.property('docs')
        assert.equal(data.docs.length, 5)
        expect(data).to.have.property('limit')
        assert.equal(data.limit, 10)
        expect(data).to.have.property('total')
        assert.equal(data.total, 15)
        expect(data).to.have.property('page')
        assert.equal(data.page, 2)
        expect(data).to.have.property('pages')
        assert.equal(data.pages, 2)
      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
      }
    })

    it('should not search collaborators by term', async () => {
      try {
        const author = authors[0]
        const token = generateToken(author.email)
        const searchTerm = 'istory'
        const response = await chai.request(server)
          .get(`/v1/stories/${story.id}/collaborators?search=${searchTerm}`)
          .set('Authorization', `Bearer ${token}`)

        expect(response.body).to.exist
        expect(response.status).to.equal(200)
        const result = response.body;
        should(result).be.type('object')
        expect(result).to.have.property('data')
        const { data } = result
        expect(data).to.have.property('docs')
        assert.equal(data.docs.length, 2)
        expect(data).to.have.property('limit')
        assert.equal(data.limit, 10)
        expect(data).to.have.property('total')
        assert.equal(data.total, 2)
        expect(data).to.have.property('page')
        assert.equal(data.page, 1)
        expect(data).to.have.property('pages')
        assert.equal(data.pages, 1)
      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
      }
    })
  })

  describe('pending collaborators', () => {
    let authors
    let collaborators = []
    let req
    let story

    before(async () => {
      await initAfter()
      authors = await authorFaker({
        n: 17
      })
      const targetAuthorsPromise = []
      targetAuthorsPromise.push(
        authorFaker({
          single: true,
          username: 'istoryauthor',
          name: 'John Doe',
          email: 'istoryauthor@gmail.com'
        })
      )
      targetAuthorsPromise.push(
        authorFaker({
          single: true,
          username: 'istoryauthortoo',
          name: 'John Trapper',
          email: 'istoryauthortoo@gmail.com'
        })
      )
      const targetAuthors = await Promise.all(targetAuthorsPromise)
      authors = authors.concat(targetAuthors)
      authors.forEach((author, index) => {
        if (index > 0) {
          let edit = false
          if (index > 3) {
            edit = true
          }
          collaborators.push({
            author: author._id,
            edit
          })
        }
      })
      story = await storyFaker({
        single: true,
        author: authors[0]._id,
        collaborators
      })

      const fakeAuthorsToInvite = await authorFaker({
        n: 13
      })
      fakeAuthorsToInvite.push(
        await authorFaker({
          single: true,
          username: 'pendinguser1',
          name: 'User Pading1'
        })
      )
      fakeAuthorsToInvite.push(
        await authorFaker({
          single: true,
          username: 'pendinguser2',
          name: 'User Pading2'
        })
      )

      for (const fakeAuthor of fakeAuthorsToInvite) {
        await collaborationInviteFaker({
          author: fakeAuthor._id,
          active: true,
          story: story._id,
          edit: true
        })
      }

      req = {
        user: authors[0]
      }
    })

    after(async () => {
      await initAfter()
    })

    it('should not return pending collaborators, not authorized', async () => {
      try {
        const story = stories[0]
        const token = ''
        const response = await chai.request(server)
          .get(`/v1/stories/${story.id}/pending-collaborators`)
          .set('Authorization', `Bearer ${token}`)

        const error = response.error
        expect(error.status).to.be.equal(401)
        const errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Authorization token missing'))
        expect(errorText.statusCode).to.be.equal(401)
      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
      }
    })

    it('should not return peding collaborators, story not found', async () => {
      try {
        const author = authors[0]
        const story = ObjectId()
        const token = generateToken(author.email)
        const response = await chai.request(server)
          .get(`/v1/stories/${story}/pending-collaborators`)
          .set('Authorization', `Bearer ${token}`)

        // console.log(JSON.stringify(response.body, null, 2))
        expect(response.body).to.exist
        expect(response.status).to.equal(400)
        const result = response.body;
        should(result).be.type('object')
        expect(result).to.have.property('message')
        assert.equal(result.message, 'Story not found')
      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
      }
    })

    it('should not return pending collaborators', async () => {
      try {
        const author = authors[0]
        const token = generateToken(author.email)
        const response = await chai.request(server)
          .get(`/v1/stories/${story.id}/pending-collaborators`)
          .set('Authorization', `Bearer ${token}`)

        expect(response.body).to.exist
        expect(response.status).to.equal(200)
        const result = response.body;
        should(result).be.type('object')
        expect(result).to.have.property('data')
        const { data } = result
        expect(data).to.have.property('docs')
        assert.equal(data.docs.length, 10)
        expect(data).to.have.property('limit')
        assert.equal(data.limit, 10)
        expect(data).to.have.property('total')
        assert.equal(data.total, 15)
        expect(data).to.have.property('page')
        assert.equal(data.page, 1)
        expect(data).to.have.property('pages')
        assert.equal(data.pages, 2)
      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
      }
    })

    it('should not return pending collaborators, second page', async () => {
      try {
        const author = authors[0]
        const token = generateToken(author.email)
        const response = await chai.request(server)
          .get(`/v1/stories/${story.id}/pending-collaborators?page=2`)
          .set('Authorization', `Bearer ${token}`)

        expect(response.body).to.exist
        expect(response.status).to.equal(200)
        const result = response.body;
        should(result).be.type('object')
        expect(result).to.have.property('data')
        const { data } = result
        expect(data).to.have.property('docs')
        assert.equal(data.docs.length, 5)
        expect(data).to.have.property('limit')
        assert.equal(data.limit, 10)
        expect(data).to.have.property('total')
        assert.equal(data.total, 15)
        expect(data).to.have.property('page')
        assert.equal(data.page, 2)
        expect(data).to.have.property('pages')
        assert.equal(data.pages, 2)
      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
      }
    })

    it('should not return pending collaborators by term', async () => {
      try {
        const author = authors[0]
        const token = generateToken(author.email)
        const searchTerm = 'pending'
        const response = await chai.request(server)
          .get(`/v1/stories/${story.id}/pending-collaborators?search=${searchTerm}`)
          .set('Authorization', `Bearer ${token}`)

        expect(response.body).to.exist
        expect(response.status).to.equal(200)
        const result = response.body;
        should(result).be.type('object')
        expect(result).to.have.property('data')
        const { data } = result
        expect(data).to.have.property('docs')
        assert.equal(data.docs.length, 2)
        expect(data).to.have.property('limit')
        assert.equal(data.limit, 10)
        expect(data).to.have.property('total')
        assert.equal(data.total, 2)
        expect(data).to.have.property('page')
        assert.equal(data.page, 1)
        expect(data).to.have.property('pages')
        assert.equal(data.pages, 1)
      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
      }
    })
  })
})
