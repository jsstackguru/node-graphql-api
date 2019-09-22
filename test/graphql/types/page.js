// assertions
import chai from 'chai'
import chaiHttp from 'chai-http'
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'
import chaiArrays from 'chai-arrays'
chai.use(chaiArrays)
// GQL Types
import { CommentType } from '../../../src/GQLSchema/GQLTypes/commentType'
import {
  PageType,
  PageShareType,
  PageThemeType,
  PagePlaceType,
  CommentContainerType,
  CommentContainerTypePaginate,
} from '../../../src/GQLSchema/GQLTypes/pageType'
import graphQLJSON from 'graphql-type-json'

// fixtures
import fixtures from '../../fixtures'

// GQL objects types
import {
  GraphQLString,
  GraphQLID,
  GraphQLInt
} from 'graphql'
import { initAfter, initBefore } from '../../setup'

const pages = fixtures.collections.pages
const comments = fixtures.collections.comments

describe('Page types', () => {
  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('PageType', () => {
    it('should have id field of type String', () => {
      expect(PageType.getFields()).to.have.property('id')
      expect(PageType.getFields().id.type).to.deep.equals(GraphQLID)
    })
    it('should have title field of type String', () => {
      expect(PageType.getFields()).to.have.property('title')
      expect(PageType.getFields().title.type).to.deep.equals(GraphQLString)
    })
    it('should have slug field of type String', () => {
      expect(PageType.getFields()).to.have.property('slug')
      expect(PageType.getFields().slug.type).to.deep.equals(GraphQLString)
    })
    it('should have created field of type String', () => {
      expect(PageType.getFields()).to.have.property('created')
      expect(PageType.getFields().created.type).to.deep.equals(GraphQLString)
    })
    it('should have updated field of type String', () => {
      expect(PageType.getFields()).to.have.property('updated')
      expect(PageType.getFields().updated.type).to.deep.equals(GraphQLString)
    })
    it('should have dateFrom field of type String', () => {
      expect(PageType.getFields()).to.have.property('dateFrom')
      expect(PageType.getFields().dateFrom.type).to.deep.equals(GraphQLString)
    })
    it('should have dateTo field of type String', () => {
      expect(PageType.getFields()).to.have.property('dateTo')
      expect(PageType.getFields().dateTo.type).to.deep.equals(GraphQLString)
    })
    it('should have status field of type String', () => {
      expect(PageType.getFields()).to.have.property('status')
      expect(PageType.getFields().status.type).to.deep.equals(GraphQLString)
    })
    it('should have deleted field of type String', () => {
      expect(PageType.getFields()).to.have.property('deleted')
      expect(PageType.getFields().deleted.type).to.deep.equals(GraphQLString)
    })
    it('should have active field of type String', () => {
      expect(PageType.getFields()).to.have.property('active')
      expect(PageType.getFields().active.type).to.deep.equals(GraphQLString)
    })
    it('should have content field of type JSON', () => {
      expect(PageType.getFields()).to.have.property('content')
      expect(PageType.getFields().content.type).to.deep.equals(graphQLJSON)
    })
    it('should have comments field of type CommentContainerTypePaginate', () => {
      expect(PageType.getFields()).to.have.property('comments')
      expect(PageType.getFields().comments.type).to.deep.equals(CommentContainerTypePaginate)
    })
    it('should have matchId field of type ID', () => {
      expect(PageType.getFields()).to.have.property('matchId')
      expect(PageType.getFields().matchId.type).to.deep.equals(GraphQLID)
    })
    it('should have theme field of type themeType', () => {
      expect(PageType.getFields()).to.have.property('theme')
      expect(PageType.getFields().theme.type).to.deep.equals(PageThemeType)
    })
    it('should have place field of type placeType', () => {
      expect(PageType.getFields()).to.have.property('place')
      expect(PageType.getFields().place.type).to.deep.equals(PagePlaceType)
    })
  })

  describe('PageShareType', () => {
    it('should have googlep field of type Int', () => {
      expect(PageShareType.getFields()).to.have.property('googlep')
      expect(PageShareType.getFields().googlep.type).to.deep.equals(GraphQLInt)
    })
    it('should have twitter field of type Int', () => {
      expect(PageShareType.getFields()).to.have.property('twitter')
      expect(PageShareType.getFields().twitter.type).to.deep.equals(GraphQLInt)
    })
    it('should have facebook field of type Int', () => {
      expect(PageShareType.getFields()).to.have.property('facebook')
      expect(PageShareType.getFields().facebook.type).to.deep.equals(GraphQLInt)
    })
  })

  describe('PageThemeType', () => {
    it('should have cover field of type String', () => {
      expect(PageThemeType.getFields()).to.have.property('cover')
      expect(PageThemeType.getFields().cover.type).to.deep.equals(GraphQLString)
    })
  })

  describe('PagePlaceType', () => {
    it('should have name field of type String', () => {
      expect(PagePlaceType.getFields()).to.have.property('name')
      expect(PagePlaceType.getFields().name.type).to.deep.equals(GraphQLString)
    })
    it('should have lon field of type String', () => {
      expect(PagePlaceType.getFields()).to.have.property('lon')
      expect(PagePlaceType.getFields().lon.type).to.deep.equals(GraphQLString)
    })
    it('should have lat field of type String', () => {
      expect(PagePlaceType.getFields()).to.have.property('lat')
      expect(PagePlaceType.getFields().lat.type).to.deep.equals(GraphQLString)
    })
  })

  describe('CommentContainerType', () => {
    it('should have comment field of type String', () => {
      expect(CommentContainerType.getFields()).to.have.property('comment')
      expect(CommentContainerType.getFields().comment.type).to.deep.equals(CommentType)
    })
    it('should have replies field of type String', () => {
      expect(CommentContainerType.getFields()).to.have.property('replies')
      // expect(CommentContainerType.getFields().replies.type).to.deep.equals(new GraphQLList(CommentType))
    })
  })

  describe('comments resolver', () => { //TODO: moglo bi jos testova za ovaj resolver
    const comments = PageType.getFields().comments.resolve
    it('should return comments and replies for given page', async () => {
      try {
        let page = pages[0]
        let args = {
          page: 1,
          limit: 10,
          sort: undefined
        }
        let response = await comments(page, args)

        expect(response).to.have.property('limit').and.equal(args.limit)
        expect(response).to.have.property('page').and.equal(args.page)
        expect(response).to.have.property('pages').and.equal(1)
        expect(response).to.have.property('total').and.equal(3)
        expect(response).to.have.property('docs').and.be.array
        expect(response.docs).to.have.lengthOf(3)

        response.docs.forEach(item => {
          expect(item).to.have.property('replies').and.be.array
          expect(item).to.have.property('comment')
          expect(item.comment).to.have.property('text')
          expect(item.comment).to.have.property('author')
          expect(item.comment).to.have.property('page')
          expect(item.comment).to.have.property('reply')
        })

        let replies = response.docs[1]['replies']
        expect(replies).to.have.lengthOf(2)
        replies.forEach(item => {
          expect(item).to.have.property('text')
          expect(item).to.have.property('author')
          expect(item).to.have.property('page')
          expect(item).to.have.property('reply')
        })
      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('replies resolver', () => { //TODO: moglo bi jos testova za ovaj resolver
    const repliesFunc = CommentContainerType.getFields().replies.resolve
    it('should return paginated replies', async () => {
      try {
        let replies = {
          replies: comments.filter(c => c.reply)
        }

        let page = pages[0]
        let args = {
          page: 1,
          limit: 10,
          sort: "created:desc"
        }
        let response = repliesFunc(replies, args)

        expect(response).to.have.property('limit').and.equal(args.limit)
        expect(response).to.have.property('page').and.equal(args.page)
        expect(response).to.have.property('pages').and.equal(1)
        expect(response).to.have.property('total').and.equal(3)
        expect(response).to.have.property('docs').and.be.array
        expect(response.docs).to.have.lengthOf(3)

        response.docs.forEach(item => {
          expect(item).to.have.property('text')
          expect(item).to.have.property('author')
          expect(item).to.have.property('page')
          expect(item).to.have.property('reply')
        })

        // sort test
        assert(response.docs[0]['created'] > response.docs[1]['created'])

        args.sort = "created:ascending"
        let response2 = repliesFunc(replies, args)
        assert(response2.docs[0]['created'] < response2.docs[1]['created'])

      } catch (err) {
        should.not.exist(err)
      }
    })
  })
})
