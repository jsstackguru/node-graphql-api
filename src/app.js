/**
 * @file Initialize server and database connection
 * @author Andrey Ponomarov <andrey.ponom1222@gmail.com>
 * @version 1.0
 */

import mongoose from 'mongoose'
import server from './server'
import {errorHandler} from './middleware/error'
import path from 'path'
import express from 'express'

module.exports = () => {
  /**
   * Database
   */
  // connect database
  require('./models/database')

  const db = mongoose.connection

  db.once('open', () => {

    // Error handler
    server.use(errorHandler)

    server.use(express.static(path.join(`${__dirname}/../v1`)))

    server.use('/', (req, res) => {
      res.set('Content-Type', 'text/html')
      res.sendFile(path.join(`${__dirname}/../v1/index.html`))
    })

  })
}
