/**
 * @file Setup server
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

// server
import express from 'express'
import bodyParser from 'body-parser'
// config
import config from './config'
// authentication
import { authentication } from './middleware/auth'
import { cors } from './middleware/request'
// graphQL
import graphqlHTTP from 'express-graphql'
import schema from './GQLSchema/schema'

// temporary / testing
// import authorHndl from './handles/author.handles'
// import { generateToken } from '../test/services/auth'

/**
 * Routes
 */
import router from './routes'

// Middleware
import multipart from 'connect-multiparty'

// include local .env file
require('dotenv').config()

// Middleware
const paginate = require('./middleware/paginate')

/**
 * Log
 */
import log from './services/log'

log.on('finish', () => process.exit())

/**
 * Server
 */
const server = express()

server.use((req, res, next) => {
  res.etag = `${req.method}${req.url}`
  res.header('Etag', res.etag)
  res.header('Last-Modified', Date.parse(new Date()))

  return next()
})

/**
 * Middleware
 */
server.use(paginate(server, {
  paramsNames: {
    page: 'page',
    size: 'size'
  },
  defaults: {
    page: 1
  },
  numbersOnly: false,
  hostname: true
}))

/**
 * Multer - files middleware
 */
let multipartMiddleware = multipart({
  maxFieldsSize: 20971520,
  uploadDir: '/tmp'
})
server.use(multipartMiddleware)

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use((req, res, next) => {
  res.setHeader('Expires', new Date(Date.now() + 2592000000).toUTCString())
  next()
})

/**
 * Default response headers
 */
server.use((req, res, next) => {
  res.setHeader('Server', config.name)
  next()
})

// Logger
server.use((req, res, next) => {
  // @TODO Include logger for errors (for both environments: development and production)
  next()
})

// GraphQL
server.use('/graphql', cors, authentication, graphqlHTTP(req => ({
  schema,
  graphiql: true,
  context: {
    user: req.effectiveUser
  }
}))
)

server.use('/v1', router)

export default server
