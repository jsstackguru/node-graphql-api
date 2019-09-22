//  assertions
import { expect } from 'chai'
import should from 'should'

// models
import { Author } from '../../src/models/author'

// faker
import authorFaker from '../fixtures/faker/author/author.faker'

// after hooks
import { initAfter } from '../setup/'

// utils
import { ObjectId } from 'mongodb'

describe('author faker', () => {

  const expectedKeys = [
    '_id', 'name', 'username', 'email', 'avatar', 'bio', 'active', 'location', 'delete', 'plan', 'storage'
  ]

  afterEach(async () => {
    await initAfter()
  })

  it('should create authors with default params if no args', async () => {
    try {
      await authorFaker({})

      let authors = await Author.find({})

      expect(authors).to.be.an('array').and.have.lengthOf(1)

      authors.forEach(author => {
        expectedKeys.forEach(key => {
          expect(author[key]).to.exist
        })
      })
    } catch (err) {
      console.log(err.stack)
      should.not.exist(err)
    }
  })

  it('should create authors with only number of author arg', async () => {
    let params = {
      n: 2,
    }
    await authorFaker(params)
    let authors = await Author.find({})
    expect(authors).to.have.lengthOf(params.n)
    authors.forEach(author => {
      expectedKeys.forEach(key => {
        expect(author[key]).to.exist
      })
    })
  })

  it('should create authors with all arg', async () => {
    let params = {
      n: 1,
      id: ObjectId(),
      active: false,
      deleted: true,
      planLevel: 'PREMIUM',
      storageUsage: 123123
    }
    await authorFaker(params)
    let authors = await Author.find({})
    expect(authors).to.have.lengthOf(params.n)
    authors.forEach(author => {
      expectedKeys.forEach(key => {
        expect(author[key]).to.exist
      })
      expect(author._id).to.deep.equals(params.id)
      expect(author.active).to.equals(params.active)
      expect(author.deleted).to.equals(params.deleted)
      expect(author.plan.level).to.equals(params.planLevel)
      expect(author.storage.usage).to.equals(params.storageUsage)
    })
  })

})
