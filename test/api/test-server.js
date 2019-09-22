import config from '../../config'
import server from '../../src/server'
// const mongoose = require('mongoose')
import {drop} from '../setup/database'
// const fixtures = require('../fixtures/authors')

describe('Test server', () => {
  // var client

  before((done) => {
    done()
  })

  it('should start server', (done) => {
    server.listen(config.port, () => {
      done()
    })
  })

  after((done) => {
    drop(done)
  })
})
