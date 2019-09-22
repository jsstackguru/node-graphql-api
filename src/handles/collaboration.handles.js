import randtoken from 'rand-token'

// Models
import CollaborationInvite from '../models/collaboration-invite/collaboration-invite.model'
import { authorExtractor, Author } from '../models/author'
import { storyExtractor, Story } from '../models/story'
// Libraries
import translate from '../lib/translate'
import { UnprocessableEntity, Forbidden, BadRequest } from '../lib/errors'
import events from '../services/events'
// Services
import eventEmitter from '../services/events'
import log from '../services/log'
// Handles
import { copyPagesFromStory, getUserPages } from '../handles/page.handles'

// function evaluates permission if user can invite someone
const evaluatePermission = (collaborator, edit) => {
  if (collaborator.edit) {
    return true
  } else {
    return edit ? false : true
  }
}

/**
 * Leave collaboration
 *
 * @param {object} user
 * @param {string} storyId
 * @param {boolean} deletePages whether author of pages want to delete pages from Story
 * @returns {Promise.<*>}
 */
const leaveCollaboration = async (user, storyId, deletePages) => {
  try {
    let story = await Story.findOneActiveById(storyId, 'throw_err_if_not_found')

    // remove user from story
    let collaborators = story.collaborators
    let collaboratorIds = collaborators.map( coll => coll['author'])
    // if not collaborator on story
    if (!collaboratorIds.find(a => a.equals(user.id))) {
      throw new UnprocessableEntity(translate.__('You are not collaborator on this story'))
    }
    collaborators.splice(collaboratorIds.indexOf(user.id), 1)

    // get pages from users
    let userPages = await getUserPages(user._id, story.pages)

    let storyCopy = null

    if (userPages.length > 0) {
      // copy pages in new story
      storyCopy = await copyPagesFromStory(user, story)

      if (!storyCopy) {
        throw new UnprocessableEntity( translate.__('New Story has not been created') )
      }

      story.collaborators = collaborators

      if (deletePages) {

        let storyPages = story.pages
        let userPageIds = userPages.map(page => page['_id'])

        userPageIds.forEach(pageId => storyPages.splice(storyPages.indexOf(pageId), 1))

        story.pages = storyPages
      }

    }

    await story.save()

    eventEmitter.emit('leave_collaboration', {
      user,
      story,
      newStory: storyCopy
    })

    return storyCopy ? storyExtractor.basic(storyCopy) : null

  } catch (err) {
    throw err
  }

}

/**
 * Ban user from collaboration
 *
 * @param {string} storyId
 * @param {string} userId
 * @param {object} effectiveUser
 * @returns object
 */
const removeFromCollaboration = async (storyId, userId, author) => {
  try {
    // find story
    let story = await Story.findOneActiveById(storyId, 'throw_err_if_not_found')

    if (author._id.toString() != story.author.toString()) {
      throw new UnprocessableEntity(translate.__('You don\'t have permission for this action.')) //TODO: naziv poruke
    }

    // check is valid collaborator on the story
    let collaborator = story.collaborators.find(coll => {
      return coll.author.equals(userId)
    })
    if (!collaborator) {
      throw new UnprocessableEntity(translate.__('This user is not collaborator on story.')) //TODO: naziv poruke
    }

    // get user by id
    let user = await Author.findById(userId)
    // copy pages in new story
    let storyCopy = await copyPagesFromStory(user, story)

    // get pages from user
    let userPages = await getUserPages(user._id, story.pages)

    // remove user/collaborator from story
    let collaborators = story.collaborators.filter(c => c.author != userId)

    story.collaborators = collaborators

    // delete pages from story
    let storyPages = story.pages
    let userPageIds = userPages.map(page => page['_id'])

    userPageIds.forEach( pageId => storyPages.splice(storyPages.indexOf(pageId), 1))
    story.pages = storyPages

    await story.save()

    events.emit('remove_from_collaboration', {
      author,
      user,
      storyId,
      newStory: storyCopy
    })

    return storyCopy
  } catch(err) {
    log.error(err)
    return err
  }
}

/**
 * Add collaborators to Story
 *
 * @param {Array} invitations
 * @param {String} storyId
 * @param {Object} effectiveUser
 * @returns {*}
 */
export const addCollaborators = async (invitations, storyId, authorUser) => {
  try {
    let sendInvitations = []

    if (invitations.length == 0) return null

    invitations.forEach(invitation => {
      sendInvitations.push( addCollaborator(invitation.id, storyId, authorUser, invitation.edit) )
    })

    let sentInvitations = await Promise.all(sendInvitations)

    // return invited authors
    let authorIds = sentInvitations.map(i => i.id)

    let invitedAuthors = await Author.find({
      _id: { $in: authorIds },
      deleted: false,
      active: true
    }, 'id name username avatar email')
    
    return invitedAuthors.map(author => authorExtractor.basic(author))
  } catch (err) {
    throw err
  }
}

/**
 * Add a collaborator to the Story
 *
 * @param {Array} collaboratorId
 * @param {String} storyId
 * @param {Object} user
 * @param {Boolean} edit
 * @returns {Object}
 */
export const addCollaborator = async (collaboratorId, storyId, user, edit) => {
  try {
    // get user for collaboration
    let collaborator = await Author.findById(collaboratorId)

    if (!collaborator) {
      throw new UnprocessableEntity(translate.__('User not found'))
    }

    let story = await Story.findOneActiveById(storyId)

    if (!story) {
      throw new UnprocessableEntity(translate.__('Story not found'))
    }

    // check does user may invite someone
    let collaboratorAuthor = story.collaborators.find(coll => {
      return coll.author.equals(user._id)
    })

    // permissions: collaborator may invite with edit status of their own
    if (collaboratorAuthor && !story.author.equals(user.id) &&
      !evaluatePermission(collaboratorAuthor, edit)) {
      throw new UnprocessableEntity(translate.__('You don\'t have permission for this Story'))
    }

    // check does user can invite someone
    let collaboratorExist = story.collaborators.find(coll => {
      return coll.author.equals(collaboratorId)
    })

    if (collaboratorExist) {
      throw new UnprocessableEntity(translate.__('User is already collaborator on this Story'))
    }

    // update story with the new collaborator
    await Story.findByIdAndUpdate(story._id, {
      $push: { collaborators: collaborator }
    })

    let oldCollaboratorIds = null
    // find old collaborators
    if (story.collaborators.length > 0) {
      oldCollaboratorIds = story.collaborators && story.collaborators.map(coll => coll.author)
    }

    // emit event
    events.emit('add_collaborator', {
      edit,
      story,
      collaborator,
      oldCollaboratorIds,
      user
    })

    return {
      id: collaborator.id,
      name: collaborator.name,
      username: collaborator.username,
      email: collaborator.email,
      avatar: collaborator.avatar,
      edit
    }
  } catch (err) {
    throw err
  }
}

export const addCollaboratorsByEmail = async (invitations, storyId, effectiveUser) => {
  try {
    if (invitations.length == 0) return null

    let emails = invitations.map(i => i['email'])

    // get unique email addresses
    emails = [...new Set(emails)]

    let sendInvitations = []

    emails.forEach(emailAddress => {
      let invitation = invitations.find(i => {
        return i.email == emailAddress
      })

      sendInvitations.push(
        addCollaboratorByEmail(
          emailAddress,
          storyId,
          effectiveUser,
          invitation ? invitation.edit : false, invitation ? invitation.name : ''
        )
      )
    })

    let invitedUsers = await Promise.all(sendInvitations)

    return invitedUsers
  } catch (err) {
    log.error(err)
    return err
  }
}

/**
 * Invite collaborator by mail to Story
 *
 * @param {string} userId
 * @param {string} storyId
 * @param {object} user
 * @param {boolean} edit
 * @param {string} name // TODO: nema u modelu
 * @returns object
 */
export const addCollaboratorByEmail = async (emailAddress, storyId, user, edit, name) => {
  try {
    // TODO: sta ako user sam sebi posalje invite?
    let story = await Story.findById(storyId)

    if (!story) {
      throw new UnprocessableEntity(translate.__('Story not found'))
    }

    // check does user can invite someone
    let collaboratorAuthor = story.collaborators.find(coll => {
      // return coll.author.toString() === user._id
      return coll.author.equals(user._id)
    })

    // permissions: collaborator may invite with edit status of their own
    if (collaboratorAuthor && story.author !== user._id &&
      !evaluatePermission(collaboratorAuthor, edit))
    {
      throw new UnprocessableEntity(translate.__('You don\'t have permission for this Story'))
    }

    // get user for collaboration
    let collaborator = await Author.findOne({
      email: emailAddress,
      active: true,
      deleted: false
    })

    if (collaborator) {
      const collaboratorExist = story.collaborators.find(coll =>
        coll.author.equals(collaborator.id))
      if (collaboratorExist) {
        return null
      }
    }

    // try to find existing invitation
    let invitations = await CollaborationInvite.find({
      email: emailAddress,
      story: storyId,
      active: true
    })

    if (invitations.length > 0) {
      throw new UnprocessableEntity(translate.__('Invitation sent already'))
    }

    // generate token
    const token = randtoken.generate(32)

    // send invitation to user
    await CollaborationInvite.create({
      author: user.id,
      story: storyId,
      active: true,
      created: new Date(),
      email: emailAddress,
      edit: edit || false,
      name: collaborator && collaborator.name || emailAddress,
      token
    })

    // Trigger event for invitation
    events.emit('add_collaborator_by_email', {
      story,
      user,
      edit,
      email: emailAddress,
      token
    })

    let collaboratorName = ''
    if (collaborator) {
      collaboratorName = collaborator.name
    } else if (name) {
      collaboratorName = name
    }

    return {
      id: collaborator ? collaborator.id : null,
      name: collaboratorName,
      username: collaborator ? collaborator.username : null,
      avatar: collaborator ? collaborator.avatar : null,
      email: collaborator ? collaborator.email : emailAddress,
      edit: edit
    }
  } catch (err) {
    log.error(err)
    return err
  }

}

/**
 * Update collaborator
 * 
 * @param {Object} user 
 * @param {String} storyId 
 * @param {String} authorId 
 * @param {Boolean} edit 
 */
export const updateCollaborator = async (user, storyId, authorId, edit = false) => {
  try {
    const story = await Story.findOneActiveById(storyId)
    if (!story) {
      throw new UnprocessableEntity(translate.__('Story not found'))
    }
    const author = await Author.findOneActiveById(authorId)
    if (!author) {
      throw new UnprocessableEntity(translate.__('Author not found'))
    }
    if (!story.author.equals(user.id) && !story.collaborators.find(
      collaborator => collaborator.author.equals(user.id) && collaborator.edit
    )) {
      throw new Forbidden(translate.__('You don\'t have permission to this Story'))
    }

    story.collaborators.forEach(coll => {
      if (coll.author.equals(authorId)) {
        coll.edit = edit
      }
    })

    await story.save()

    await story.populate('collaborators.author', authorExtractor.basicProperties).execPopulate()

    return story.collaborators.find(collaborator => collaborator.author.equals(authorId))
  } catch (err) {
    throw err
  }
}

/**
 * Cancel invitations by the emails
 * 
 * @param {Object} user 
 * @param {String} storyId 
 * @param {Array} emails 
 */
const cancelInvitation = async (user, storyId, emails) => {
  try {
    if (!emails) {
      throw new BadRequest(translate.__('Emails not found'))
    }
    if (!user) {
      throw new UnprocessableEntity(translate.__('User not found'))
    }
    const story = await Story.findOneActiveById(storyId)
    if (!story) {
      throw new UnprocessableEntity(translate.__('Story not found'))
    }
    if (!story.author.equals(user.id) && !story.collaborators.find(
      coll => coll.author.equals(user.id) && coll.edit
    )) {
      throw new Forbidden(translate.__('You don\'t have permission for this action'))
    }

    // delete all collaboration invitations
    const invitations = await CollaborationInvite.deleteMany({
      email: { $in: emails },
      author: user.id,
      active: true,
      story: storyId,
      edit: true,
      accepted: false
    })

    return invitations
  } catch (err) {
    throw err
  }
}

/**
 * Get all peding collaborator invitations
 * @param {String} id - Story ID
 * @returns {Array} - Pending collaborators
 */
const getPadingInvitations = async id => {
  try {
    const invitations = await CollaborationInvite.find({
      story: id,
      active: true,
      edit: true
    })

    return invitations
  } catch (err) {
    throw err
  }
}

/**
 * Get all peding collaborators
 * @param {String} id - Story ID
 * @returns {Array} - Pending collaborators
 */
const getPadingCollaborators = async id => {
  try {
    const collaboratorIds = await getPadingCollaboratorIds(id)

    if (collaboratorIds) {
      const collaborators = await Author.find({
        _id: { $in: collaboratorIds },
        active: true,
        deleted: false
      })

      return collaborators
    }
    return null
  } catch (err) {
    throw err
  }
}

/**
 * Get all peding collaborators
 * @param {String} id - Story ID
 * @returns {Array} - Pending collaborators
 */
const getPadingCollaboratorIds = async id => {
  try {
    const invitations = await getPadingInvitations(id)

    if (invitations) {
      const authorIds = invitations.map(invitation => invitation.author)

      return authorIds
    }
    return []
  } catch (err) {
    throw err
  }
}

module.exports = {
  addCollaborator,
  addCollaborators,
  addCollaboratorByEmail,
  addCollaboratorsByEmail,
  cancelInvitation,
  getPadingCollaborators,
  getPadingCollaboratorIds,
  getPadingInvitations,
  leaveCollaboration,
  removeFromCollaboration,
  updateCollaborator
}
