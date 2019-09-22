/**
 * @file Middleware for authorization
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

// Libraries
import translate from '../lib/translate'
import { Unauthorized } from '../lib/errors'
// Services
import { verifyToken } from '../services/auth'
// Models
import Author from '../models/author/author.model'

/**
 * Authenticate user by token
 * @param {function} req Request
 * @param {function} res Response
 * @param {function} next Middleware
 */
const authentication = async (req, res, next) => {
  try {
    // check header or url parameters or post parameters for token
    let token = req.body.token || req.query.token || req.headers['authorization']
    
    // get token from headers
    if (req.headers['authorization']) {
      token = getAuthToken(token)
    }
    
    // if token missing
    if (!token) {
      throw new Unauthorized(translate.__('Authorization token missing'))
    }

    // verify token
    const decoded = verifyToken(token)

    if (decoded instanceof Error) {
      return res.status(decoded.statusCode).json(decoded)
    }

    req.decoded = decoded
    
    // find author
    let author = await Author.findByEmail(decoded.email)
    
    if (!author) {
      throw new Unauthorized( translate.__('Author not found') )
    }

    req.effectiveUser = author

    next()
  } catch (err) {
    return next(err)
  }
}

/**
 * get authorization token from header
 *
 * @param {object} req  request
 */
const getAuthToken = function (authorization) {
  let token = null

  if (authorization) {
    let authArr = authorization.split(' ')
    // retrieve token
    token = authArr[authArr.length - 1]
    token.replace(' ', '')
    token = token.replace(/"/g, '')
    return token
  } else {
    return null
  }
}

module.exports = {
  authentication
}
