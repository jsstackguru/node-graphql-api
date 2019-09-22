/**
 * @file Initialize server and database connection
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import mongoose from 'mongoose'
import server from './server'
import {errorHandler} from '../../middleware/error'

module.exports = () => {
  /**
   * Database
   */
  // connect database
  require('../../models/database')

  const db = mongoose.connection

  db.once('open', () => {

    // Error handler
    server.use(errorHandler)


    require('./db/dump_authors')
    require('./db/dump_stories')
  })
}
