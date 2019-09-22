//  assertions
import { expect } from 'chai'
import should from 'should'

// models
import { Activity } from '../../src/models/activity'

// faker
import activityFaker from '../fixtures/faker/activity/activity.faker'

// after hooks
import { initAfter } from '../setup/'

// utils
import { ObjectId } from 'mongodb'

describe('activity faker', () => {

  const expectedKeys = [
    '_id', 'author', 'timestamp', 'active', 'type', 'data'
  ]

  afterEach(async () => {
    await initAfter()
  })

  it('should create activities with default params if no args', async () => {
    try {
      await activityFaker({})

      let activities = await Activity.find({})

      expect(activities).to.be.an('array').and.have.lengthOf(1)

      activities.forEach(activity => {
        expectedKeys.forEach(key => {
          expect(activity[key]).to.exist
        })
      })
    } catch (err) {
      expect(err).to.not.exist
    }
  })

  it('should create authors with only number of activity arg', async () => {
    let params = { n: 3 }
    await activityFaker(params)

    let activities = await Activity.find({})
    expect(activities).to.have.lengthOf(params.n)
    activities.forEach(author => {
      expectedKeys.forEach(key => {
        expect(author[key]).to.exist
      })
    })
  })

  it('should create authors with all arg', async () => {
    let params = {
      n: 2,
      active: false,
      type: 'story_created',
      created: new Date(),
      data: {
        storyId: ObjectId()
      }
    }
    await activityFaker(params)
    let activities = await Activity.find({})
    expect(activities).to.have.lengthOf(params.n)
    activities.forEach(author => {
      expectedKeys.forEach(key => {
        expect(author[key]).to.exist
      })
      expect(author.active).to.equals(params.active)
      expect(author.type).to.equals(params.type)
      expect(author.data).to.deep.equals(params.data)
    })
  })

})
