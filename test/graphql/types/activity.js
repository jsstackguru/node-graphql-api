// assertions
import chai from 'chai'
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'
import chaiArrays from 'chai-arrays'
chai.use(chaiArrays)
// GQL Types
import { AuthorType } from '../../../src/GQLSchema/GQLTypes/authorType'
import { StoryType } from '../../../src/GQLSchema/GQLTypes/storyType'
import { PageType } from '../../../src/GQLSchema/GQLTypes/pageType'
import { ActivityType, ActivityTabType, ActivityTypePaginate } from '../../../src/GQLSchema/GQLTypes/activityType'
import graphQLJSON from 'graphql-type-json'
// fixtures
import fixtures from '../../fixtures'
// GQL objects types
import {
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLInt
} from 'graphql'
import { initAfter, initBefore } from '../../setup'

const authors = fixtures.collections.authors
const pages = fixtures.collections.pages
const stories = fixtures.collections.stories

describe('Activity types', () => {
  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('ActivityType', () => {
    it('should have id field of type String', () => {
      expect(ActivityType.getFields()).to.have.property('id')
      expect(ActivityType.getFields().id.type).to.deep.equals(GraphQLID)
    })
    it('should have created field of type String', () => {
      expect(ActivityType.getFields()).to.have.property('created')
      expect(ActivityType.getFields().created.type).to.deep.equals(GraphQLString)
    })
    it('should have type field of type String', () => {
      expect(ActivityType.getFields()).to.have.property('type')
      expect(ActivityType.getFields().type.type).to.deep.equals(GraphQLString)
    })
    it('should have author field of type Author', () => {
      expect(ActivityType.getFields()).to.have.property('author')
      expect(ActivityType.getFields().author.type).to.deep.equals(AuthorType)
    })
    it('should have story field of type Story', () => {
      expect(ActivityType.getFields()).to.have.property('story')
      expect(ActivityType.getFields().story.type).to.deep.equals(StoryType)
    })
    it('should have collaborator field of type Author', () => {
      expect(ActivityType.getFields()).to.have.property('collaborator')
      expect(ActivityType.getFields().collaborator.type).to.deep.equals(AuthorType)
    })
    it('should have page field of type Page', () => {
      expect(ActivityType.getFields()).to.have.property('page')
      expect(ActivityType.getFields().page.type).to.deep.equals(PageType)
    })
    it('should have contents field of type JSON[]', () => {
      expect(ActivityType.getFields()).to.have.property('contents')
      expect(ActivityType.getFields().contents.type).to.deep.equals(new GraphQLList(graphQLJSON))
    })
    it('should have message field of type String', () => {
      expect(ActivityType.getFields()).to.have.property('message')
      expect(ActivityType.getFields().message.type).to.deep.equals(GraphQLString)
    })
  })

  describe('ActivityTabType', () => {
    it('should have timeline field of type String', () => {
      expect(ActivityTabType.getFields()).to.have.property('timeline')
      expect(ActivityTabType.getFields().timeline.type).to.deep.equals(GraphQLInt)
    })
    it('should have social field of type String', () => {
      expect(ActivityTabType.getFields()).to.have.property('social')
      expect(ActivityTabType.getFields().social.type).to.deep.equals(GraphQLInt)
    })
    it('should have collaboration field of type String', () => {
      expect(ActivityTabType.getFields()).to.have.property('collaboration')
      expect(ActivityTabType.getFields().collaboration.type).to.deep.equals(GraphQLInt)
    })
  })

  describe('ActivityTypePaginate', () => {
    it('should have docs field of type Activity[]', () => {
      expect(ActivityTypePaginate.getFields()).to.have.property('docs')
      expect(ActivityTypePaginate.getFields().docs.type).to.deep.equals(new GraphQLList(ActivityType))
    })
    it('should have total field of type String', () => {
      expect(ActivityTypePaginate.getFields()).to.have.property('total')
      expect(ActivityTypePaginate.getFields().total.type).to.deep.equals(GraphQLInt)
    })
    it('should have limit field of type String', () => {
      expect(ActivityTypePaginate.getFields()).to.have.property('limit')
      expect(ActivityTypePaginate.getFields().limit.type).to.deep.equals(GraphQLInt)
    })
    it('should have page field of type String', () => {
      expect(ActivityTypePaginate.getFields()).to.have.property('page')
      expect(ActivityTypePaginate.getFields().page.type).to.deep.equals(GraphQLInt)
    })
    it('should have pages field of type String', () => {
      expect(ActivityTypePaginate.getFields()).to.have.property('pages')
      expect(ActivityTypePaginate.getFields().pages.type).to.deep.equals(GraphQLInt)
    })
  })

  describe('author resolver', () => {
    const authorResolve = ActivityType.getFields().author.resolve

    it('should return author based on activity authorID', async () => {
      try {
        let activity = {
          author: authors[0]['id']
        }

        let res = await authorResolve(activity)

        expect(res).to.have.property('_id')
        assert.equal(res._id.toString() === activity.author, true)
        expect(res).to.have.property('name')
        expect(res).to.have.property('bio')
        expect(res).to.have.property('username')
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('story resolver', () => {
    const storyResolve = ActivityType.getFields().story.resolve

    it('should return story based on activity data', async () => {
      try {
        let activity = {
          author: authors[0]['id'],
          data: {
            storyId: stories[0]['id']
          }
        }

        let res = await storyResolve(activity)

        expect(res).to.have.property('_id')
        assert.equal(res._id.toString() === activity.data.storyId, true)
        expect(res).to.have.property('title')
        expect(res).to.have.property('status')
        expect(res).to.have.property('pages')
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('collaborator resolver', () => {
    const collaboratorResolve = ActivityType.getFields().collaborator.resolve

    it('should return collaborator based on activity collaboratorID', async () => {
      try {
        let activity = {
          author: authors[0]['id'],
          data: {
            collaboratorId: authors[0]['id']
          }
        }

        let res = await collaboratorResolve(activity)

        expect(res).to.have.property('_id')
        assert.equal(res._id.toString() === activity.data.collaboratorId, true)
        expect(res).to.have.property('name')
        expect(res).to.have.property('bio')
        expect(res).to.have.property('username')
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('page resolver', () => {
    const pageResolve = ActivityType.getFields().page.resolve

    it('should return page based on activity pageId', async () => {
      try {
        let activity = {
          author: authors[0]['id'],
          data: {
            collaboratorId: authors[0]['id'],
            pageId: pages[0]['_id']
          }
        }

        let res = await pageResolve(activity)

        expect(res).to.have.property('_id')
        assert.equal(res._id.toString() === activity.data.pageId, true)
        expect(res).to.have.property('title')
        expect(res).to.have.property('author')
        expect(res).to.have.property('content')
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('contents resolver', () => {
    const contentsResolver = ActivityType.getFields().contents.resolve

    it('should return null if contents is not provided', async () => {
      try {
        let page = pages[8]
        let contents = ''

        let args = {
          filters: ['audios', 'videos', 'images']
        }
        let activity = {
          author: authors[0]['id'],
          data: {
            collaboratorId: authors[0]['id'],
            pageId: page['_id'],
            contents
          }
        }

        let res = await contentsResolver(activity, args)
        expect(res).to.be.null
      } catch (err) {
        expect(err).to.not.exist
      }
    })
    it('should return page contents based on activity pageId', async () => {
      try {

        let page = pages[8]
        let contents = page.content.map(p => p['contentId'])

        let args = {
          filters: ['audios', 'videos', 'images']
        }
        let activity = {
          author: authors[0]['id'],
          data: {
            collaboratorId: authors[0]['id'],
            pageId: page['_id'],
            contents
          }
        }

        let res = await contentsResolver(activity, args)

        res.forEach(content => {
          expect(content).to.have.property('type')
          expect(content).to.have.property('contentId')
        })
      } catch (err) {
        expect(err).to.not.exist
      }
    })
    it('should return page filtered contents based on activity pageId', async () => {
      try {

        let page = pages[8]
        let contents = page.content.map(p => p['contentId'])

        let args = {
          filters: ['audios', 'images']
        }
        let activity = {
          author: authors[0]['id'],
          data: {
            collaboratorId: authors[0]['id'],
            pageId: page['_id'],
            contents
          }
        }

        let res = await contentsResolver(activity, args)

        let types = {
          audios: ['audio', 'recording'],
          videos: ['video', 'gif'],
          images: ['image', 'gallery']
        }
        let usedTypes = args.filters.map(t => types[t]).reduce((prev, curr) => prev.concat(curr), [])

        res.forEach(content => {
          expect(content).to.have.property('type')
          expect(content).to.have.property('contentId')
          expect(usedTypes).to.include(content.type)
        })


      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })
})
