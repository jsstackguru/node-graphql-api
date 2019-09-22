// assertions
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'
import {initAfter, initBefore} from '../../setup'

// gql resolver
import storyQuery from '../../../src/GQLSchema/queries/story.query'

// fixtures
import fixtures from '../../fixtures'

// services
import { ObjectId } from 'mongodb'

// fakers
import authorFaker from '../../fixtures/faker/author/author.faker'
import storyFaker from '../../fixtures/faker/story/story.faker'

const stories = fixtures.collections.stories
const authors = fixtures.collections.authors

describe('Stories resolvers', () => {
  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('story', () => {
    const storyById = storyQuery.story.resolve

    it('should get story by id', async () => {

      const user = authors[0]
      const story = stories[0];

      let args = { id: story._id }
      let req = { user }

      let response = await storyById('', args, req)

      response.should.be.type('object')
      response.should.have.property('title').and.equal(story.title)
      response.should.have.property('_id')
      assert.deepEqual(response._id, ObjectId(story._id))
    })

    it('should not get story by id, unauthorized', async () => {
      try {
        const users = await authorFaker({
          n: 2
        })
        const story = await storyFaker({
          author: users[1]._id,
          status: 'private'
        })
        let args = { id: story[0]._id }
        let req = { user: ObjectId() }

        let response = await storyById('', args, req)
        response.should.be.type('object')
        response.should.have.property('name').and.equal('Forbidden')
        response.should.have.property('statusCode').and.equal(403)
      } catch (err) {
        console.log(err.stack)
        expect(err).to.not.exist
      }
    })

  })

  describe('myStories', () => {

    const myStories = storyQuery.myStories.resolve

    const req = {
      user: authors[1]
    }

    it('should return all stories from user', async () => {
      const args = {
        search: '',
      }

      const response = await myStories('', args, req)

      response.should.have.property('docs').and.have.type('object')
      const activeStories = stories.filter(r => r.deleted === false && r.author === req.user._id )
      response.docs.length.should.be.equal(activeStories.length).and.equal(response.total)

    })
    it('should return all deleted stories from user', async () => {
      const args = {
        search: '',
        deleted: 'true'
      }

      const response = await myStories('', args, req)

      response.should.have.property('docs').and.have.type('object')
      const deletedStories = stories.filter(r => r.deleted === true && r.author === req.user._id )
      response.docs.length.should.be.equal(deletedStories.length).and.equal(response.total)
      response.docs.forEach(story => {
        expect(story.deleted).to.be.true
      })

    })

    it('should match search criteria', async () => {
      // search text
      const queryString = 't'
      const regex = new RegExp(queryString)
      const args = {
        search: queryString,
      }
      // add search text to query
      args.search = queryString

      const response = await myStories('', args, req)

      // loop all stories to see if they match regex query string
      response.docs.forEach(item => {
        let final = regex.test(item.title)
        expect(final).to.be.true
      })
    })
  })

  describe('myCollaboration', () => {

    const myCollaboration = storyQuery.myCollaboration.resolve

    const req = {
      user: authors[1]
    }

    it('should return all stories where user is collaborator', async () => {
      const args = {
        search: '',
      }

      const response = await myCollaboration('', args, req)

      response.should.have.property('docs').and.have.type('object')
      response.docs.forEach(story => {
        let collaborator = story.collaborators.some(coll => coll.author.toString() === req.user.id && coll.edit === true)
        expect(collaborator).to.be.true
      })

    })
    it('should match search criteria', async () => {
      // search text
      const queryString = 't'
      const regex = new RegExp(queryString)
      const args = {
        search: queryString,
      }
      // add search text to query
      args.search = queryString

      const response = await myCollaboration('', args, req)

      // loop all stories to see if they match regex query string
      response.docs.forEach(item => {
        let final = regex.test(item.title)
        expect(final).to.be.true
      })
    })
  })

  describe('deletedStories', () => {
    const deletedStories = storyQuery.deletedStories.resolve

    it('should return deleted stories for logged user', async () => {
      try {
        const args = {}
        const req = {
          user: authors[0]
        }

        const response = await deletedStories('', args, req)
        response.should.have.property('docs').and.have.type('object')
        const delStories = stories.filter(r => r.deleted === true)
        response.docs.length.should.be.equal(delStories.length).and.equal(response.total)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return deleted stories for input ID ', async () => {
      try {
        const args = {
          id: authors[0]['_id']
        }
        const req = {}

        const response = await deletedStories('', args, req)
        response.should.have.property('docs').and.have.type('object')
        const delStories = stories.filter(r => r.deleted === true)
        response.docs.length.should.be.equal(delStories.length).and.equal(response.total)

      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('myFeed', () => {

    const myFeed = storyQuery.myFeed.resolve

    let req = {
      user: authors[1]
    }

    it('should return "shared" stories for logged user. Stories where user is collaborator with edit: false', async () => {

      const args = {
        selection: 'shared',
        search: ''
      }

      const response = await myFeed('', args, req)

      response.should.have.property('limit').and.have.type('number')
      response.should.have.property('page').and.have.type('number')
      response.should.have.property('pages').and.have.type('number')
      response.should.have.property('docs')
      expect(response.docs).to.be.an('array').that.is.not.empty

      // check to see if there is collaborator with the requested properties
      response.docs.forEach(stories => {
        let collaborator = stories.collaborators.find(coll => {
          return coll.author.toString() === req.user._id && coll.edit === false
        })
        assert.equal(collaborator.author, req.user._id)
        assert.equal(collaborator.edit, false)
      })
    })

    it('should return "followed" stories for logged user. Stories that user is following', async () => {

      req.user = authors[0]
      let args = {
        selection: 'followed',
        search: ''
      }

      let response = await myFeed('', args, req)
      // console.log(response)
      expect(response.docs).to.be.an('array').that.is.not.empty
    })
  })

  describe('authorsStories', () => {

    const authorsStories = storyQuery.authorsStories.resolve

    let req = {
      user: authors[1]
    }

    it('should return all stories for author', async () => {

      let args = {
        selection: 'author',
        id: authors[1]['_id']
      }

      let response = await authorsStories('', args, req)

      response.should.have.property('limit').and.have.type('number')
      response.should.have.property('page').and.have.type('number')
      response.should.have.property('pages').and.have.type('number')
      response.should.have.property('docs')
      expect(response.docs).to.be.an('array').that.is.not.empty

      response.docs.forEach(stories => {
        assert.equal(stories.author, args.id)
      })
    })
    it('should return all stories where author is collaborator', async () => {

      let args = {
        selection: 'collaborator',
        id: authors[1]['_id']
      }

      let response = await authorsStories('', args, req)
      response.should.have.property('limit').and.have.type('number')
      response.should.have.property('page').and.have.type('number')
      response.should.have.property('pages').and.have.type('number')
      response.should.have.property('docs')
      expect(response.docs).to.be.an('array').that.is.not.empty

      response.docs.forEach(stories => {
        let collaborator = stories.collaborators.filter(coll => coll.author.toString() === args.id && coll.edit === true)
        expect(collaborator).to.have.length.greaterThan(0)
      })
    })
    it('should return all public stories', async () => {

      let args = {
        selection: 'author',
        id: authors[0]['_id']
      }

      let response = await authorsStories('', args, req)
      response.should.have.property('limit').and.have.type('number')
      response.should.have.property('page').and.have.type('number')
      response.should.have.property('pages').and.have.type('number')
      response.should.have.property('docs')
      expect(response.docs).to.be.an('array').that.is.not.empty

      response.docs.forEach(story => {
        expect(story.status).to.equals('public')
      })
    })
    it('should return all public stories where user is collaborator', async () => {

      let args = {
        selection: 'collaborator',
        id: authors[0]['_id']
      }

      let response = await authorsStories('', args, req)
      response.should.have.property('limit').and.have.type('number')
      response.should.have.property('page').and.have.type('number')
      response.should.have.property('pages').and.have.type('number')
      response.should.have.property('docs')
      expect(response.docs).to.be.an('array').that.is.not.empty

      response.docs.forEach(story => {
        let collaborator = story.collaborators.some(coll => coll.author.toString() === args.id && coll.edit === true)
        expect(collaborator).to.be.true
        expect(story.status).to.equals('public')
      })
    })
  })

  describe('searchCollaborators', () => {

    const searchCollaborators = storyQuery.searchCollaborators.resolve
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

    it('should return error, story not found', async () => {
      try {
        const args = { id: ObjectId() }
        await searchCollaborators('', args, req)
      } catch (err) {
        should.exist(err)
        assert.equal(err.message, 'Story not found')
      }
    })

    it('should return collaborators on the story', async () => {
      try {
        const args = { id: story._id }
        const collaborators = await searchCollaborators('', args, req)
        expect(collaborators).to.have.property('docs')
        expect(collaborators).to.have.property('total')
        expect(collaborators).to.have.property('page')
        expect(collaborators).to.have.property('pages')
        const { docs, page, pages, total } = collaborators
        assert.equal(docs.length, 10)
        assert.equal(pages, 2)
        assert.equal(page, 1)
        assert.equal(total, 15)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return collaborators on the story by search', async () => {
      try {
        const args = {
          id: story._id,
          search: 'istory'
        }
        const collaborators = await searchCollaborators('', args, req)
        expect(collaborators).to.have.property('docs')
        expect(collaborators).to.have.property('total')
        expect(collaborators).to.have.property('page')
        expect(collaborators).to.have.property('pages')
        const { docs, page, pages } = collaborators
        assert.equal(docs.length, 2)
        assert.equal(pages, 1)
        assert.equal(page, 1)
      } catch (err) {
        should.not.exist(err)
      }
    })
  })
})
