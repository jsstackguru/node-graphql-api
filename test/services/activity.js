import chai from 'chai'
import should from 'should'
const expect = chai.expect
const assert = chai.assert
// Services
let activityService
// Fixtures
import fixtures from '../fixtures'
import { initAfter, initBefore } from '../setup'

describe('Activity service tests...', async () => {

  before(async () => {
    await initBefore()
    activityService = require('../../src/services/activity')
  })

  after(async () => {
    await initAfter()
  })

  it('should save activity in database', async () => {
    const authors = fixtures.collections.authors
    const user = authors.find( a => {
      return a._id === '58eb78b94b432a21008c2346'
    })
    let date = new Date('09/01/2018')
    let result = await activityService.saveActivity({
      created: date,
      updated: date,
      author: user._id,
      timestamp: date.getTime(),
      active: true,
      type: 'testType',
      data: {
        message: 'this is the test'
      }
    })

    result.should.have.property('created')
    result.should.have.property('updated')
    result.should.have.property('author')
    result.should.have.property('active')
    result.should.have.property('data')
    result.should.have.property('timestamp')
    assert.equal(result.created, date)
    assert.equal(result.updated, date)
    assert.equal(result.timestamp, date.getTime())
    assert.equal(result.author, user._id)
    should(result.data).be.type('object')
    assert.equal(result.data.message, 'this is the test')
    assert.equal(result.type, 'testType')

  })

})
