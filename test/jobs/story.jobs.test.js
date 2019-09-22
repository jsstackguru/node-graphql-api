//  assertions
import { expect } from 'chai'
import should from 'should'
// models
import { Activity } from '../../src/models/activity'
import { eventEmitter } from '../../src/services/events'
import agenda from '../../src/services/jobs/index'
// jobs
import { storyUpdate, storyCreated } from '../../src/services/jobs/story.jobs'
// fixtures
import fixtures from '../fixtures'

const authors = fixtures.collections.authors
const stories = fixtures.collections.stories

describe('start story jobs tests', () => {
  beforeEach(async () => {
    await agenda.start()
  })
  afterEach(async () => {
    await agenda.stop()
  })
  describe('storyCreated', () => {
    let expectedKeys = [
      '_id', 'author', 'created', 'updated', 'timestamp', 'active', 'data', 'type'
    ]
    it('create and return activity', async () => {
      try {
        let obj = {
          author: authors[0],
          story: stories[0]
        }
        let res = await storyCreated(obj)
        expectedKeys.forEach(key => {
          expect(res[key]).to.exist
        })
        // check data storyId
        expect(res.data.storyId).to.exist

      } catch (err) {
        console.log(err)
        expect(err).to.not.exist
      }
    })
  })

})