// assertions
import { assert } from 'chai'
import { expect } from 'chai'
import {initAfter, initBefore} from '../../setup'

// gql resolver
import authorQuery from '../../../src/GQLSchema/queries/author.query'

// fixtures
import authors from '../../fixtures/authors.json'


describe('Authors resolvers', () => {

  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  // default user
  let user = authors[0]

  describe('author', () => {
    // extract function to test
    const authorById = authorQuery.author.resolve
    // add id to the args
    let args = {
      id: user._id,
      page: 1,
      limit: 1,
      sort: 'name:asc'
    }

    it('should get requested author', async () => {
      let response = await authorById('', args)
      assert.equal(response._id.toString(), user._id)
    })
  })

  describe('authors', () => {
    // extract function to test
    const getAuthors = authorQuery.authors.resolve
    // args
    let args = {
      page: 1,
      limit: 1,
      sort: 'name:asc'
    }

    it ('should get all authors with pagination', async () => {

      let response = await getAuthors('', args)

      response.should.have.property('limit').and.have.type('number')
      response.should.have.property('page').and.have.type('number')
      response.should.have.property('pages').and.have.type('number')
      response.should.have.property('docs')
      expect(response.docs).to.be.an('array').that.is.not.empty
    })
  })

  describe('authorsSearch', () => {
    // default parameters
    let args = {
      author: user._id,
      text: ""
    }

    let req = {
      user: {
        _id: user._id
      }
    }
    // extract function to test
    const searchAuthors = authorQuery.authorsSearch.resolve

    it('should return authors', async () => {

      let response = await searchAuthors('', args, req)

      response.should.have.property('limit').and.have.type('number')
      response.should.have.property('page').and.have.type('number')
      response.should.have.property('pages').and.have.type('number')
      response.should.have.property('docs')
      expect(response.docs).to.be.an('array').that.is.not.empty

      // every item in docs should have "follow" property that is not Null of undefined
      response.docs.forEach(item => {
        assert.exists(item.follow)
      })

    })

    it('should match name, username or email, based on regex', async ()=> {
      // search text
      let queryString = 'te'

      let regex = new RegExp(queryString)
      // add search text to query
      args.search = queryString

      let response = await searchAuthors('', args, req)

      // loop all stories to see if they match regex query string
      response.docs.forEach(item => {
        let final = regex.test(item.name) || regex.test(item.username) || regex.test(item.email)
        expect(final).to.be.true
      })
    })

  })

  describe('profile', () => {
    // default parameters
    let args = {
      id: authors[0]["_id"],
      text: ""
    }

    let req = {
      user: {
        _id: authors[1]["_id"]
      }
    }
    // extract function to test
    const getProfile = authorQuery.profile.resolve
    // args
    it('should get user\'s profile', async () => {

      let response = await getProfile('', args, req)

      response.should.be.type('object')
      response.should.have.property('name')
      response.should.have.property('username')
      response.should.have.property('following').and.have.type('number')
      response.should.have.property('followers').and.have.type('number')
      assert.equal(response._id.toString(), args.id)

    })

  })

  describe('storage', () => {
    const storageRes = authorQuery.storage.resolve
    it('get storage done', async () => {
      try {

        let user = authors[0]
        let req = { user }
        let res = await storageRes("", "", req)
        expect(res).to.be.an('object')
        expect(res).to.have.property('author')
        expect(res).to.have.property('members')
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('search', () => {
    const searchRes = authorQuery.search.resolve
    let author = authors[11]
    it('get search done', async() => {
      try {
        let args = {
          search: 's',
          page: 1,
          limit: 10,
          author_sort: 'name:asc',
          story_sort: 'title:asc'
        }
        let req = { user: authors[0]['id'] }
        let res = await searchRes(null, args, req)

        // console.log(res)

        expect(res).to.have.property('authors')
        expect(res).to.have.property('stories')

        let authorProp = res.authors
        let storyProp = res.stories

        let props = ['docs', 'total', 'limit', 'page', 'pages']

        props.forEach(prop => {
          expect(authorProp[prop]).to.exist
          expect(storyProp[prop]).to.exist
        })

      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })
})
