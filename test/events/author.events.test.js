//  assertions
import { expect } from 'chai'
import should from 'should'

import { eventEmitter } from '../../src/services/events'
import agenda from '../../src/services/jobs/index'
// jobs
import { storyUpdate } from '../../src/services/jobs/story.jobs'
// fixtures
import fixtures from '../fixtures'

const authors = fixtures.collections.authors

// describe.skip('start author events tests', () => {
//   beforeEach(async () => {
//     await agenda.start()
//   })
//   afterEach(async () => {
//     await agenda.stop()
//   })
//   it('should work', async () => {
//     try {
//       const author = authors[0]
//       // eventEmitter.on('register')
//       // let x = await eventEmitter.emit('register', author)
//       // let x = await agenda.now('registration', author)

//       // console.log('x', x)
//     } catch (err) {
//       console.log(err)
//     }
//   })
// })