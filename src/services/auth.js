/**
 * @file Authentication service
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import jwt from 'jsonwebtoken'
import config from '../config'
import translate from '../lib/translate'
import { Unauthorized } from '../lib/errors'

/**
 * Generate authentication token
 * @param {String} email User's email to authenticate
 * @returns {String} - Authorization Token
 */
export const generateToken = (email) => {
  try {
    const exp = Math.floor(Date.now() / 1000) + (3600 * 24 * 30)
    const token = jwt.sign({
      exp,
      email
    }, config.token.salt)

    return token
  } catch (err) {
    throw err
  }
}

/**
 * Verify JWT token
 * @param {String} token - Authorization token
 * @returns {Object} - Verify response
 */
export const verifyToken = token => {
  try {
    const decoded = jwt.verify(token, config.token.salt)

    return decoded
  } catch (err) {
    console.log(err)
    throw new Unauthorized( translate.__('Invalid token') )
  }
}
