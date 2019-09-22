/**
 * @file Jobs for the author
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

// Models
import Author from '../../models/author/index'
import Following from '../../models/following/index'

// Handlers
import deviceHndl from '../../handles/device.handles'

// Services
import activityService from '../activity'
import { sendPushNotification } from '../push-notification/ios'
import {
  activation,
  resetPassword,
  registrationSuccessfulEmail,
  resetPasswordSuccessfulEmail,
  passwordChangedEmail,
  reportCommentSpamEmail,
  deleteAccountEmail,
  joinAppEmail,
  invitationAcceptedEmail
} from '../email'

/**
 * Author start to follows another author
 * @param {String} authorId 
 * @param {Object} follows 
 */
export const startFollow = async (authorId, follows) => {
  try {

    // Find author
    const author = await Author.findById(authorId)
    if (!author) {
      throw new Error(`Author with ID: ${authorId} not found`)
    }

    // Try to find whether user still follows user or not
    const following = await Following.find({
      author: author.id,
      follows: follows.id,
      active: true
    })

    if (!following) {
      throw new Error(`${author.username} doesn't follow ${follows.username} anymore`)
    }

    // Store activity in database
    const date = new Date()
    const result = await activityService.saveActivity({ //TODO:revision this
      created: date,
      updated: date,
      author: author.id,
      timestamp: date.getTime(),
      active: true,
      type: 'newFollower',
      data: {
        follows: follows.id
      }
    })

    // Send push notification
    const tokens = await deviceHndl.getDeviceTokensByUserId(follows.id)
    sendPushNotification(tokens, `${author.username} started following you`)

    return result
  } catch (err) {
    throw err
  }
}

/**
 * Job when new author has registered
 * @param {Object} author
 */
export const register = async (author) => {
  try {
    // Send an email for activation
    const result = await activation(author) // TODO: proveriti da li postoji pozivnica za kolaboraciju
    return result
  } catch (err) {
    throw err
  }
}

/**
 * Job when author is receiving email for join app
 * @param {Object} author
 */
export const joinApp = (author, link) => {
  try {
    // Send an email for activation
    return joinAppEmail(author, link)

  } catch (err) {
    throw err
  }
}

/**
 * Job when user accept invitation
 * @param {Object} author
 * @param {string} invitedEmail 
 */
export const invitationAccepted = async (author, invitedEmail) => {
  try {
    // Send an email for activation
    invitationAcceptedEmail(author, invitedEmail)
    // Send push notification
    const tokens = await deviceHndl.getDeviceTokensByUserId(author.id)
    sendPushNotification(tokens, `${invitedEmail} joind iStory`)

  } catch (err) {
    throw err
  }
}

/**
 * Job when author is finished with registration
 * @param {Object} author
 */
export const registrationSuccessful = (author) => {
  try {
    // Send an email for successful registration
    registrationSuccessfulEmail(author)

  } catch (err) {
    throw err
  }
}

/**
 * Forgot password
 * @param {Object} job
 * @param {Function} done
 */
export const forgotPassword = (author, code) => {
  try {
    // Send an email
    resetPassword(author, code)

  } catch (err) {
    throw err
  }
}

/**
 * Reset password successful
 * @param {Object} author
 */
export const resetPasswordSuccessful = author => {
  try {
    // Send an email
    resetPasswordSuccessfulEmail(author)

  } catch (err) {
    throw err
  }
}

/**
 * Password changed
 * @param {Object} author
 */
export const passwordChanged = author => {
  try {
    // Send an email
    passwordChangedEmail(author)

  } catch (err) {
    throw err
  }
}

/**
 * Delete account
 * @param {Object} author
 */
export const deleteAccount = author => {
  try {
    // Send an email
    deleteAccountEmail(author)

  } catch (err) {
    throw err
  }
}

/**
 * Report story spam
 * @param {Object} author
 * @param {Object} story
 * @param {Object} data
 */
export const reportCommentSpam = (author, story, reason, comment) => {
  try {
    // Send an email
    reportCommentSpamEmail(author, story, reason, comment)

  } catch (err) {
    throw err
  }
}
