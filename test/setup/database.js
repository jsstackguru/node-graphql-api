import config from '../../src/config'
import mongoose from 'mongoose'

const db = mongoose.connection

mongoose.Promise = global.Promise

/**
 * Connect to database
 *
 * @returns {Object} Database connection
 */
export const connect = (cb) => {
  mongoose.connect(config.db.testUri, {
    useNewUrlParser: true
  })
  // db = mongoose.connection
  db.once('open', () => {
    // import models
    require('../../src/models/author/author.model')
    require('../../src/models/forgot-password/forgot-password.model')
    require('../../src/models/story/story.model')
    require('../../src/models/page/page.model')
    require('../../src/models/collaboration-invite/collaboration-invite.model')
    require('../../src/models/activity/activity.model')
    require('../../src/models/following/following.model')
    require('../../src/models/group/group.model')
    require('../../src/models/group-invite/group-invite.model')

    cb(db)
  })
}

export default db

/**
 * Load fixtures
 */
export const fixtures = async () => {
  try {
    if (!db) {
      throw new Error('Missing database connection.')
    }

    // import authors
    const data = require('../fixtures')
    let names = Object.keys(data.collections)
    let count = 0

    for (const name of names) {
      for (const collection of data.collections[name]) {
        let Model = db.model(name)
        let newModel = new Model(collection)
        await newModel.save()
        // console.log(`${name} added`)
      }
    }
  } catch (err) {
    throw err
  }
}

/**
 * Drop collections
 *
 * @param {Function} done Callback function
 */
export const drop = async () => {
  try {
    if (!db || !db.collections) return
    // This is faster then dropping the database
    const collections = Object.keys(db.collections)
    for (const collection of collections) {
      await dropCollection(collection)
    }
    await dropCollection('agendaJobs')
  } catch (err) {
    throw err
  }
}

const dropCollection = (name) => {
  return new Promise((resolve, reject) => {
    mongoose.connection.db.dropCollection(name, (err, result) => {
      // if (err) reject(err)
      // console.log(`${name} dropped`)
      resolve(result)
    })
  })
}

/**
 * Disconnect database connection
 */
export const disconnect = (done) => {
  mongoose.disconnect()
  // done()
  mongoose.connection.on('disconnected', () => {
    done()
  });
}

