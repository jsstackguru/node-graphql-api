//  assertions
import { expect } from 'chai'
import should from 'should'

import { eventEmitter } from '../../src/services/events'
import agenda from '../../src/services/jobs/index'
// jobs
import { storyUpdate } from '../../src/services/jobs/story.jobs'
// fixtures
import fixtures from '../fixtures'
import authorFaker from '../fixtures/faker/author/author.faker'

const authors = fixtures.collections.authors

describe.skip('start author jobs tests', () => {
  // beforeEach(async () => {
  //   await agenda.start()
  // })
  // afterEach(async () => {
  //   await agenda.stop()
  // })
  it('should work', async () => {
    try {
      // await authorFaker({n: 3})
      // const author = authors[0]
      // let x = await agenda.now('register', author)
      // // console.log('x', x)
      // // expect(author).to.deep.equal(x.attrs.data)
    } catch (err) {
      expect(err).to.not.exist
      console.log(err)
    }
  })
})