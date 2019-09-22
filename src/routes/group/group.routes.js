/**
 * @file Routes for group sharing
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

/*  Handlers  */
import groupHndl from '../../handles/group.handles'
/*  Libraries */
import { BadRequest } from '../../lib/errors'
import translate from '../../lib/translate'
import { isObjectID } from '../../lib/utils'
import utils from '../../lib/utils'

/**
 * Invite user to group
 *
 * @param {Function} req Request
 * @param {Function} res Response
 * @param {Function} next Middleware
 * @returns {Promise<*>}
 */
const invite = async (req, res, next) => {
  try {
    const author = req.effectiveUser
    const email = req.body.email

    if (!email) {
      throw new BadRequest(translate.__('Email is required'))
    }

    const invitation = await groupHndl.inviteUser(author.id, email)

    res.send({
      message: 'You successfully send invitation',
      data: invitation
    })

  } catch (err) {
    return next(err)
  }
}

/**
 * Accept invitation to group
 *
 * @param {Function} req Request
 * @param {Function} res Response
 * @param {Function} next Middleware
 * @returns {Promise<*>}
 */
const accept = async (req, res, next) => {
  try {
    const token = req.body.token
    const accept = utils.paramBoolean(req.body.accept)

    if (!token) {
      throw new BadRequest(translate.__('Token is required'))
    }

    const result = await groupHndl.acceptInvitation(token, accept)

    res.send({
      message: translate.__('You successfully send response on invitation'),
      data: result //TODO: bolji response?
    })

  } catch (e) {
    return next(e)
  }
}

/**
 * Leave group
 *
 * @param {Function} req Request
 * @param {Function} res Response
 * @param {Function} next Middleware
 * @returns {Promise<*>}
 */
const leave = async (req, res, next) => {
  try {
    const user = req.effectiveUser

    const result = await groupHndl.leaveGroup(user.id)

    res.send({
      message: 'You have successfully left the group',
      data: {
        group: result._id
      }
    })

  } catch (err) {
    return next(err)
  }
}

/**
 * Remove from group
 *
 * @param {Function} req Request
 * @param {Function} res Response
 * @param {Function} next Middleware
 * @returns {Promise<*>}
 */
const remove = async (req, res, next) => {
  try {
    let groupUserId = req.body.groupUser
    let groupId = req.body.group
    let author = req.effectiveUser

    if (!groupUserId || !isObjectID(groupUserId) || groupUserId == author.id) {
      throw new BadRequest(translate.__('User ID is not correct')) //TODO: message revision
    }

    let result = await groupHndl.removeFromGroup(author.id, groupUserId, groupId)

    res.send({
      message: 'You successfully removed user from group',
      data: {
        group: result._id
      }
    })

  } catch (err) {
    return next(err)
  }
}

/**
 * Cancel group invitation
 *
 * @param {Function} req Request
 * @param {Function} res Response
 * @param {Function} next Middleware
 * @returns {Object<status: Boolean, message: String>}
 */
const cancel = async (req, res, next) => {
  try {

    let author = req.effectiveUser
    let invitation = req.params.id

    if (!invitation || !isObjectID(invitation)) {
      throw new BadRequest(translate.__('Invitation ID is missing or not correct format')) //TODO: message!
    }

    await groupHndl.cancelGroupInvitation(author.id, invitation) // TODO: obrisi result ako se ne salje...

    res.send({
      status: true,
      message: 'You successfully canceled group invitation',
    })

  } catch (err) {
    return next(err)
  }
}

export default {
  invite,
  accept,
  leave,
  remove,
  cancel
}
