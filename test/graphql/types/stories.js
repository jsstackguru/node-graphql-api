// assertions
import chai from 'chai'
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'
import chaiArrays from 'chai-arrays'
chai.use(chaiArrays)
// GQL Types
import { AuthorType } from '../../../src/GQLSchema/GQLTypes/authorType'
import {
  StoryType,
  StoryCollaboratorsType,
  StoryCollaboratorsTypePaginate,
  StoryTypePaginate
} from '../../../src/GQLSchema/GQLTypes/storyType'
import { PageType } from '../../../src/GQLSchema/GQLTypes/pageType'
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

describe('Story types', () => {
  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('StoryType', () => {
    it('should have id field of type Id', () => {
      expect(StoryType.getFields()).to.have.property('id')
      expect(StoryType.getFields().id.type).to.deep.equals(GraphQLID)
    })
    it('should have title field of type String', () => {
      expect(StoryType.getFields()).to.have.property('title')
      expect(StoryType.getFields().title.type).to.deep.equals(GraphQLString)
    })
    it('should have status field of type String', () => {
      expect(StoryType.getFields()).to.have.property('status')
      expect(StoryType.getFields().status.type).to.deep.equals(GraphQLString)
    })
    it('should have deleted field of type String', () => {
      expect(StoryType.getFields()).to.have.property('deleted')
      expect(StoryType.getFields().deleted.type).to.deep.equals(GraphQLString)
    })
    it('should have active field of type String', () => {
      expect(StoryType.getFields()).to.have.property('active')
      expect(StoryType.getFields().active.type).to.deep.equals(GraphQLString)
    })
    it('should have created field of type String', () => {
      expect(StoryType.getFields()).to.have.property('created')
      expect(StoryType.getFields().created.type).to.deep.equals(GraphQLString)
    })
    it('should have updated field of type String', () => {
      expect(StoryType.getFields()).to.have.property('updated')
      expect(StoryType.getFields().updated.type).to.deep.equals(GraphQLString)
    })
    it('should have slug field of type String', () => {
      expect(StoryType.getFields()).to.have.property('slug')
      expect(StoryType.getFields().slug.type).to.deep.equals(GraphQLString)
    })
    it('should have views field of type String', () => {
      expect(StoryType.getFields()).to.have.property('views')
      expect(StoryType.getFields().views.type).to.deep.equals(GraphQLInt)
    })
    it('should have spam field of type String', () => {
      expect(StoryType.getFields()).to.have.property('spam')
      expect(StoryType.getFields().spam.type).to.deep.equals(GraphQLInt)
    })
    it('should have author field of type String', () => {
      expect(StoryType.getFields()).to.have.property('author')
      expect(StoryType.getFields().author.type).to.deep.equals(AuthorType)
    })
    it('should have collaborators field of type StoryCollaboratorsType', () => {
      expect(StoryType.getFields()).to.have.property('collaborators')
      expect(StoryType.getFields().collaborators.type).to.deep.equals(new GraphQLList(StoryCollaboratorsType))
    })
    it('should have pages field of type Page', () => {
      expect(StoryType.getFields()).to.have.property('pages')
      expect(StoryType.getFields().pages.type).to.deep.equals(new GraphQLList(PageType))
    })
  })

  describe('StoryCollaboratorsType', () => {
    it('should have id field of type Id', () => {
      expect(StoryCollaboratorsType.getFields()).to.have.property('id')
      expect(StoryType.getFields().id.type).to.deep.equals(GraphQLID)
    })
    it('should have edit field of type String', () => {
      expect(StoryCollaboratorsType.getFields()).to.have.property('edit')
      expect(StoryCollaboratorsType.getFields().edit.type).to.deep.equals(GraphQLString)
    })
  })

  describe('StoryTypePaginate', () => {
    it('should have docs field of type Story[]', () => {
      expect(StoryTypePaginate.getFields()).to.have.property('docs')
      expect(StoryTypePaginate.getFields().docs.type).to.deep.equals(new GraphQLList(StoryType))
    })
    it('should have total field of type String', () => {
      expect(StoryTypePaginate.getFields()).to.have.property('total')
      expect(StoryTypePaginate.getFields().total.type).to.deep.equals(GraphQLInt)
    })
    it('should have limit field of type String', () => {
      expect(StoryTypePaginate.getFields()).to.have.property('limit')
      expect(StoryTypePaginate.getFields().limit.type).to.deep.equals(GraphQLInt)
    })
    it('should have page field of type String', () => {
      expect(StoryTypePaginate.getFields()).to.have.property('page')
      expect(StoryTypePaginate.getFields().page.type).to.deep.equals(GraphQLInt)
    })
    it('should have pages field of type String', () => {
      expect(StoryTypePaginate.getFields()).to.have.property('pages')
      expect(StoryTypePaginate.getFields().pages.type).to.deep.equals(GraphQLInt)
    })
  })

  describe('StoryCollaboratorsTypePaginate', () => {
    it('should have docs field of type StoryCollaborators[]', () => {
      expect(StoryCollaboratorsTypePaginate.getFields()).to.have.property('docs')
      expect(StoryCollaboratorsTypePaginate.getFields().docs.type).to.deep.equals(new GraphQLList(StoryCollaboratorsType))
    })
    it('should have total field of type String', () => {
      expect(StoryCollaboratorsTypePaginate.getFields()).to.have.property('total')
      expect(StoryCollaboratorsTypePaginate.getFields().total.type).to.deep.equals(GraphQLInt)
    })
    it('should have limit field of type String', () => {
      expect(StoryCollaboratorsTypePaginate.getFields()).to.have.property('limit')
      expect(StoryCollaboratorsTypePaginate.getFields().limit.type).to.deep.equals(GraphQLInt)
    })
    it('should have page field of type String', () => {
      expect(StoryCollaboratorsTypePaginate.getFields()).to.have.property('page')
      expect(StoryCollaboratorsTypePaginate.getFields().page.type).to.deep.equals(GraphQLInt)
    })
    it('should have pages field of type String', () => {
      expect(StoryCollaboratorsTypePaginate.getFields()).to.have.property('pages')
      expect(StoryCollaboratorsTypePaginate.getFields().pages.type).to.deep.equals(GraphQLInt)
    })
  })

  describe('author resolver', () => {
    const authorResolve = StoryType.getFields().author.resolve

    it('should return author based on authorId', async () => {
      try {
        let story = {
          author: authors[0]['id'],
        }

        let res = await authorResolve(story)

        expect(res).to.have.property('_id')
        assert.equal(res._id.toString() === story.author, true)
        expect(res).to.have.property('name').and.equals(authors[0]['name'])
        expect(res).to.have.property('username').and.equals(authors[0]['username'])
        expect(res).to.have.property('bio').and.equals(authors[0]['bio'])
        //  ...
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('collaborators resolver', () => {
    const collaboratorsResolve = StoryType.getFields().collaborators.resolve

    it('should return collaborators based on story', async () => {
      try {
        let story = stories[6]
        let args = {}

        let res = await collaboratorsResolve(story, args)

        // expect(res).to.have.property('limit').and.equals(4)
        // expect(res).to.have.property('page').and.equals(1)
        // expect(res).to.have.property('pages').and.equals(1)
        // expect(res).to.have.property('total').and.equals(1)
        // expect(res).to.have.property('docs').and.lengthOf(1)
        expect(res).to.deep.equals(story.collaborators)

      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('pages resolver', () => {
    const pagesResolver = StoryType.getFields().pages.resolve

    it('should return pages based on story', async () => {
      try {
        let story = {
          pages: stories[0]['pages']
        }
        let args = {}

        let res = await pagesResolver(story, args)

        expect(res).to.have.lengthOf(2)
        assert.equal(story.pages.length, res.length)
        res.forEach(page => {
          expect(story.pages).includes(page._id.toString())
        })
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('author resolver', () => {
    const authorResolver = StoryCollaboratorsType.getFields().author.resolve

    it('should return pages based on story', async () => {
      try {
        let parent = {
          author: authors[0]['_id']
        }
        let args = {}

        let res = await authorResolver(parent, args)

        expect(res._id.toString()).to.equals(parent.author)
        expect(res).to.have.property('name')
        expect(res).to.have.property('username')
        expect(res).to.have.property('bio')
        // ...
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })


})
