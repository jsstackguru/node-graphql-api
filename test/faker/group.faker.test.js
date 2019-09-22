//  assertions
import chai from 'chai'
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'
// models
import { Group } from '../../src/models/group'
// faker
import groupFaker from '../fixtures/faker/group/group.faker'
// after hooks
import { initAfter } from '../setup'
// utils
import { ObjectId } from 'mongodb'

describe('family group faker', () => {

  const expectedKeys = [
    '_id', 'owner', 'members', 'created', 'updated'
   ]

  afterEach(async () => {
    await initAfter()
  })

  it('should create family groups with default params if no args', async () => {
    await groupFaker({})

    let groups = await Group.find({})

    expect(groups).to.be.an('array').and.have.lengthOf(1)

    groups.forEach(group => {
      expect(group['members']).to.be.an('array').and.have.lengthOf(2)
      expectedKeys.forEach(key => {
        expect(group[key]).to.exist
      })
    })
  })

  it('should create groups with only number of comment arg', async () => {
    let params = {
      n: 12,
    }
    await groupFaker(params)
    let groups = await Group.find({})

    expect(groups).to.have.lengthOf(params.n)
    groups.forEach(group => {
      expectedKeys.forEach(key => {
        expect(group[key]).to.exist
      })
    })
  })

  it('should create groups with all args', async () => {
    let params = {
      n: 3,
      owner: ObjectId(),
      active: false,
      members: [ObjectId(), ObjectId(), ObjectId()]
    }
    await groupFaker(params)
    let groups = await Group.find({})
    expect(groups).to.have.lengthOf(params.n)
    groups.forEach(group => {
      expectedKeys.forEach(key => {
        expect(group[key]).to.exist
      })
      expect(group.author).to.deep.equals(params.author)
      expect(group.active).to.equals(params.active)
      expect(group.members).to.deep.equals(params.members)
    })
  })

})
