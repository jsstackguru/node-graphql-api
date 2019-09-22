/**
 * @file Tests for page handles
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

//  assertions
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'
import uuid from 'node-uuid'

// models
import Page from '../../src/models/page/page.model'
import Story from '../../src/models/story/story.model'

// fixtures
import fixtures from '../fixtures'
const content = require('../fixtures/allContents.json')

// import page handles functions
import * as pageHndl from '../../src/handles/page.handles'
import storyHndl from '../../src/handles/story.handles'
import translate from '../../src/lib/translate'

// services
import { ObjectId } from 'mongodb'
import { initAfter, initBefore } from '../setup'

// fixtures
import { storyFaker, authorFaker, pageFaker } from '../fixtures/faker'

const authors = fixtures.collections.authors
const pages = fixtures.collections.pages
const stories = fixtures.collections.stories

describe('Page handles tests...', async () => {

  before(async () => {
    await initAfter()
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('Testing media content', () => {

    it('should not find page to add content', async () => {
      try {
        await pageHndl.updateContents(null, '5b19041eba93fc0e00d2f2a1')
      } catch (err) {
        should(err).exist
        assert(err instanceof Error, true)
        expect(err.message).to.be.equal('Page not found')
      }
    })

    it('user is not the author to add content', async () => {
      try {
        const user = fixtures.collections.authors[1]
        await pageHndl.updateContents(user, '593f94bd17d85a0e003d3c36')
      } catch (err) {
        assert(err instanceof Error, true)
        expect(err.message).to.be.equal('User is not the author')
      }
    })

    it('should add text element in content', async () => {
      const authors = fixtures.collections.authors
      const user = authors.find(a => {
        return a._id === '58eb78b94b432a21008c2346'
      })
      let pageId = '593f94bd17d85a0e003d3c36'
      let content = [{
        type: 'text',
        text: 'This is the test text element',
        style: 'normal'
      }]
      let page = await pageHndl.updateContents(user, pageId, content)

      assert(page._id, pageId)
      page.should.be.an.type.Object
      expect(page.content.length, 1)
      const textElement = page.content[0]
      assert(textElement.type, 'text')
      textElement.should.have.property('created')
      textElement.should.have.property('updated')
      textElement.should.have.property('matchId')
    })

    it('should add gallery element in content', async () => {
      const authors = fixtures.collections.authors
      const user = authors.find(a => {
        return a._id === '58eb78b94b432a21008c2346'
      })
      let pageId = '593f94bd17d85a0e003d3c36'
      let content = [{
        type: 'gallery',
        caption: 'Gallery test',
        place: {
          lat: 0,
          lon: 0,
          name: 'Under the sea',
        }
      }]
      let files = {
        content: [
          {
            gallery: {
              sections: [
                {
                  images: [{
                    image: {
                      path: __dirname + '/../media/test_image.jpg',
                      fieldName: 'contents[0][sections][0][images][0][image]',
                      type: 'image/jpg',
                      size: 30000
                    }
                  }]
                }
              ]
            }
          }
        ]
      }

      let page = await pageHndl.updateContents(user, pageId, content, files)

      page.should.be.a.type('object')
      should(page).have.a.property('content')
      assert(page.content.length, 1)
      let galleryElement = page.content[0]
      assert(galleryElement.type, 'gallery')
      should(galleryElement).have.a.property('sections')
      expect(galleryElement.sections.length).to.be.above(0)
      let firstSection = galleryElement.sections[0]
      firstSection.should.have.property('images')
      expect(firstSection.images.length).to.be.above(0)
      firstSection.images.should.be.type('object')
      let firstImage = firstSection.images[0]
      firstImage.should.have.property('image')
      firstImage.should.have.property('id')
      firstImage.should.have.property('size')
    })

    it('should add image element in content', async () => {
      const authors = fixtures.collections.authors
      const user = authors.find(a => {
        return a._id === '58eb78b94b432a21008c2346'
      })
      let pageId = '593f94bd17d85a0e003d3c36'
      let content = [{
        type: 'image',
        caption: 'Image test',
        place: {
          lat: 0,
          lon: 0,
          name: 'Under the sea',
        },
        // image: '/58eb78b94b432a21008c2346/test_image.jpg',
      }]
      let files = {
        content: [
          {
            image: {
              path: __dirname + '/../media/test_image.jpg',
              name: 'test_image.jpg',
              fieldName: 'content[0][image]',
              type: 'image/jpg',
              size: 30000
            }
          }
        ]
      }



      let page = await pageHndl.updateContents(user, pageId, content, files)

      page.should.be.a.type('object')
      should(page).have.a.property('content')
      assert(page.content.length, 1)
      let imageElement = page.content[0]
      assert(imageElement.type, 'image')
      should(imageElement).have.a.property('caption')
      assert(imageElement.caption, 'Image test')
      should(imageElement).have.a.property('size')
      expect(imageElement.size).to.be.above(0)
      should(imageElement).have.a.property('updated')
      should(imageElement).have.a.property('created')
      should(imageElement).have.a.property('matchId')
      should(imageElement).have.a.property('place')
      imageElement.place.should.be.type('object')
      should(imageElement).have.a.property('contentId')
      should(imageElement.contentId).not.be.equal(null)
    })

    it.skip('should add audio element in content', async () => {
      const authors = fixtures.collections.authors
      const user = authors.find(a => {
        return a._id === '58eb78b94b432a21008c2346'
      })
      let pageId = '593f94bd17d85a0e003d3c36'
      let content = [{
        type: 'audio',
        caption: 'Audio test',
        place: {
          lat: 0,
          lon: 0,
          name: 'Under the sea',
        },
      }]
      let files = {
        content: [{
          audio: {
            path: __dirname + '/../media/test_audio.mp3',
            name: 'test_audio.mp3',
            fieldName: 'contents[0][audio]',
            type: 'audio/mp3',
            size: 2000
          }
        }]
      }

      let page = await pageHndl.updateContents(user, pageId, content, files)

      page.should.be.a.type('object')
      should(page).have.a.property('content')
      assert(page.content.length, 1)
      let imageElement = page.content[0]
      assert(imageElement.type, 'audio')
      should(imageElement).have.a.property('url')
      should(imageElement).have.a.property('caption')
      assert(imageElement.caption, 'Audio test')
      should(imageElement).have.a.property('size')
      assert(imageElement.size, 2000)
      should(imageElement).have.a.property('updated')
      should(imageElement).have.a.property('created')
      should(imageElement).have.a.property('matchId')
      should(imageElement).have.a.property('place')
      imageElement.place.should.be.type('object')
      should(imageElement).have.a.property('contentId')
      should(imageElement.contentId).not.be.equal(null)
      should(imageElement).have.a.property('duration')
      assert(imageElement.duration, 2.484)
    })

    it.skip('should add audio element with image in content', async () => {
      const authors = fixtures.collections.authors
      const user = authors.find(a => {
        return a._id === '58eb78b94b432a21008c2346'
      })
      let pageId = '593f94bd17d85a0e003d3c36'
      let content = [{
        type: 'audio',
        caption: 'Audio test',
        place: {
          lat: 0,
          lon: 0,
          name: 'Under the sea',
        },
      }]
      let files = {
        content: [{
          audio: {
            path: __dirname + '/../media/test_audio.mp3',
            name: 'test_audio.mp3',
            fieldName: 'contents[0][audio]',
            type: 'audio/mp3',
            size: 2000
          },
          image: {
            path: __dirname + '/../media/test_image.jpg',
            name: 'test_image.jpg',
            fieldName: 'contents[0][image]',
            type: 'image/jpg',
            size: 30000
          }
        }]
      }

      let page = await pageHndl.updateContents(user, pageId, content, files)

      page.should.be.a.type('object')
      should(page).have.a.property('content')
      assert(page.content.length, 1)
      let imageElement = page.content[0]
      assert(imageElement.type, 'audio')
      should(imageElement).have.a.property('url')
      should(imageElement).have.a.property('caption')
      assert(imageElement.caption, 'Audio test')
      should(imageElement).have.a.property('size')
      assert(imageElement.size, 2000)
      should(imageElement).have.a.property('updated')
      should(imageElement).have.a.property('created')
      should(imageElement).have.a.property('matchId')
      should(imageElement).have.a.property('place')
      imageElement.place.should.be.type('object')
      should(imageElement).have.a.property('contentId')
      should(imageElement.contentId).not.be.equal(null)
      should(imageElement).have.a.property('duration')
      assert(imageElement.duration, 2.484)
      should(imageElement).have.a.property('image')
    })

    it.skip('should add video element in content', async () => {
      const authors = fixtures.collections.authors
      const user = authors.find(a => {
        return a._id === '58eb78b94b432a21008c2346'
      })
      let pageId = '593f94bd17d85a0e003d3c36'
      let content = [{
        type: 'video',
        caption: 'Video test',
        place: {
          lat: 0,
          lon: 0,
          name: 'Under the sea',
        },
      }]
      let files = {
        content: [{
          video: {
            path: __dirname + '/../media/test_video.mp4',
            name: 'test_video.mp3',
            fieldName: 'contents[0][video]',
            type: 'video/mp4',
            size: 4000
          },
          image: {
            path: __dirname + '/../media/test_image.jpg',
            name: 'test_image.jpg',
            fieldName: 'contents[0][image]',
            type: 'image/jpg',
            size: 30000
          }
        }]
      }

      let page = await pageHndl.updateContents(user, pageId, content, files)

      page.should.be.a.type('object')
      should(page).have.a.property('content')
      assert(page.content.length, 1)
      let videoElement = page.content[0]
      assert(videoElement.type, 'video')
      should(videoElement).have.a.property('url')
      should(videoElement).have.a.property('caption')
      assert(videoElement.caption, 'Video test')
      should(videoElement).have.a.property('size')
      assert(videoElement.size, 4000)
      should(videoElement).have.a.property('updated')
      should(videoElement).have.a.property('created')
      should(videoElement).have.a.property('matchId')
      should(videoElement).have.a.property('place')
      videoElement.place.should.be.type('object')
      should(videoElement).have.a.property('contentId')
      should(videoElement.contentId).not.be.equal(null)
      should(videoElement).have.a.property('duration')
      should(videoElement.duration).have.a.property('raw')
      should(videoElement.duration).have.a.property('seconds')
      assert(videoElement.duration.seconds, 5)
      should(videoElement).have.a.property('image')
      should(videoElement.image).not.be.equal(null)
    })

    it.skip('should add gif element in content', async () => {
      const authors = fixtures.collections.authors
      const user = authors.find(a => {
        return a._id === '58eb78b94b432a21008c2346'
      })
      let pageId = '593f94bd17d85a0e003d3c36'
      let content = [{
        type: 'gif',
        caption: 'GIF test',
        place: {
          lat: 0,
          lon: 0,
          name: 'Under the sea',
        },
      }]
      let files = {
        content: [{
          video: {
            path: __dirname + '/../media/test_video.mp4',
            name: 'test_video.mp3',
            fieldName: 'contents[0][video]',
            type: 'video/mp4',
            size: 4000
          },
        }]
      }

      let page = await pageHndl.updateContents(user, pageId, content, files)

      page.should.be.a.type('object')
      should(page).have.a.property('content')
      assert(page.content.length, 1)
      let videoElement = page.content[0]
      assert(videoElement.type, 'gif')
      should(videoElement).have.a.property('url')
      should(videoElement).have.a.property('caption')
      assert(videoElement.caption, 'Video test')
      should(videoElement).have.a.property('size')
      assert(videoElement.size, 4000)
      should(videoElement).have.a.property('updated')
      should(videoElement).have.a.property('created')
      should(videoElement).have.a.property('matchId')
      should(videoElement).have.a.property('place')
      videoElement.place.should.be.type('object')
      should(videoElement).have.a.property('contentId')
      should(videoElement.contentId).not.be.equal(null)
      should(videoElement).have.a.property('duration')
      should(videoElement.duration).have.a.property('raw')
      should(videoElement.duration).have.a.property('seconds')
      assert(videoElement.duration.seconds, 5)
      should(videoElement).have.a.property('image')
      should(videoElement.image).not.be.equal(null)
    })

    it.skip('should add recording element in content', async () => {
      const authors = fixtures.collections.authors
      const user = authors.find(a => {
        return a._id === '58eb78b94b432a21008c2346'
      })
      let pageId = '593f94bd17d85a0e003d3c36'
      let content = [{
        type: 'recording',
        caption: 'Recording test',
        place: {
          lat: 0,
          lon: 0,
          name: 'Under the sea',
        },
      }]
      let files = {
        content: [{
          audio: {
            path: __dirname + '/../media/test_audio.mp3',
            name: 'test_audio.mp3',
            fieldName: 'contents[0][recording]',
            type: 'audio/mp3',
            size: 2000
          }
        }]
      }

      let page = await pageHndl.updateContents(user, pageId, content, files)

      page.should.be.a.type('object')
      should(page).have.a.property('content')
      assert(page.content.length, 1)
      let imageElement = page.content[0]
      assert(imageElement.type, 'recording')
      should(imageElement).have.a.property('url')
      should(imageElement).have.a.property('caption')
      assert(imageElement.caption, 'Audio test')
      should(imageElement).have.a.property('size')
      assert(imageElement.size, 2000)
      should(imageElement).have.a.property('updated')
      should(imageElement).have.a.property('created')
      should(imageElement).have.a.property('matchId')
      should(imageElement).have.a.property('place')
      imageElement.place.should.be.type('object')
      should(imageElement).have.a.property('contentId')
      should(imageElement.contentId).not.be.equal(null)
      should(imageElement).have.a.property('duration')
      assert(imageElement.duration, 2.484)
    })
  })

  describe('copy / move page', () => {

    it("should not copy page, page not found", async () => {
      try {
        let pageId = '593f94bd17d85a0e003d3c39'
        let story = stories[0]
        let user = authors[0]

        let response = await pageHndl.copy(pageId, story, user._id)
        expect(response).to.not.exist

      } catch (err) {
        assert(err instanceof Error, true)
        expect(err.message).to.be.equal(translate.__('Page not found'))
        expect(err.statusCode).to.be.equal(422)
      }
    })
    it("should not copy page, author don't have permission", async () => {
      try {
        let pageId = '593f94bd17d85a0e003d3c36'
        let story = stories[1]
        let user = authors[1]

        let response = await pageHndl.copy(pageId, story, user._id)
        expect(response).to.not.exist

      } catch (err) {
        assert(err instanceof Error, true)
        expect(err.message).to.be.equal(translate.__('You can\'t copy this page'))
        assert(err.statusCode, 422)
      }
    })

    it("should not copy page, story not found", async () => {
      try {
        let pageId = stories[0]['pages'][0]
        let story = '593f94bd17d85a0e003d3c36'
        let user = authors[0]

        let response = await pageHndl.copy(pageId, story, user._id)
        expect(response).to.not.exist

      } catch (err) {
        assert(err instanceof Error, true)
        expect(err.message).to.be.equal(translate.__('Story not found'))
        assert(err.statusCode, 422)
      }
    })

    it("should not copy page, user is not author or collaborator on story", async () => {
      try {
        let pageId = stories[0]['pages'][0]
        let story = stories[2]
        let user = authors[0]

        let response = await pageHndl.copy(pageId, story, user._id)
        expect(response).to.not.exist

      } catch (err) {
        assert(err instanceof Error, true)
        expect(err.message).to.be.equal(translate.__('User is not author or collaborator on the story'))
        assert(err.statusCode, 422)
      }
    })

    it("should not move page when there is only one", async () => {
      try {
        let pageId = stories[2]['pages'][0]
        let story = stories[3]
        let user = authors[1]
        let removePage = true

        let response = await pageHndl.copy(pageId, story._id, user._id, removePage)
        expect(response).to.not.exist

      } catch (err) {
        assert(err instanceof Error, true)
        expect(err.message).to.be.equal('You cannot move page when only one is in story')
        assert(err.statusCode, 422)
      }
    })

    it("should copy page", async () => {
      try {
        let pageId = stories[0]['pages'][0]
        let story = stories[3]
        let user = authors[0]

        let beforeStory = await Story.findOneActiveById(story._id)
        expect(beforeStory.pages).to.not.includes(pageId)

        let response = await pageHndl.copy(pageId, story, user._id)
        expect(response).to.have.property('author')
        expect(response.author).to.have.property('_id').and.deep.equal(ObjectId(user._id))
        expect(response).to.have.property('title').and.equal('page Copy')

        let afterStory = await Story.findOneActiveById(story._id)

        expect(afterStory.pages.length).to.be.greaterThan(beforeStory.pages.length)
        expect(afterStory.pages.length - beforeStory.pages.length).to.equals(1)

        let afterStories = await Story.find({pages: pageId})
        expect(afterStories.length).to.equals(1)

      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it("should move page", async () => {
      try {
        let pageId = stories[0]['pages'][0]
        let story = stories[3]
        let user = authors[0]
        let removePage = true

        let oldStory = await Story.findOne({pages: pageId, active: true, deleted: false})
        expect(oldStory.pages).to.includes(pageId)

        let beforeStory = await Story.findOneActiveById(story._id)

        let response = await pageHndl.copy(pageId, story, user._id, removePage)
        expect(response).to.have.property('author')
        expect(response.author).to.have.property('_id').and.deep.equal(ObjectId(user._id))
        expect(response).to.have.property('title').and.equal('page Copy')

        let afterStory = await Story.findOneActiveById(story._id)

        expect(afterStory.pages.length).to.be.greaterThan(beforeStory.pages.length)
        expect(afterStory.pages.length - beforeStory.pages.length).to.equals(1)

        let afterStories = await Story.find({pages: pageId, active: true, deleted: false})
        expect(afterStories.length).to.equals(0)

      } catch (err) {
        expect(err).to.not.exist
      }
    })

  })

  describe('Create and update page functions', () => {
    let cp = pages[1]
    it('Should create page', async () => {
      let paramsCreate = [
        cp.author,
        cp.title,
        cp.dateFrom,
        cp.dateTo,
        cp.place,
        null,
        cp.content,
        cp.matchId,
      ]
      const page = await pageHndl.create(...paramsCreate)
      assert.isNotEmpty(page)
      page.should.not.be.type(undefined).should.be.type('object')
      page.should.have.property("author")
      page['author'].should.not.be.type(undefined).should.be.type('object')
      page.should.have.property('title')
      page.should.have.property('dateFrom')
      page.should.have.property('dateTo')
      page.should.have.property('place')
      page.should.have.property('content')
      page.should.have.property('matchId')
      page.should.have.property('active')
      assert.strictEqual(page.active, true)
      page.should.have.property('deleted')
      assert.strictEqual(page.deleted, false)
    })

    it('Should create page, and update existing page', async () => {
      let cp = pages[2]
      let paramsCreate = [
        cp.author,
        cp.title,
        cp.dateFrom,
        cp.dateTo,
        cp.place,
        null,
        cp.content,
        cp.matchId,
      ]

      const page = await pageHndl.create(...paramsCreate)

      assert.isNotEmpty(page)
      page.should.not.be.type(undefined).should.be.type('object')
      page.should.have.property("author")
      page['author'].should.not.be.type(undefined).should.be.type('object')
      page.should.have.property('_id')
      assert.equal(page.id, cp._id)
      page.should.have.property('title')
      page.should.have.property('dateFrom')
      page.should.have.property('dateTo')
      page.should.have.property('place')
      page.should.have.property('content')
      page.should.have.property('matchId')
      assert.strictEqual(page.matchId, '3c2f0902-fca2-4283-b9a0-cd1bebe0a65d')
    })

    it('should create page if matchID not found', async () => {
      let author = authors[0]['id']
      let title = 'new page'
      let matchId = 'somethingnew1234'
      let pageData = [
        author, // author
        title, // title
        null, // dateFrom
        null, // dateTo
        null, // place
        null, // cover
        null, // content
        matchId, // matchId
      ]
      // before
      let beforePage = await Page.findOne({matchId})
      expect(beforePage).to.be.null

      let newPage = await pageHndl.create(...pageData)
      expect(newPage).to.exist.and.have.property('id')
      expect(newPage).to.exist.and.have.property('title').and.equal(title)
      expect(newPage).to.exist.and.have.property('matchId').and.equal(matchId)
      expect(newPage).to.exist.and.have.property('author')
      assert.deepEqual(newPage.author._id.toString(), author)
    })

    it('should update page if matchID found', async () => {

      let targetPage = pages[4]
      let targetMatchId = targetPage.matchId
      let title = 'brand new page created before'

      let newPage = await pageHndl.create(targetPage.author, title, null, null, null, null, null, targetMatchId)

      expect(newPage).to.exist
      assert.equal(newPage.id, targetPage.id)
      expect(newPage.author._id.toString()).to.equal(targetPage.author)
      expect(newPage.matchId).to.equal(targetPage.matchId)
      expect(newPage.title).to.equal(title)

    })

    it('Should create page without place', async () => {
      let paramsCreate = [
        cp.author,
        cp.title,
        cp.dateFrom,
        cp.dateTo,
        null,
        null,
        cp.content,
        cp.matchId,
      ]
      const page = await pageHndl.create(...paramsCreate)
      assert.isNotEmpty(page)
      page.should.not.be.type(undefined).should.be.type('object')
      page.should.have.property("author")
      page['author'].should.not.be.type(undefined).should.be.type('object')
      page.should.have.property('title')
      page.should.have.property('dateFrom')
      page.should.have.property('dateTo')
      page.should.have.property('place')
      page.should.have.property('content')
      page.should.have.property('matchId')
      page.should.have.property('active')
      assert.strictEqual(page.active, true)
      page.should.have.property('deleted')
      assert.strictEqual(page.deleted, false)
    })

  })

  describe('is user author or co-author', () => {
    it('should return true or false if user is author or co-author', () => {
      let user = authors[0]
      let story = stories[0]
      let res = pageHndl.isUserAuthorOrCoAuthor(user._id, story)
      expect(res).to.equal("author")

      user = authors[0]
      story = stories[1]
      res = pageHndl.isUserAuthorOrCoAuthor(user._id, story)
      expect(res).to.equal("author")

      user = authors[0]
      story = stories[2]
      res = pageHndl.isUserAuthorOrCoAuthor(user._id, story)
      expect(res).to.be.null

      user = authors[0]
      story = stories[3]
      res = pageHndl.isUserAuthorOrCoAuthor(user._id, story)
      expect(res).to.equal("collaborator")

    })
  })

  describe('remove page', () => {
    it('should return undefined if no story', async () => {
      try {
        let user = fixtures.collections.authors[0]
        let story = "593f94bd17d85a0e003d3c3B"
        let response = await pageHndl.removePage("", story)

        expect(response).to.be.undefined
      } catch (err) {
        expect(err).to.not.exist
      }
    })
    it('should return updated story', async () => {
      try {
        let user = fixtures.collections.authors[1]
        let story = fixtures.collections.stories[3]
        let page = story.pages[0]
        let response = await pageHndl.removePage(page, story._id)

        expect(response.pages.includes(page)).to.be.false

      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('all pages from author', () => {

    it('should not return all pages from author, author id missing', async () => {
      try {
        let authorId = ''
        await storyHndl.getAllAuthorPages(authorId)
      } catch (err) {
        should.exist(err)
        should(err).be.type('object')
        should(err).have.property('name')
        assert.equal(err.name, 'BadRequest')
        should(err).have.property('message')
        assert.equal(err.message, translate.__('Author ID missing'))
        should(err).have.property('statusCode')
        assert.equal(err.statusCode, 400)
      }
    })

    it('should return all pages from author', async () => {
      try {
        let author = fixtures.collections.authors[0]
        let results = await storyHndl.getAllAuthorPages(author._id)

        assert.equal(results.length, 7)
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

  })

  describe('findUrlsInContent', () => {
    let pageId = "5b20ffd1f8e4a20e006a1b42"

    it('should return all urls, gallery type', () => {
      let gallery = content.gallery
      let x = pageHndl.findUrlsInContent(gallery, pageId)

      expect(x).to.be.an('array').length(6)
      x.forEach(item => {
        expect(item.includes(pageId)).to.be.true
      })
    })
    it('should return all urls, video type', () => {
      let video = content.video
      let x = pageHndl.findUrlsInContent(video, pageId)

      expect(x).to.be.an('array').length(2)
      x.forEach(item => {
        expect(item.includes(pageId)).to.be.true
      })
    })
    it('should return all urls, image type', () => {
      let image = content.image
      let x = pageHndl.findUrlsInContent(image, pageId)

      expect(x).to.be.an('array').length(3)
      x.forEach(item => {
        expect(item.includes(pageId)).to.be.true
      })
    })
    it('should return all urls, audio type', () => {
      let audio = content.audio
      let x = pageHndl.findUrlsInContent(audio, pageId)

      expect(x).to.be.an('array').length(1)
      x.forEach(item => {
        expect(item.includes(pageId)).to.be.true
      })
    })
    it('should return all urls, giff type', () => {
      let recording = content.recording
      let x = pageHndl.findUrlsInContent(recording, pageId)

      expect(x).to.be.an('array').length(1)
      x.forEach(item => {
        expect(item.includes(pageId)).to.be.true
      })
    })
  })

  describe('remove content element', () => {

    it('should return error, page not found', async () => {
      try {
        let user = authors[0]
        let pageId
        let contentId
        let response = await pageHndl.removeContentElement(user, pageId, contentId)

        should.not.exist(response)

      } catch (err) {
        expect(err).to.be.an('object')
        assert.equal(err instanceof Error, true)
        expect(err.message).to.equal('Page not found')
        expect(err.statusCode).to.equal(422)
      }
    })

    it('should return error, user is not the author', async () => {
      try {
        let user = authors[1]
        let pageId = pages[0]['_id']
        let contentId
        let response = await pageHndl.removeContentElement(user, pageId, contentId)

        should.not.exist(response)

      } catch (err) {
        expect(err).to.be.an('object')
        assert.equal(err instanceof Error, true)
        expect(err.message).to.equal(translate.__('User is not the author'))
        expect(err.statusCode).to.equal(422)
      }
    })
    it('should return error, content not found', async () => {
      try {
        let user = authors[0]
        let pageId = pages[0]['_id']
        let contentId
        let response = await pageHndl.removeContentElement(user, pageId, contentId)

        should.not.exist(response)

      } catch (err) {
        expect(err).to.be.an('object')
        assert.equal(err instanceof Error, true)
        expect(err.message).to.equal(translate.__('Content not found'))
        expect(err.statusCode).to.equal(422)
      }
    })
    it('should return page, with deleted content', async () => {
      try {
        let user = authors[1]
        let page = pages[7]
        let pageId = page['_id']
        let contentId = pages[7]['content'][0]['contentId']

        //before
        expect(page.content).to.be.an('array').with.lengthOf(2)
        expect(page.content[0]['contentId']).to.deep.equals(contentId)

        let response = await pageHndl.removeContentElement(user, pageId, contentId)

        assert.equal(response instanceof Error, false)
        expect(response).to.be.an('object')
        expect(response.content).to.be.an('array').with.lengthOf(1)
        expect(response.content[0]['contentId']).to.not.equals(contentId)
      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('generate page title', () => {

    it('should create new title, title doesn\'t exist', async () => {
      try {
        let slug = await pageHndl.generateSlug('new title')

        slug.should.be.type('string')
        assert.equal(slug, 'new-title')
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should create new title, the title for existing page', async () => {
      try {
        let page = fixtures.collections.pages[0]
        let title = page.title || 'page'
        let slug = await pageHndl.generateSlug(title, page._id)

        slug.should.be.type('string')
        assert.equal(slug, 'page')
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should create new title, the same title for existing page', async () => {
      try {
        let page = fixtures.collections.pages.find(page => page['title'] == 'test page 1')
        let slug = await pageHndl.generateSlug(page.title, page._id)

        slug.should.be.type('string')
        assert.equal(slug, page.slug)
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should create new title, the title with incremented number in slug', async () => {
      try {
        let page = fixtures.collections.pages[0]
        let slug = await pageHndl.generateSlug('test page 1', page._id)

        slug.should.be.type('string')
        assert.equal(slug, 'test-page-1-2')
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

  })

  describe('insert single content element', () => {

    it('should not insert content element, author not found', async () => {
      try {
        await pageHndl.addContentElement(null)
      } catch (err) {
        should.exist(err)
        assert.equal(err.statusCode, 401)
        assert.equal(err.message, translate.__('Author not found'))
      }
    })

    it('should not insert content element, story not found', async () => {
      try {
        let author = fixtures.collections.authors[0]
        await pageHndl.addContentElement(author, null)
      } catch (err) {
        should.exist(err)
        assert.equal(err.statusCode, 422)
        assert.equal(err.message, translate.__('Story not found'))
      }
    })

    it('should not insert content element, author don\'t have permission', async () => {
      try {
        let author = fixtures.collections.authors[2]
        let story = fixtures.collections.stories[0]
        await pageHndl.addContentElement(author, story._id)
      } catch (err) {
        should.exist(err)
        assert.equal(err.statusCode, 422)
        assert.equal(err.message, translate.__('You don\'t have permission to edit this Story'))
      }
    })

    it('should not insert content element, page not found', async () => {
      try {
        let author = fixtures.collections.authors[0]
        let story = fixtures.collections.stories.find(story => {
          return story.author == author._id
        })
        let pageId = null
        await pageHndl.addContentElement(author, story._id, pageId)
      } catch (err) {
        should.exist(err)
        assert.equal(err.statusCode, 422)
        assert.equal(err.message, translate.__('Page not found'))
      }
    })

    it('should insert text content element', async () => {
      try {
        let author = fixtures.collections.authors[0]
        let story = fixtures.collections.stories.find(story => {
          return story.author == author._id
        })
        let page = fixtures.collections.pages[0]
        const type = 'text'
        const text = 'this is the text element'
        let content = {
          type: type,
          text: text
        }
        let result = await pageHndl.addContentElement(author, story._id, page._id, content)
        result.should.be.type('object')
        result.should.have.property('_id')
        result.should.have.property('content')
        // assert.equal(result.content.length, page.content.length + 1)
        const newElement = result.content[result.content.length - 1]
        assert.strictEqual(newElement.type, type)
        assert.strictEqual(newElement.text, text)
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

  })

  describe('update', () => {
    it('should return error if user is not author', async () => {
      try {
        let page = pages[0]
        let args = [
          '593f94bd17d85a0e003d3c00',
          page._id,
          'Updated Title!',
          page.place,
          page.theme.coverImage,
          null,
          page.dateFrom,
          page.dateTo,
          page.matchId
        ]

        let response = await pageHndl.update(...args)
        expect(response).to.not.exist

      } catch (err) {
        assert(err instanceof Error, true)
        expect(err.message).to.be.equal(translate.__('User is not the author'))
        assert(err.statusCode, 422)
      }
    })
    it('should return error if page not found', async () => {
      try {
        let page = pages[0]
        let author = authors[0]
        let args = [
          page.author,
          '593f94bd17d85a0e003d3c00',
          'Updated Title!',
          page.place,
          page.theme.coverImage,
          null,
          page.dateFrom,
          page.dateTo,
          page.matchId
        ]

        let response = await pageHndl.update(...args)
        expect(response).to.not.exist

      } catch (err) {
        assert(err instanceof Error, true)
        expect(err.message).to.be.equal(translate.__('Page not found'))
        assert(err.statusCode, 422)
      }
    })
    it('should update page', async () => {
      try {
        let page = pages[0]
        let author = authors[0]
        let args = [
          page.author,
          page._id,
          'Updated Title!',
          page.place,
          null,
          page.content,
          page.dateFrom,
          page.dateTo,
          page.matchId
        ]

        let response = await pageHndl.update(...args)
        expect(response.author._id.toString()).to.equal(args[0])
        expect(response._id.toString()).to.equal(args[1])
        expect(response.title).to.equal(args[2])
        expect(response.content).to.deep.equal(args[5])
        expect(new Date(response.dateFrom)).to.deep.equal(new Date(Number(args[6])))
        expect(new Date(response.dateTo)).to.deep.equal(new Date(Number(args[7])))
        expect(response.matchId).to.equal(args[8])

      } catch (err) {
        console.log(err)
        expect(err).to.not.exist
      }
    })
  })

  describe('deletePage', () => {
     it('should return error, page not found', async () => {
      try {
        let user = authors[0]
        let story = stories[0]
        let pageId = stories[0] // fake pageId
        let result = await pageHndl.deletePage(user._id, story._id, pageId)
        expect(result).to.not.exist
      } catch (err) {
        should.exist(err)
        assert.equal(err.statusCode, 422)
        assert.equal(err.message, translate.__('Page not found'))
      }
    })
     it('should return error, author doesn\'t have permission', async () => {
      try {
        let user = authors[1]
        let story = stories[0]
        let pageId = stories[0]['pages'][0]
        let result = await pageHndl.deletePage(user._id, story._id, pageId)
        expect(result).to.not.exist
      } catch (err) {
        should.exist(err)
        assert.equal(err.statusCode, 422)
        assert.equal(err.message, translate.__('You don\'t have permission for this action'))
      }
    })
     it('should return error, story not found', async () => {
      try {
        let user = authors[0]
        let story = authors[0] // fake storyID
        let pageId = stories[0]['pages'][0]
        let result = await pageHndl.deletePage(user._id, story._id, pageId)
        expect(result).to.not.exist
      } catch (err) {
        should.exist(err)
        assert.equal(err.statusCode, 422)
        assert.equal(err.message, translate.__('Story not found'))
      }
    })
    it('should delete page', async () => {
      try {
        let user = authors[0]
        let story = stories[0]
        let pageId = stories[0].pages[0]
        let todayBefore = new Date()
        let result = await pageHndl.deletePage(user._id, story._id, pageId)

        expect(result).to.equal(pageId)

      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

  })

  describe('Create new page', () => {
    let story
    let author
    let page

    before(async () => {
      await initAfter()
      author = await authorFaker({
        single: true
      })
      story = await storyFaker({
        single: true,
        author: author.id
      })
    })

    after(async () => {
      await initAfter()
    })

    it('should create page ', async () => {
      try {
        let title = 'new page'
        let matchId = 'somethingnew1234'
        let pageData = [
          author,
          story,
          title,
          null, // cover
          null, // dateFrom
          null, // dateTo
          null, // place
          [
            {
              type: 'text',
              text: 'This is text element',
              contentId: uuid.v1()
            }
          ],
          matchId,
          1,
          null // files
        ]

        const newPage = await pageHndl.newPage(...pageData)
        expect(newPage).to.exist.and.have.property('id')
        expect(newPage).to.exist.and.have.property('title').and.equal(title)
        expect(newPage).to.exist.and.have.property('matchId').and.equal(matchId)
        expect(newPage).to.exist.and.have.property('author')
        const pageAuthor = newPage.author
        pageAuthor.should.be.type('object')
        should(pageAuthor).have.property('id')
        should(pageAuthor).have.property('name')
        should(pageAuthor).have.property('username')
        should(pageAuthor).have.property('avatar')
      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
        throw err
      }
    })
  })

})
