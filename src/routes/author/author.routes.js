/**
 * @file Routes for author
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

// Handles
import authorHndl from '../../handles/author.handles'

// Services
import utils from '../../lib/utils'
import events from '../../services/events'
import translate from '../../lib/translate'
import { BadRequest, InternalServerError, UnprocessableEntity } from '../../lib/errors/index'

// Models
import { authorExtractor } from '../../models/author'

import config from '../../config';

/**
 * Sign in author by username and password
 *
 * @param {function} req
 * @param {function} res
 * @param {function} next
 */
const singIn = async (req, res, next) => {
  try {
    const email = req.body.email
    const pass = req.body.password

    if (!email || !pass) {
      throw new BadRequest(translate.__('Missing email or password'))
    }

    const user = await authorHndl.login(email, pass)

    if (!user) {
      throw new UnprocessableEntity(translate.__('User doesn\'t exist'))
    } else {
      // @TODO Create uniformed response for all endpoints
      res.send({
        data: authorExtractor.login(user)
      })
    }
  } catch (err) {
    next(err)
  }
}

/**
 * Sign up new author
 *
 * @param {function} req
 * @param {function} res
 * @param {function} next
 */
const singUp = async (req, res, next) => {
  try {
    const user = req.body.user
    const invitationToken = req.body.invitationToken //TODO: da li je potrebno vratiti u responsu nesto vezano za invitation?

    // check if data exist
    if (!user) {
      throw new BadRequest('Missing parameters')
    }
    // get user's data
    const password = user.password
    const password2 = user.passwordConfirmation
    const email = user.email
    const username = user.username.toLowerCase()
    const name = user.name || username

    // check parameters
    if (!user || !password || !email || !username || !password2) {
      throw new BadRequest('Missing parameters')
    }

    // check if passwords are equal
    if (password !== password2) {
      throw new BadRequest('Insert equal passwords')
    }

    // validate email
    if (!utils.isValidEmail(email)) {
      throw new BadRequest('Insert valid email address')
    }
    // validate username
    const usernameError = utils.validateUsername(username)
    if (usernameError) {
      throw new BadRequest(usernameError)
    }
    // validate password
    const passwordError = utils.validatePassword(password)
    if (passwordError) {
      throw new BadRequest(passwordError)
    }

    const newAuthor = await authorHndl.register(email, username, password, name, invitationToken)
    // if result is an error, throw it back
    if (newAuthor instanceof Error) { //TODO: da li je ovo potrebno?
      return next(newAuthor)
    }

    if (!newAuthor) {
      throw new  BadRequest('Account has not been created')
    }

    // Emit register
    events.emit('register', newAuthor)

    res.send({
      data: newAuthor
    })

  } catch (err) {
    return next(err)
  }
}

/**
 * Update profile
 *
 * @param {function} req
 * @param {function} res
 * @param {function} next
 */
const updateProfile = async (req, res, next) => { //TODO: fali api test!!!!
  try {

    const user = req.effectiveUser
    const name = req.body.name
    const username = req.body.username
    const bio = req.body.bio
    const avatar = req.files.avatar
    const location = req.body.location

    if (!name && !username && !bio && !avatar && !location) {
      return next(new BadRequest(translate.__('You need at least one parameter to change profile.'))) // TODO: message
    }

    if (location) {
      let rules = ['lat', 'lon', 'name']
      for (let item of rules) {
        if (!location[item]) {
          return next ( new BadRequest( translate.__(`You are missing value for ${item}`)))
        }
      }

    }

    const result = await authorHndl.updateProfile(name, username, bio, location, avatar, user)

    res.send({
      data: result
    })

  } catch (err) {
    return next(err)
  }
}

/**
 * Save settings for notifications
 *
 * @param {function} req
 * @param {function} res
 * @param {function} next
 */
const saveSettingsNotifications = async (req, res, next) => {
  try {
    let user = req.effectiveUser
    let collaboration = req.body.collaboration
    let social = req.body.social

    if (utils.isObjEmpty(collaboration)) {
      return next(new BadRequest(translate.__('Bad request, collaboration notifications settings not saved'))) //TODO: finish error text
    }

    if (utils.isObjEmpty(social)) {
      return next(new BadRequest(translate.__('Bad request, social notifications settings not saved'))) //TODO: finish error text
    }

    const author = await authorHndl.saveSettingsNotifications(user._id, collaboration, social)

    res.send({
      message: translate.__('You successfully saved settings for notifications'),
      data: author
    })

  } catch (err) {
    return next(err)
  }
}

/**
 * Save settings for push notifications
 *
 * @param {function} req
 * @param {function} res
 * @param {function} next
 */
const saveSettingsPushNotifications = async (req, res, next) => {
  try {
    let user = req.effectiveUser
    let notifications = req.body

    if (utils.isObjEmpty(notifications)) {
      return next(new BadRequest(translate.__('Bad request, notifications settings not sent'))) //TODO: finish error text
    }

    const author = await authorHndl.saveSettingsPushNotifications(user._id, notifications)

    res.send({
      message: translate.__('You successfully saved settings for push notifications'),
      data: author
    })

  } catch (err) {
    return next(err)
  }
}

/**
 * Forgot password
 *
 * @param {function} req
 * @param {function} res
 * @param {function} next
 */
const forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email
    // check if email
    if (!email) {
      return next(
        new BadRequest(translate.__('Missing email parameter')) //TODO: text
      )
    }

    let result = await authorHndl.forgotPassword(email)

    if (result.author) {
      // Emit reset password
      events.emit('reset_password', result)
    }

    res.send({
      status: true,
      message: 'Email link send on email ' + email
    })

  } catch (err) {
    return next(new InternalServerError(err))
  }
}

/**
 * Change password
 *
 * @param {function} req
 * @param {function} res
 * @param {function} next
 */
const changePassword = async (req, res, next) => {
  try {
    let oldPassword = req.body.oldPassword
    let newPassword = req.body.newPassword
    let newPassword2 = req.body.newPasswordConfirmation
    let user = req.effectiveUser

    if (!oldPassword) {
      return next(new BadRequest(translate.__('You need to send old password')))
    }

    const validateNewPass = utils.validatePassword(newPassword)
    if (validateNewPass) {
      return next(new BadRequest(validateNewPass))
    }

    const validateNewPass2 = utils.validatePassword(newPassword2)
    if (validateNewPass2) {
      return next(new BadRequest(validateNewPass2))
    }

    if (newPassword !== newPassword2) {
      return next(new BadRequest(translate.__('Failed to confirm new password, try again'))) //TODO: tekst poruke!
    }

    await authorHndl.changePassword(user, oldPassword, newPassword)

    res.send({
      status: true,
      message: 'Password is changed' //TODO: tekst poruke!
    })

  } catch (err) {
    return next(new InternalServerError(err))
  }
}

/**
 * Refresh author's token
 *
 * @param {Function} req Request
 * @param {Function} res Response
 * @param {Function} next Middleware
 * @returns {Promise<*>}
 */
const refreshToken = async (req, res, next) => {
  try {
    const email = req.body.email || null
    const token = req.body.refreshToken || null

    if (!email || !token || email == '' || token == '') {
      throw new BadRequest(translate.__('Missing parameters'))
    }

    // refresh token
    let result = await authorHndl.refreshToken(email, token)

    res.send({
      data: {
        token: {
          access: result.token.access,
          expired: result.token.expired,
          refresh: result.token.refresh,
        },
      }
    })
  } catch (err) {
    return next(err)
  }
}

/**
 * Delete author's account
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {object} //TODO: revision
 */
const deleteAccount = async (req, res, next) => {
  try {
    let author = req.effectiveUser
    let userId = req.params.id

    if (author._id.toString() !== userId ) {
      throw new BadRequest(translate.__('You don\'t have permission for this action'))
    }

    let result = await authorHndl.deleteAccount(userId)

    res.send({
      // status: true,
      message: 'You successfully deleted account',
      data: result //TODO: revision
    })

  } catch (err) {
    return next(err)
  }
}

/**
 * Set a new password
 *
 * @param {Function} req Request
 * @param {Function} res Response
 * @param {Function} next Middleware
 */
const setNewPassword = async (req, res, next) => {
  try {
    const code = req.body.code
    const password = req.body.password
    const retypedPassword = req.body.retypedPassword

    if (!code) {
      throw new BadRequest(translate.__('Code is required'))
    }
    if (!password) {
      throw new BadRequest(translate.__('Password is required'))
    }
    if (password !== retypedPassword) {
      throw new BadRequest(translate.__('Passwords must be the same'))
    }

    await authorHndl.setNewPassword(code, password)

    res.send({
      status: true,
      message: translate.__('You successfully reset password')
    })
  } catch (err) {
    return next(err)
  }
}

/**
 * Get author's profile from token
 *
 * @param {Function} req - Request
 * @param {Function} res - Response
 * @param {Function} next - Middleware
 */
const getMyProfile = (req, res, next) => {
  try {
    res.send({
      data: authorExtractor.myProfile(req.effectiveUser)
    })
  } catch (err) {
    console.log(err.stack)
    return next(err)
  }
}

/**
 * Get profile by username
 *
 * @param {Function} req - Request
 * @param {Function} res - Response
 * @param {Function} next - Middleware
 * @returns {Object} - Response
 */
const getProfileByUsername = async (req, res, next) => {
  try {
    const username = req.params.username

    if (!username) {
      throw new BadRequest(translate.__('Username is missing'))
    }

    const author = await authorHndl.getByUsername(username)
    const data = Object.assign({}, authorExtractor.getProfile(author), {
      following: author.following,
      followers: author.followers,
      stories: author.stories,
      shareLink: `${config.website.baseUrl}/${author.username}`
    })

    res.send({
      data
    })
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  changePassword,
  deleteAccount,
  forgotPassword,
  getMyProfile,
  getProfileByUsername,
  refreshToken,
  saveSettingsNotifications,
  saveSettingsPushNotifications,
  setNewPassword,
  singIn,
  singUp,
  updateProfile
}
