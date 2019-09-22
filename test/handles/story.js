/**
 * @file Tests for story handles
 * @author Nikola Miljkovic <mnikson@storyr.com>
 * @version 1.0
 */

import should from 'should'
import { assert, expect } from 'chai'
import mongoose from 'mongoose'
// Models
import Story from '../../src/models/story/story.model'
import { Favorite } from '../../src/models/favorite'
// Handlers
import storyHndl from '../../src/handles/story.handles'
// Libraries
import translate from '../../src/lib/translate'
import fixtures from '../fixtures'
// services
import { initBefore, initAfter } from '../setup'
// Fakers
import { authorFaker, favoriteFaker, storyFaker } from '../fixtures/faker'

// var storyHndl
const ObjectId = mongoose.Types.ObjectId

const authors = fixtures.collections.authors
const pages = fixtures.collections.pages
const stories = fixtures.collections.stories

describe('Stories handles tests...', function () {

  describe('getAllAuthorsStory', () => {

    before(async () => {
      await initAfter()
      await initBefore()
    })

    after(async () => {
      await initAfter()
    })

    it('should not return all stories from author, author id missing', async () => {
      try {
        let authorId = ''
        let results = await storyHndl.getAllAuthorStories(authorId)
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

    it('should return all stories from author', async () => {
      try {
        let authorId = '58eb78b94b432a21008c2346'
        let results = await storyHndl.getAllAuthorStories(authorId)

        assert.equal(results.length, 4)
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

  })

  describe('export data from author\'s stories', () => {

    before(async () => {
      await initAfter()
      await initBefore()
    })

    after(async () => {
      await initAfter()
    })

    it('should not return storage data, author id missing', async () => {
      try {
        let data = await storyHndl.exportAllStories()
      } catch (err) {
        should.exist(err)
        should(err).be.type('object')
        should(err).have.property('message')
        assert.equal(err.message, translate.__('Author ID missing'))
        should(err).have.property('name')
        assert.equal(err.name, 'BadRequest')
        should(err).have.property('statusCode')
        assert.equal(err.statusCode, 400)
      }
    })

    it('should return storage data, with preview', async () => {
      try {
        let author = authors[0]
        let result = await storyHndl.exportAllStories(author._id, true)

        // console.log('result', result)
        should(result).be.type('object')
        should(result).have.property('totalSize')
        expect(result.totalSize).greaterThan(0)
        should(result).have.property('fileTree')
        expect(result.fileTree).not.null

      } catch (err) {
        // console.log(err)
        should.not.exist(err)
        throw err
      }
    })

  })

  describe('download and export content from author\'s data', () => {

    before(async () => {
      await initAfter()
      await initBefore()
    })

    after(async () => {
      await initAfter()
    })

    it('should return file tree', async () => {
      try {
        let author = authors[0]
        let result = await storyHndl.downloadExportedStories(author._id)

        result.should.be.type('string')

      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

  })

  describe('create story', () => {

    before(async () => {
      await initAfter()
      await initBefore()
    })

    after(async () => {
      await initAfter()
    })

    it('should not create story, title missing', async() => {
      try {
        // (user, title, privacyType, cover, collaborators, page, pageCover, contents, files)
        const author = authors[0]
        const page = pages[1]
        const data = [
          author,
          'New Entity',
          'private',
          null,
          [],
          {},
          null,
          [{
            type: 'text',
            text: 'This is the text element',
          }],
        ]
        let story = await storyHndl.create(...data)

      } catch (err) {
        console.log('err', err)
        should.exist(err)
        assert.strictEqual(err.statusCode, 400)
        assert.strictEqual(err.name, 'BadRequest')
        assert.strictEqual(err.message, 'Story title can not be empty')
      }
    })

    it('should not create story, page not found', async() => {
      try {
        const author = authors[0]
        // (user, title, privacyType, cover, collaborators, page, pageCover, contents, files)
        const data = [
          author,
          'New Entity',
          'private',
          null,
          [],
          {},
          null,
          [{
            type: 'text',
            text: 'This is the text element',
          }],
        ]
        let story = await storyHndl.create(...data)

      } catch (err) {
        should.exist(err)
        assert.strictEqual(err.statusCode, 422)
        assert.strictEqual(err.name, 'UnprocessableEntity')
        assert.strictEqual(err.message, 'Page is not found')
      }
    })

    it('should create story', async() => {
      try {
        const author = authors[0]
        // (user, title, privacyType, cover, collaborators, page, pageCover, contents, files)
        const data = [
          author,
          'New Entity',
          'private',
          null,
          [],
          {
            title: 'New entity page'
          },
          null,
          [{
            type: 'text',
            text: 'This is the text element',
          }],
        ]
        let story = await storyHndl.create(...data)
        should.exist(story)
        story.should.be.type('object')
        story.should.have.property('id')
        story.should.have.property('title')
        story.should.have.property('status')
        assert.strictEqual(story.status, 'private')
        story.should.have.property('pages')
        assert.equal(story.pages.length, 1)
        const page = story.pages[0]
        should(page).have.property('_id')
        should(page).have.property('title')
        should(page).have.property('content')
        assert.strictEqual(story.pages.length, 1)
      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
        throw err
      }
    })

  })

  describe('update story', () => {

    before(async () => {
      await initAfter()
      await initBefore()
    })

    after(async () => {
      await initAfter()
    })

    it('should not update story, not found', async() => {
      try {
        let author = authors[0]
        let story = await storyHndl.update(author)
      } catch (err) {
        should.exist(err)
        assert.strictEqual(err.statusCode, 422)
        assert.strictEqual(err.errorCode, 422)
        assert.strictEqual(err.name, 'UnprocessableEntity')
        assert.strictEqual(err.message, translate.__('Story not found'))
      }
    })

    it('should not update story, permission error', async() => {
      try {
        let author = authors[3]
        let targetStory = stories[3]
        let story = await storyHndl.update(author, targetStory._id)
      } catch (err) {
        should.exist(err)
        assert.strictEqual(err.statusCode, 401)
        assert.strictEqual(err.errorCode, 401)
        assert.strictEqual(err.name, 'Unauthorized')
        assert.strictEqual(err.message, translate.__('You don\'t have permission to update this Story'))
      }
    })


    it('should not update story, title missing', async() => {
      try {
        let author = authors[0]
        let targetStory = stories[0]
        let story = await storyHndl.update(author, targetStory._id, null)
      } catch (err) {
        should.exist(err)
        assert.strictEqual(err.statusCode, 400)
        assert.strictEqual(err.errorCode, 400)
        assert.strictEqual(err.name, 'BadRequest')
        assert.strictEqual(err.message, translate.__('Story title is required'))
      }
    })

    //  user, id, title, privacyType, pageIds, collaborators, cover
    it('should update story', async() => {
      try {
        const author = authors[0]
        const targetStory = stories[0]
        const newTitle = 'Updated title'

        let story = await storyHndl.update(author, targetStory._id, newTitle)

        should(story).be.type('object')
        should(story).have.property('id')
        should(story).have.property('title')
        assert.strictEqual(story.title, newTitle)
        should(story).have.property('status')
        assert.strictEqual(story.status, targetStory.status)
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

  })

  describe('generateSlug function', () => {

    before(async () => {
      await initAfter()
      await initBefore()
    })

    after(async () => {
      await initAfter()
    })

    it('should generate slug for new story', async () => {
      try {
        const slug = await storyHndl.generateSlug('New Entity Slug')
        should(slug).be.type('string')
        assert.strictEqual(slug, 'new-entity-slug')
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should generate new slug the same like existing story', async () => {
      try {
        const slug = await storyHndl.generateSlug('Story #2')
        should(slug).be.type('string')
        assert.strictEqual(slug, 'story-2-2')
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should generate new slug for existing story', async () => {
      try {
        const story = stories[0]
        const slug = await storyHndl.generateSlug('Story #1', story._id)
        should(slug).be.type('string')
        assert.strictEqual(slug, 'story-1')
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

  })

  describe('getStorageSize should return storage data for author', () => {

    before(async () => {
      await initAfter()
      await initBefore()
    })

    after(async () => {
      await initAfter()
    })

    it('should return total size as 0kb', async () => {
      try {
        let size = storyHndl.getStorageSize([])

        assert.equal(size, 0)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return total size', async () => {
      try {
        let page = pages[0]
        let content = page.content
        // console.log('content', content)
        let size = storyHndl.getStorageSize(content)

        assert.equal(size, 122000)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should not include text elements in total size', async () => {
      try {
        let page = pages[2]
        let content = page.content
        // console.log('content', content)
        let size = storyHndl.getStorageSize(content)

        assert.equal(size, 0)
      } catch (err) {
        should.not.exist(err)
      }
    })

  })

  describe('createStoryCopy', () => {

    before(async () => {
      await initAfter()
      await initBefore()
    })

    after(async () => {
      await initAfter()
    })

    it('should return copy of story', async () => {

      const userId = authors[0]['_id']
      const story = stories[0]
      const storyTitle = story.title
      const pages = story.pages
      const response = await storyHndl.createStoryCopy(userId, story, pages)

      expect(response).to.be.an('object')
      expect(response).to.have.property('author')
      const author = response.author
      expect(author).to.have.property('_id')
      expect(author).to.have.property('name')
      expect(author).to.have.property('username')
      expect(author).to.have.property('avatar')
      assert.equal(author._id, userId)
      expect(response).to.have.property('title').and.equals('Copy of ' + storyTitle)
      const newPages = pages.map(p => ObjectId(p.id))
      assert.equal(newPages.length, story.pages.length)
      const page = response.pages[0]
      expect(page).to.have.property('_id')
      expect(page).to.have.property('title')
      expect(page).to.have.property('content')
      expect(response).to.have.property('collaborators').and.lengthOf(0)
      expect(response).to.have.property('created')
      expect(response).to.have.property('updated')
    })
  })

  describe('deleteStory', () => {

    after(async () => {
      await initAfter()
    })

    /**
     * before this test two authors are added to collaborators on Sajko's story,
     * Also, four pages from those authors are added too (3 from first author, and 1 from other one)
     */
    let modifiedStory = ''

    before( async () => {

      await initAfter()
      await initBefore()

      let sajkosStory = stories[7]
      let story = await Story.findOne({_id: sajkosStory.id})

      // add collaborators
      let coll1 = {
        author: authors[0]['_id'],
        edit: true
      }
      let coll2 = {
        author: authors[1]['_id'],
        edit: true
      }
      let newCollaborators = [coll1, coll2]
      story.collaborators = newCollaborators
      // add pages
      let newPages = []
      for (let i = 0; i < 4; i++) {
        newPages.push(pages[i]['_id'])
      }
      story.pages = newPages
      // save
      await story.save()
      // assign changed story to modifiedStory for all tests to use
      modifiedStory = story
    } )

    it('should return error, unauthorized', async () => {
      try {
        let user = authors[0]
        let story = stories[2]
        let result = await storyHndl.deleteStory(user._id, story._id)
        expect(result).to.not.exist
      } catch (err) {
        should.exist(err)
        assert.equal(err.statusCode, 401)
        assert.equal(err.message, translate.__('You don\'t have permission for this action'))
      }
    })
    it('should return modified/deleted story, and create new stories for each collaborator with their pages', async () => {
      try {
        let cDate = new Date()
        let authorId = modifiedStory.author

        let result = await storyHndl.deleteStory(authorId, modifiedStory._id)

        expect(result).to.be.an('object')
        expect(result.author.toString()).to.equals(authorId.toString())
        expect(result.collaborators).to.have.lengthOf(0)
        expect(result.pages).to.have.lengthOf(0)
        expect(result.deleted).to.be.true
        expect(result.active).to.be.false

        let newStories = await Story.find({created: {$gte: cDate}})

        expect(newStories).to.exist.and.to.have.lengthOf(2)
        newStories.forEach(story => {
          assert(story.title.startsWith('Copy of ' + result.title), true)
          expect(story).to.have.property('pages').and.not.empty
          story.pages.forEach(page => {
            expect(modifiedStory.pages).to.include(page.toString())
          })
        })
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('setShareSettings', () => {
    before(async () => {
      await initAfter()
      await initBefore()
    })

    after(async () => {
      await initAfter()
    })

    it('should not update share settings, id is missing', async () => {
      try {
        const story = stories[0]
        const author = authors[0]
        await storyHndl.setShareSettings(author.id, null, 'private', {})
      } catch (err) {
        expect(err.message).to.equal(translate.__('Story not found'))
        expect(err.name).to.equal('UnprocessableEntity')
        expect(err.statusCode).to.equal(422)
        should.exist(err)
      }
    })

    it('should not update share settings, user is not the author', async () => {
      try {
        const story = stories[0]
        const author = authors[4]
        await storyHndl.setShareSettings(author.id, story.id, 'private', {})
      } catch (err) {
        expect(err.message).to.equal(translate.__('You are not the author of the Story'))
        expect(err.name).to.equal('Unauthorized')
        expect(err.statusCode).to.equal(401)
        should.exist(err)
      }
    })

    it('should update share settings, story is private', async () => {
      try {
        const story = stories[0]
        const author = authors[0]
        const shareSettings = {
          collaborators: false,
          followers: false,
          link: false,
          search: false
        }
        const result = await storyHndl.setShareSettings(author.id, story.id, 'private', shareSettings)
        expect(result.collaborators).equal(shareSettings.collaborators)
        expect(result.followers).equal(shareSettings.followers)
        expect(result.link).equal(shareSettings.link)
        expect(result.search).equal(shareSettings.search)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should update share settings, followers is on', async () => {
      try {
        const story = stories[0]
        const author = authors[0]
        const shareSettings = {
          collaborators: false,
          followers: true,
          link: false,
          search: false
        }
        const result = await storyHndl.setShareSettings(author.id, story.id, 'public', shareSettings)
        expect(result.collaborators).equal(false)
        expect(result.followers).equal(true)
        expect(result.link).equal(false)
        expect(result.search).equal(false)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should update share settings, story is public', async () => {
      try {
        const story = stories[0]
        const author = authors[0]
        const shareSettings = {
          collaborators: false,
          followers: false,
          link: false,
          search: false
        }
        const result = await storyHndl.setShareSettings(author.id, story.id, 'public')
        expect(result.collaborators).equal(true)
        expect(result.followers).equal(true)
        expect(result.link).equal(true)
        expect(result.search).equal(true)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should set story as a private again', async () => {
      try {
        const story = stories[1]
        const author = authors[0]
        const result = await storyHndl.setShareSettings(author.id, story.id, 'private')
        expect(result.collaborators).equal(false)
        expect(result.followers).equal(false)
        expect(result.link).equal(false)
        expect(result.search).equal(false)
      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('setFavorite', () => {
    const author = authors[0]
    const story = stories[0]

    before(async () => {
      await initAfter()
      await initBefore()
    })

    after(async () => {
      await initAfter()
    })

    it('should not create favorite, story not found', async () => {
      try {
        await storyHndl.setFavorite(null, author.id)
      } catch (err) {
        should.exist(err)
        should(err).be.type('object')
        expect(err.message).to.equal(translate.__('Story not found'))
        assert.equal(err.statusCode, 422)
        assert.equal(err.name, 'UnprocessableEntity')
      }
    })

    it('should not create favorite, author not found', async () => {
      try {
        await storyHndl.setFavorite(story.id, null)
      } catch (err) {
        should.exist(err)
        should(err).be.type('object')
        expect(err.message).to.equal(translate.__('Author not found'))
        assert.equal(err.statusCode, 422)
        assert.equal(err.name, 'UnprocessableEntity')
      }
    })

    it('should create favorite', async () => {
      try {
        const favorite = await storyHndl.setFavorite(story.id, author.id)
        should(favorite).be.type('object')
        expect(favorite).to.have.property('author')
        assert.deepEqual(favorite.author.equals(author.id), true)
        expect(favorite).to.have.property('story')
        assert.deepEqual(favorite.story.equals(story.id), true)
      } catch (err) {
        console.log(err)
        should.not.exist(err)
      }
    })

    it('should not create favorite, already favorite', async () => {
      try {
        await storyHndl.setFavorite(story.id, author.id)
      } catch (err) {
        should.exist(err)
        should(err).be.type('object')
        assert.deepEqual(err.statusCode, 422)
        assert.deepEqual(err.message, translate.__('This Story is the author\'s favorite already'))
        assert.deepEqual(err.name, 'UnprocessableEntity')
      }
    })
  })

  describe('getFavoritesByAuthor', () => {
    let authors
    let stories
    let favorites

    before(async () => {
      await initAfter()
      // insert authors
      authors = await authorFaker({n: 2})
      stories = await storyFaker({n: 3})
      favorites = stories.map(
        async story => await Favorite.create({
          author: authors[0],
          story: story.id
        })
      )
    })

    after(async () => {
      await initAfter()
    })

    it('should not return favorites stories', async () => {
      try {
        const favorites = await storyHndl.getFavoritesByAuthor(authors[1])
        assert.deepEqual(favorites.length, 0)
      } catch (err) {
        console.log(err)
        should.not.exist(err)
      }
    })

    it('should return favorites stories', async () => {
      try {
        const favorites = await storyHndl.getFavoritesByAuthor(authors[0])
        assert.deepEqual(favorites.length, 3)
      } catch (err) {
        console.log(err)
        should.not.exist(err)
      }
    })
  })

  describe('canAccessStory', () => { //TODO: finish this, add more cases

    describe('status private', () => {
      let authorId = ObjectId()
      let storyId = ObjectId()
      let collaboratorId = ObjectId()
      let storyArgs = {
        author: authorId,
        id: storyId,
        status: 'private',
        searchShare: true,
        linkShare: false,
        collaboratorsShare: false,
        collaborators: {
          edit: true,
          author: collaboratorId
        }
      }

      let story, author
      before(async () => {
        author = await authorFaker({ id: authorId })
        story = await storyFaker(storyArgs)
      })

      afterEach(async () => {
        await initAfter()
      })

      it('should access story if user is author', async () => {
        try {
          let result = await storyHndl.canAccessStory(story[0], authorId)
          expect(result).to.be.true
        } catch (err) {
          expect(err).to.not.exist
        }

      })

      it('should not access story if user is not author (even collaborators)', async () => {
        try {
          let author2Id = ObjectId()
          let users = [
            author2Id,
            collaboratorId
          ]
          for (let user of users) {
            let result = await storyHndl.canAccessStory(story[0], user)
            expect(result).to.be.false
          }

        } catch (err) {
          expect(err).to.not.exist
        }

      })

    })

    describe('status public, collaborators', () => {
      let authorId = ObjectId()
      let storyId = ObjectId()
      let collaboratorId = ObjectId()
      let storyArgs = {
        author: authorId,
        id: storyId,
        status: 'public',
        searchShare: true,
        linkShare: false,
        collaboratorsShare: false,
        collaborators: {
          edit: true,
          author: collaboratorId
        }
      }

      let story, author
      before(async () => {
        author = await authorFaker({ id: authorId })
        story = await storyFaker(storyArgs)
      })

      afterEach(async () => {
        await initAfter()
      })

      it('should access story if user is author or collaborator', async () => {
        try {
          let author2Id = ObjectId()
          let users = [
            authorId,
            author2Id,
            collaboratorId
          ]
          for (let user of users) {
            let result = await storyHndl.canAccessStory(story[0], user)
            expect(result).to.be.true
          }

        } catch (err) {
          expect(err).to.not.exist
        }

      })

    })

  })

  describe('unsetFavorite', () => {

    before(async () => {
      await initAfter()
      await initBefore()
    })

    after(async () => {
      await initAfter()
    })

    it('should not unfavorite story, story not found', async () => {
      try {
        const author = authors[0]

        await storyHndl.unsetFavorite(null, author.id)
      } catch (err) {
        assert.equal(err.statusCode, 422)
        assert.equal(err.name, 'UnprocessableEntity')
        assert.equal(err.message, translate.__('Story not found'))
        should.exist(err)
      }
    })

    it('should not unfavorite story, user don\'t have permission to story', async () => {
      try {
        const author = authors[0]
        const story = stories[2]

        await storyHndl.unsetFavorite(story.id, author.id)
      } catch (err) {
        assert.equal(err.statusCode, 422)
        assert.equal(err.name, 'UnprocessableEntity')
        assert.equal(err.message, translate.__('You don\'t have a permission to this Story'))
        should.exist(err)
      }
    })

    it('should unfavorite story', async () => {
      try {
        const author = authors[0]
        const story = stories[3]
        await favoriteFaker({
          story,
          author
        })
        const result = await storyHndl.unsetFavorite(story.id, author.id)
        should(result).be.type('object')
        assert.equal(result.story, story.id)
        assert.equal(result.author, author.id)
      } catch (err) {
        should.not.exist(err)
      }
    })
  })

})
