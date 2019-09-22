//  assertions
import chai from 'chai'
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'
// models
import { Following } from '../../src/models/following'
// faker
import followingFaker from '../fixtures/faker/following/following.faker'
// after hooks
import { initAfter } from '../setup/'
// utils
import { ObjectId } from 'mongodb'

describe('following faker', () => {

  const expectedKeys = [
    '_id', 'author', 'follows', 'active', 'created', 'updated'
   ]

  afterEach(async () => {
    await initAfter()
  })

  it('should create followings with default params if no args', async () => {
    await followingFaker({})

    let followings = await Following.find({})

    expect(followings).to.be.an('array').and.have.lengthOf(1)

    followings.forEach(following => {
      expectedKeys.forEach(key => {
        expect(following[key]).to.exist
      })
    })
  })

  it('should create followings with only number of comment arg', async () => {
    let params = {
      n: 12,
    }
    await followingFaker(params)
    let followings = await Following.find({})

    expect(followings).to.have.lengthOf(params.n)
    followings.forEach(following => {
      expectedKeys.forEach(key => {
        expect(following[key]).to.exist
      })
    })
  })

  it('should create followings with all args', async () => {
    let params = {
      n: 3,
      author: ObjectId(),
      follows: ObjectId(),
      active: false,
    }
    await followingFaker(params)
    let followings = await Following.find({})
    expect(followings).to.have.lengthOf(params.n)
    followings.forEach(group => {
      expectedKeys.forEach(key => {
        expect(group[key]).to.exist
      })
    })
  })

})
