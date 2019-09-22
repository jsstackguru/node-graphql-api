/**
 * @file Jobs for the story
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

// handles
import deviceHndl from '../../handles/device.handles'

// Services
import { saveActivity } from '../activity'
import { storySharedEmail, storySharedByEmailEmail } from '../email'
import { sendPushNotification } from '../push-notification/ios'

/**
 * Story update
 * @param {Object} data
 */
export const storyUpdate = async data => {
  try {
    const { author, story, newContent } = data
    // Activity data
    // const activityData = { story }

    if (newContent) {
      Object.assign(data, {
        newContent
      })
    }
    // Save activity
    return await saveActivity({
      type: 'story_updated',
      author: author.id,
      active: true,
      data: {
        storyId: story.id
      }
    })
  } catch (err) {
    throw err
  }
}

/**
 * Story created
 * @param {Object} data
 */
export const storyCreated = async data => {
  try {
    const { author, story } = data

    // create activity
    return await saveActivity({
      type: 'story_created',
      author: author.id,
      active: true,
      data: {
        storyId: story.id
      }
    })

  } catch (err) {
    throw err
  }
}

/**
 * Favorite story
 * @param {Object} data
 */
export const favoriteStory = async data => {
  try {
    const { author, story } = data

    // create activity
    return await saveActivity({
      type: 'favorite_added',
      author: author.id,
      active: true,
      data: {
        storyId: story.id
      }
    })
  } catch (err) {
    throw err
  }
}

/**
 * Story shared
 * @param {Object} data
 */
export const storyShared = async data => {
  try {
    const { story, collaborator } = data

    // send email
    await storySharedEmail(story, collaborator)

    // create activity
    return await saveActivity({
      type: 'story_shared',
      author: collaborator.id,
      active: true,
      data: { storyId: story.id }
    })
  } catch (err) {
    throw err
  }
}

/**
 * Story shared by email
 * @param {Object} data
 */
export const storySharedByEmail = async data => {
  try {
    const { story, collaborator } = data

    // send email
    await storySharedByEmailEmail(story, collaborator)

  } catch (err) {
    throw err
  }
}

/**
 * Comments and replies
 * @param {Object} data
 */
export const commentsAndReplies = async data => {
  try {
    const { author, story, comment } = data

    // save activity ?


    // Send push notification
    const tokens = await deviceHndl.getDeviceTokensByUserId(author.id)
    sendPushNotification(tokens, `${author.username} commented on Story ${story.title}: "${comment.text}"`)

  } catch (err) {
    throw err
  }
}
