

/**
 * @file Jobs for the collaboration
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

// Handlers
import * as deviceHndl from '../../handles/device.handles'
// utils
import { filterUsersFromStory } from '../../lib/utils'
// Services
import { collaborationInvitation, collaborationInvitationByEmail } from '../email'
import { saveActivity } from '../activity'
import { sendPushNotification } from '../push-notification/ios'

// Models
import Story from '../../models/story'
import translate from '../../lib/translate'

/**
 * Job for collaboration invitation
 *
 * @param {Object} job
 */
export const collaborationInvite = async data => { //TODO: ???
  try {
    if (data.emailAddress) {
      await collaborationInvitationByEmail(data.emailAddress, data.collaborator, data.story, data.user, data.edit)
    } else {
      await collaborationInvitation(data.collaborator, data.story, data.user, data.edit)
    }
    // TODO: send push notification if it's needed
    // commonFunctions.sendNotifications(userId, user.username + ' just invited you to collaborate on journal ' + journal.title, 'info');
    // TODO: Send push notification for invitation by email
    // send push notifications
    // if (collaborator && collaborator.pushNotif && collaborator.pushNotif.collaborationRequest && collaborator.id) {
    //   commonFunctions.sendNotifications(collaborator.id, user.username + ' just invited you to collaborate on journal ' + journal.title, 'info');
    // }
  } catch (err) {
    throw err
  }
}

/**
 * Job for remove collaborator
 * @param {Object} data
 */
export const userRemoveYouFromCollaboration = async data => {
  try {
    const { author, newStory, storyId, user } = data

    // save activity for removed collaborator
    await saveActivity({
      author: author.id,
      type: 'collaboration_removed',
      active: true,
      data: {
        storyId,
        userId: user.id
      }
    })

    // find story
    const story = await Story.findById(storyId)

    if (story) {
      // send push notification
      const tokens = await deviceHndl.getDeviceTokensByUserIds(user.id)

      await sendPushNotification(
        tokens,
        translate.__(`${author.username} removed you from collaborating on the Story ${story.title}`),
        translate.__('Collaboration')
      )

      // Send notifications if a new story has been created
      if (newStory) {
        // save activity for removed collaborator
        await saveActivity({
          author: user.id,
          type: 'collaboration_story_copy',
          active: true,
          data: {
            storyId
          }
        })

        // Send push notification
        await sendPushNotification(
          tokens,
          translate.__(`Your pages from Story ${story.title} are moved to the new Story ${newStory.title}`),
          translate.__('Collaboration')
        )
      }
    }
  } catch (err) {
    throw err
  }
}

/**
 * User has been removed from collaboration
 * @param {Object} data
 */
export const userRemoveAnotherCollaborator = async data => {
  try {
    const { storyId, user } = data

    // Find other collaborators on story
    const story = await Story.findById(storyId)

    if (story) {
      const collaboratorIds = story.collaborators.map(coll => coll.author)
      // Send push notifications
      const tokens = await deviceHndl.getDeviceTokensByUserIds(collaboratorIds)
      await sendPushNotification(
        tokens,
        translate.__(`${user.username} has been removed from collaborating on Story ${story.title}`),
        translate.__('Collaborator removed')
      )
    }

  } catch (err) {
    throw err
  }
}

/**
 * User added collaborator
 * @param {Object} data
 */
export const collaboratorAdded = async data => {
  try {
    const { story, user, collaborator } = data
    // activity
    await saveActivity({
      author: user.id,
      type: 'collaboration_added',
      active: true,
      data: {
        collaboratorId: collaborator.id,
        storyId: story.id,
      }
    })

    // notifications for all authors on story, except user and added collaborator
    const usersToReceive = filterUsersFromStory(story, [user._id, collaborator._id])
    const tokens = await deviceHndl.getDeviceTokensByUserIds(usersToReceive)
    await sendPushNotification(
      tokens,
      translate.__(`${user.username} added ${collaborator.username} to Story ${story.title}`),
      translate.__('Collaborator added')
    )

    // notification for added collaborator
    const collaboratorToken = await deviceHndl.getDeviceTokensByUserIds(collaborator._id)
    await sendPushNotification(
      collaboratorToken,
      translate.__(`${user.username} added you to Story ${story.title}`),
      translate.__('Collaborator added')
    )
  } catch (err) {
    throw err
  }
}

/**
 * User leave collaboration
 *
 * @param {object} data
 */
export const collaboratorLeaved = async data => {
  try {
    const { user, story } = data

    // activity
    await saveActivity({
      author: user.id,
      type: 'collaboration_leaved',
      active: true,
      data: {
        storyId: story.id,
        collaboratorId: user.id
      }
    })
    // push notification
    const usersToReceive = filterUsersFromStory(story, [user._id])
    const tokens = await deviceHndl.getDeviceTokensByUserIds(usersToReceive)
    await sendPushNotification(
      tokens,
      translate.__(`${user.username} is no longer collaborating on Story ${story.title}`),
      translate.__('Collaborator leaved')
    )
  } catch (err) {
    throw err
  }
}

export const collaborationShareFalse = async data => {
  try {
    const {userId, collaboratorIds, story} = data

    // activity
    await saveActivity({
      author: userId,
      type: 'collaboration_share_false',
      active: true,
      data: {
        storyId: story.id,
        oldCollaborators: collaboratorIds
      }
    })
    // push notifications
    const tokens = await deviceHndl.getDeviceTokensByUserIds(collaboratorIds)
    await sendPushNotification(
      tokens,
      translate.__(`${story.author.username} changed story status to private, you are no more collaborating on story ${story.title}`),
      translate.__('Author change story status')
    )

  } catch (err) {
    throw err
  }
}

