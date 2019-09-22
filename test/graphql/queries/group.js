// assertions
import chai from 'chai'
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'
import {initAfter, initBefore} from '../../setup'
// gql resolver
import activityQuery from '../../../src/GQLSchema/queries/activity.query'
import accountQuery from '../../../src/GQLSchema/queries/group.query'
// models
import Author from '../../../src/models/author/author.model'
// fixtures
import authors from '../../fixtures/authors.json'


describe('Account resolvers', () => {

  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('Group account', () => {

    const groupAccount = accountQuery.groupAccount.resolve

    it('should get throw err, no group with specified author ', async () => {
      try {
        let user = authors[6]
        let req = { user }
        let response = await groupAccount('', '', req)

        expect(response).to.be.null
      } catch (err) {
        expect(err).to.not.exist
      }
    })
    it('should return group account for specified author ', async () => {
      try {
        let user = authors[1]
        let req = { user }
        let response = await groupAccount('', '', req)

        expect(response).to.exist.and.be.an('object')
        expect(response.members).to.exist.and.be.an('array').that.is.not.empty
        expect(response.isOwner).to.exist.and.be.a('boolean')
        expect(response.active).to.exist.and.be.a('boolean')
        expect(response.created).to.exist.and.be.a('date')
        expect(response.updated).to.exist.and.be.a('date')
        expect(response.pending).to.exist.and.be.an('array')
        let pending = response.pending
        pending.forEach(item => {
          expect(item).to.have.property('email')
          expect(item).to.have.property('author')
        })
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

})
