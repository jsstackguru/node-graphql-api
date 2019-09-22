//  assertions
import chai from 'chai'
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'
// services
import { initBefore, initAfter } from '../setup'
import { ObjectId } from 'mongodb'
// fixtures
import fixtures from '../fixtures'
// model
import { Author } from '../../src/models/author'
// errors
import { UnprocessableEntity } from '../../src/lib/errors'

const authors = fixtures.collections.authors


describe('Author statics tests...', async () => {

  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('findManyUsersStorageUsage', () => {
    it('should return error if no users found', async () => {
      try {
        let usersArr = []
        for (let i = 0; i < 4; i++) {
          usersArr.push(ObjectId())
        }

        let result = await Author.findManyUsersStorageUsage(usersArr, 'throw_err')

        expect(result).to.not.exist
      } catch (err) {
        expect(err).to.be.an('object')
        assert.equal(err instanceof Error, true)
        expect(err.message).to.equal('There are no authors with specific ID\'s')
      }
    })
    it('should return null if users not found if not throw err flag', async () => {
      try {
        let usersArr = []
        for (let i = 0; i < 4; i++) {
          usersArr.push(ObjectId())
        }

        let result = await Author.findManyUsersStorageUsage(usersArr)

        expect(result).to.be.null
      } catch (err) {
        expect(err).to.not.exist
      }

    })
    it('should return sum of specific users storage usage', async () => {
      try {
        let usersArr = []
        for (let i = 0; i < 5; i++) {
          const el = authors[i]
          usersArr.push(el)
        }

        let result = await Author.findManyUsersStorageUsage(usersArr, 'throw')

        expect(result).to.be.a('number').and.gte(0)
      } catch (err) {
        expect(err).to.not.exist
      }

    })
  })

})