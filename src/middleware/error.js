/**
 * @file Error handler middleware
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import log from '../services/log'
import config from '../config'
import { BadRequest } from '../lib/errors'

/**
 * Error handler middleware
 * @param {function} err Error exception
 * @param {function} req Request
 * @param {function} res Response
 * @param {function} next Middleware function
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  if (config.debug) {
    log.error(err)
  }
  // If err has no specified error code, set error code to 'Internal Server Error (500)'
  if (!err.statusCode) err.statusCode = 500
  // All HTTP requests must have a response, so let's send back an error with its status code and message
  res.status(err.statusCode).send(err)
}
/**
 * Mongoose error handler middleware
 *
 * @param {Object} error Validation error
 * @param {Object} res Model object response
 * @param {function} next Middleware function
 */
// eslint-disable-next-line no-unused-vars
export const moongooseErrorHandler = (error, res, next) => {
  if (error.name === 'ValidationError') {
    next(new BadRequest(error.message))
  } else {
    next()
  }
}
