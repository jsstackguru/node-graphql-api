/**
 * @file Initialize tests
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import {connect, drop} from './setup/database'
import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import rimraf from 'rimraf'

import log from '../src/services/log'

import server from '../src/server'
import config from '../src/config'

describe('Start testing...', function() {
  this.timeout(20000)

  let app

  before(async () => {
    // mute logger while testing
    log.transports[0]['silent'] = true

    return new Promise((resolve, reject) => {
      connect(async () => {
        console.log('Database connected!')
        // delete database
        await drop()
        app = server.listen(config.port)
        console.log('%s listening at %s', config.baseUrl, config.port)

        resolve()
      })
    })
  })

  after(async () => {
    // unmute logger after tests
    log.transports[0]['silent'] = false
    app.close()

    // remove mock bucket files
    await clearS3MockFiles()

    mongoose.models = {}
    mongoose.modelSchemas = {}
    return mongoose.connection.close()
  })

  describe('happy hackiong :)', function () {
    /*  API tests   */
    require('./api')
    /*  Function tests  */
    require('./handles')
    /*  Services tests  */
    require('./services')
    /* graphQL test*/
    require('./graphql')
    /* utils test*/
    require('./utils/utils')
    /*  libs  */
    require('./lib')
    /*  statics  */
    require('./statics')
    /* models */
    require('./models')
    /* Middlewared */
    require('./middleware')
    /* faker  */
    require('./faker')
    /* events  */
    require('./events')
    /* jobs  */
    require('./jobs')
  })

})

/**
 * Clear mock files for Amazon S3
 */
const clearS3MockFiles = async () => {
  try {
    const directory = path.join(__dirname, '/media/buckets')
    await fs.readdir(directory, (err, directories) => {
      if (err) throw err

      for (const dir of directories) {
        rimraf.sync(path.join(directory, dir))
      }

      return true
    })
  } catch (err) {
    throw err
  }
}
