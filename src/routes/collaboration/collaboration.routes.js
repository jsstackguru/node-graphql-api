/**
 * @file Routes for collaboration
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import PRINTJ from 'printj'

// Handles
import collaborationHndl from '../../handles/collaboration.handles'
// Translate service
import translate from '../../lib/translate'
// Errors
import { BadRequest } from '../../lib/errors'
// libs
import utils from '../../lib/utils'
// Services
import log from '../../services/log'

const { sprintf } = PRINTJ

/**
 * Invite collaborators to story
 *
 * @param {function} req Request
 * @param {function} res Response
 * @param {function} next Middleware
 * @returns {Promise.<*>}
 */
export const add = async (req, res, next) => {

  try {
    const storyId = req.params.id
    const collaborators = req.body.collaborators
    // check if userIds are array and collaborators exist
    const userIdsBool = collaborators ? !Array.isArray(collaborators.userIds) : true
    // check if emailAdresses are array and collaborators exist
    const userMailsBool = collaborators ? !Array.isArray(collaborators.emailAddresses) : true

    if (!storyId || !utils.isObjectID(storyId)) {
      return next(new BadRequest(translate.__('Story ID is missing')))
    }

    let validation
    if (collaborators) {
      validation =
        (req.body.collaborators.userIds ? userIdsBool : false) ||
        (req.body.collaborators.emailAddresses ? userMailsBool : false) ||
        (!req.body.collaborators.emailAddresses && !req.body.collaborators.userIds)
    } else {
      validation = true
    }

    if (validation) {
      return next(new BadRequest(translate.__('Bad parameters')))
    }

    const userIds = collaborators.userIds || []
    let userMails = collaborators.emailAddresses || []
    const author = req.effectiveUser
    let idVal = 0
    let mailVal = 0

    // check Ids array for objectId validation, and properties
    // validation (add 1 if something's wrong)
    userIds.forEach(item => {
      if (!utils.isObjectID(item.id) && !item.edit) {
        idVal += 1
      }
    })
    // check emails array for properties validation (add 1 if something's wrong)
    userMails.forEach(item => !item.email || !item.edit ? mailVal += 1 : '')

    // if either ids or mail are invalid return error
    if (idVal || mailVal) {
      return next(new BadRequest(
        translate.__('Bad parameters, you need id/email and edit properties'))
      )
    }

    let result = []
    if (userIds.length > 0) {
      const invitedAuthors = await collaborationHndl.addCollaborators(userIds, storyId, author)
      result = result.concat(invitedAuthors)
    }
    if (userMails.length > 0) {
      const inviteMails =  await collaborationHndl.addCollaboratorsByEmail(
        userMails, storyId, author
      )
      result = result.concat(inviteMails)
    }

    res.send({
      data: result
    })
  } catch (err) {
    log.error(err)
    return next(err)
  }
}

/**
 * Cancel collaboration invitation
 *
 * @param {function} req Request
 * @param {function} res Response
 * @param {function} next Middleware
 * @returns {Promise.<*>}
 */
export const cancel = async (req, res, next) => {
  try {
    const storyId = req.body.storyId
    const emails = req.body.emails
    const user = req.effectiveUser
    
    if(!storyId || !utils.isObjectID(storyId)) {
      return next(new BadRequest(translate.__('Story ID is missing')))
    }

    if(!emails) {
      return next(new BadRequest(translate.__('Missing user\'s emails')))
    }

    const results = await collaborationHndl.cancelInvitation(user, storyId, emails)
    const { deletedCount } = results
    const message = translate.__(
      'The %s invitation(s) has been cancelled successfully'
    )

    res.send({
      status: true,
      message: deletedCount > 0 ? sprintf(message, deletedCount) : translate.__('No invitations to be canceled')
    })

  } catch (err) {
    return next(err)
  }
}

/**
 * Accept collaboration invitation
 *
 * @param {function} req Request
 * @param {function} res Response
 * @param {function} next Middleware
 * @returns {Promise.<*>}
 */
export const accept = async (req, res, next) => {
  try {

    let storyId = req.body.story_id
    // let accept = Boolean(req.body.accept) || false
    let accept = utils.paramBoolean(req.body.accept)
    let effectiveUser = req.effectiveUser

    if (!storyId || !utils.isObjectID(storyId)) {
      return next(new BadRequest(translate.__('Story ID is missing')))
    }

    await collaborationHndl.acceptInvitation(storyId, effectiveUser.id, accept)

    const messages = {
      true: translate.__('Invitation accepted'),
      false: translate.__('Invitation not accepted') //TODO: messages?
    }

    res.send({
      status: accept,
      message: messages[accept]
    })

  } catch (err) {
    return next(err)
  }
}

/**
 * Leave collaboration invitation
 *
 * @param {function} req Request
 * @param {function} res Response
 * @param {function} next Middleware
 * @returns {Promise.<*>}
 */
export const leave = async (req, res, next) => {
  try {

    const storyId = req.params.id
    const deletePages = utils.paramBoolean(req.body.deletePages)
    const user = req.effectiveUser

    if (!storyId || !utils.isObjectID(storyId)) {
      return next(new BadRequest(translate.__('Story ID is missing')))
    }
    const result = await collaborationHndl.leaveCollaboration(user, storyId, deletePages)

    res.send({
      // status: true,
      message: 'You successfully leaved story',
      data: result //TODO: revision data! mislim da ipak ne treba
    })

  } catch (err) {
    return next(err)
  }
}

/**
 * Remove user from collaboration
 *
 * @param {function} req Request
 * @param {function} res Response
 * @param {function} next Middleware
 * @returns {Promise.<*>}
 */
export const remove = async(req, res, next) => {
  try {

    let storyId = req.params.id
    let userId = req.body.userId
    let effectiveUser = req.effectiveUser

    if (!storyId || !utils.isObjectID(storyId)) {
      return next(new BadRequest(translate.__('Story ID is missing')))
    }

    if (!userId) {
      return next(new BadRequest(translate.__('User ID is missing')))
    }
    
    let collaboratorIds
    if (typeof userId === 'string') {
      collaboratorIds = [userId]
    } else {
      collaboratorIds = userId
    }
    const results = []
    for(const id of collaboratorIds) {
      const response = await collaborationHndl.removeFromCollaboration(storyId, id, effectiveUser)
      if (response && !response.errorCode) {
        results.push(response)
      }
    }
    
    const message = Array.isArray(userId)
      ? translate.__('Users are removed from collaboration')
      : translate.__('User is removed from collaboration')

    res.send({
      message,
      data: results
    })

  } catch(err) {
    log.error(err)
    return next(err)
  }
}

/**
 * Update collaborator on Story
 * 
 * @param {Function} req Request
 * @param {Function} res Response
 * @param {Function} next Middleware
 */
export const update = async (req, res, next) => {
  try {
    const user = req.effectiveUser
    const storyId = req.params.id
    const authorId = req.body.userId
    const edit = req.body.edit || false
    
    if (!storyId) {
      throw new BadRequest(translate.__('Story ID is missing'))
    }
    if (!authorId) {
      throw new BadRequest(translate.__('Author ID is missing'))
    }

    const result = await collaborationHndl.updateCollaborator(user, storyId, authorId, edit)

    res.send({
      message: translate.__('You have successfully updated collaborator'),
      data: result
    })
  } catch (err) {
    return next(err)
  }
}
