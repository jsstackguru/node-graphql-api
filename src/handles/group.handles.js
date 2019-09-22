/**
 * @file Handler for sharing collection
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

/*  Models  */
import { Group } from '../models/group'
import { Author, authorExtractor } from '../models/author'
import { GroupInvite } from '../models/group-invite'

/*  Libraries */
import { UnprocessableEntity, BadRequest } from '../lib/errors'
import translate from '../lib/translate'
import { generateToken } from '../lib/utils'
import utils from '../lib/utils'

/*  Services  */
import eventEmitter from '../services/events'

/*  config  */
import config from '../config'




/**
 * Evaluation for group members limit
 *
 * @param {String} authorId
 * @returns {Boolean}
 */
const isGroupOpen = async (authorId, membersLimit) => {
  try {
    // group members limit, provided use that one, otherwise use config limit
    const limit = typeof membersLimit === 'number' ? membersLimit : config.group.limit

    // if limit is not number then return true
    if (typeof limit !== 'number') return true

    let allMembersIds = []

    // find group
    const group = await Group.findForAuthor(authorId)

    // if group then concat all members and owner id
    if (group) allMembersIds = [...group['members'], group.owner]

    // if all members then all members, otherwise just authorId
    let finalMembers = allMembersIds ? allMembersIds : authorId
    const groupPendingInvitations = await GroupInvite.findAllPendingInvitations(finalMembers)
    // final evaluation for number of FG members compared to limit
    return Boolean(allMembersIds.length + groupPendingInvitations.length < limit)

  } catch (err) {
    throw err
  }
}

/**
 * Invite user by author id
 *
 * @param {String} authorId
 * @param {String} email
 * @returns {Promise<{status: boolean, email: string, invited: object, token: string}>}
 */
const inviteUser = async (authorId, email) => {

  try {
    // validation: email
    if (!email || !utils.isValidEmail(email)) {
      throw new BadRequest(translate.__('Email is required'))
    }

    // validation: author
    const author = await Author.findOneActiveById(authorId, 'throw_err_if_not_found')

    // validation: invitation
    const invitationEmail = await GroupInvite.findOne({
      'invited.email': email,
      active: true,
      accepted: false // TODO: revision: da li treba ovaj accepted?
    })
    // console.log('hoj', author)
    if (invitationEmail) {
      throw new UnprocessableEntity(translate.__('Invitation already sent')) //TODO: message
    }

    // validation: is group open
    const groupOpen = await isGroupOpen(authorId)
    if (!groupOpen) {
      throw new UnprocessableEntity(translate.__('There is no place for another member right now')) //TODO: message
    }

    // try to find author with email
    const invited = await Author.findActiveByEmail(email)

    // validation: group
    const group = invited ? await Group.findForAuthor(invited.id) : null
    if (group) {
      throw new UnprocessableEntity(translate.__('Author already in group')) //TODO: message
    }

    // invite author
    const token = generateToken()
    await GroupInvite.create({
      author: author.id,
      invited: {
        author: invited ? invited.id : null,
        email: email
      },
      active: true,
      accepted: false,
      token: token,
    })

    // emit event
    eventEmitter.emit('group_invitation', {
      author: author,
      token: token,
      invited: invited ? invited : null,
      email: email,
    })

    return {
      email: email,
      invited: invited ? authorExtractor.basic(invited) : null,
      token: token,
    }

  } catch (err) {
    throw err
  }
}

/**
 * Accept invitation for group
 *
 * @param {string} token
 * @param {boolean} [accept=false]
 * @returns {Object<{accepted: boolean, group: string}>}
 */
const acceptInvitation = async (token, accept) => {
  try {
    // try to find invitation
    const invitation = await GroupInvite.findOne({token: token, active: true})

    if (!invitation) {
      throw new UnprocessableEntity(translate.__('Invitation does not exist or has been expired'))
    }

    const user = await Author.findOneActiveById(invitation.invited.author)

    if (!user) {
      throw new UnprocessableEntity(translate.__('User not found'))
    }

    // update invitation status
    invitation.active = false
    invitation.accepted = accept
    await invitation.save()

    // if invitation accepted
    if (accept) {
      let group = await Group.findForAuthor(invitation.author)

      const newMember = user.id

      if (!group) {
        // create new group
        group = await Group.create({
          owner: invitation.author,
          members: [newMember],
          active: true,
        })

        eventEmitter.emit('group_new_group', {
          author: invitation.author,
          newMember: user,
          accepted: accept,
        })
      } else {
        // add new member to group
        let newArr = group.members
        newArr.push(newMember)
        group.members = newArr
        await group.save()

        eventEmitter.emit('group_invitation_accept', {
          author: user,
          accepted: accept,
          groupShare: group
        })
      }

      return {
        accepted: accept,
        group: group.id,
      }
    }

    return {
      accepted: accept,
      group: null,
    }

  } catch (err) {
    throw err
  }
}

/**
 * Leave group
 *
 * @param {String} email
 * @returns {Object}
 */
const leaveGroup = async (authorId) => {//TODO: revision
  try {

    let author = await Author.findOneActiveById(authorId, 'throw_err_if_not_found')

    let group = await Group.findForAuthor(authorId, 'throw_err_if_not_found')

    // OWNER leave
    if (group.owner == authorId) {
      group.owner = null
    // MEMBER leave
    } else {
      // filter member
      let newGroupMembers = group.members.filter(a => a != authorId)
      // remove member
      group.members = newGroupMembers
    }
    // save group in DB
    await group.save()
    // emmit event
    eventEmitter.emit('group_leave', {
      author: author.id,
      group
    })

    return group

  } catch (err) {
    throw err
  }
}

/**
 * Remove user from group
 *
 * @param {String} ownerId
 * @param {String} groupUserId
 * @param {String} groupId
 * @returns {Promise}
 */
const removeFromGroup = async (ownerId, groupUserId, groupId) => {
  try {
    let group = await Group.findOneActiveById(groupId, 'throw_err_if_not_found')

    // if owner is invalid or there is no user to remove from group
    if (group.owner != ownerId || !group.members.map(m => String(m)).includes(groupUserId)) {
      throw new BadRequest(translate.__('You don\'t have permission for this action'))
    }
    // filter member
    let newGroupMembers = group.members.filter(m => m != groupUserId)
    // remove member
    group.members = newGroupMembers
    // save group in DB
    await group.save()

    // emmit event
    eventEmitter.emit('group_remove', {
      author: ownerId,
      group
    })

    return group

  } catch (err) {
    throw err
  }
}

/**
 * Cancel group invitation
 *
 * @param {String} authorId
 * @param {String} invitationId
 * @returns {Promise}
 */
const cancelGroupInvitation = async (authorId, invitationId) => {
  try {

    let invitation = await GroupInvite.findOneActiveById(invitationId, 'throw_err_if_not_found')

    if (invitation.author.toString() != authorId.toString()) {
      throw new BadRequest(translate.__('You don\'t have permission for this action'))
    }

    // emmit event
    eventEmitter.emit('group_cancel', { //TODO: nisam siguran da treba ovaj emiter
      author: authorId,
      invitation
    })

    return await invitation.remove()
  } catch (err) {
    throw err
  }
}

export default {
  isGroupOpen,
  inviteUser,
  acceptInvitation,
  leaveGroup,
  removeFromGroup,
  cancelGroupInvitation
}
