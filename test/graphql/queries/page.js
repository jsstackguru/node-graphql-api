// assertions
import { assert } from 'chai'
import { expect } from 'chai'
import {initAfter, initBefore} from '../../setup'

// gql resolver
import pageQuery from '../../../src/GQLSchema/queries/page.query'

// fixtures
import pages from '../../fixtures/pages.json'

// services
import { ObjectId } from 'mongodb'

describe('Page resolvers', () => {

  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('page', () => {
    const getPage = pageQuery.page.resolve
    let page = pages[1]
    let args = {
      id: page._id
    }
    it('should get requested page', async () => {
      let response = await getPage('', args)
      response.should.be.type('object')
      assert.equal(page.title, response.title)
      assert.deepEqual(ObjectId(page._id), response._id)
    })

  })

  describe('comments', () => {
    const getComments = pageQuery.comments.resolve
    let page = pages[0]
    let args = {
      pageId: page._id,
      limit: 9,
      page: 1,
      sort: undefined
    }
    it('should get requested comments', async () => {
      let response = await getComments('', args)
      response.should.be.type('object')

      expect(response).to.have.property('limit').and.equal(args.limit)
      expect(response).to.have.property('page').and.equal(args.page)
      expect(response).to.have.property('pages').and.equal(1)
      expect(response).to.have.property('total').and.equal(5)
      expect(response).to.have.property('docs').and.be.array
      expect(response.docs).to.have.lengthOf(5)

      response.docs.forEach(item => {
        expect(item).to.have.property('text')
        expect(item).to.have.property('author')
        expect(item).to.have.property('page')
        expect(item).to.have.property('reply')
      })
    })
  })
  describe('replies', () => {
    const getReplies = pageQuery.replies.resolve
    let commentId = "5b29f711d216c70e00c357b7"
    let args = {
      // pageId: page._id,
      commentId,
      limit: 9,
      page: 1,
      sort: undefined
    }
    it('should get requested replies', async () => {
      let response = await getReplies('', args)
      response.should.be.type('object')

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
    })
  })

})
