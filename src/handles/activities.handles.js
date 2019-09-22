// models
import Author from '../models/author/author.model'
import Activity from '../models/activity/activity.model'
import Following from '../models/following/following.model'
import Story from '../models/story/story.model'
import Page from '../models/page/page.model'
import CollaborationInvite from '../models/collaboration-invite/collaboration-invite.model'
import Comments from '../models/comment/comment.model'
import GroupInvite from '../models/group-invite/group-invite.model'
// lib
import activityTypes from '../lib/activityTypes'
// config
import config from '../config'

/**
 * get social activities for user
 *
 * @param {Object} user
 * @returns
 */
const getNewSocialActivities = async (user, filters) => {
  try {
    let lastSocialUpdate = user.lastActivityCheck.social
    // find followings
    let followings = await Following.find({author: user._id})
    //  extract only Ids
    let followingsIds = followings.map(f => f['follows'])

    // find all stories where authors is collaborator (edit: false)
    let stories = await Story.findAuthorsCollaborations(user._id, false)
    let authorsIds = stories.map(story => story.author)

    // add to query, followings and authors where user is collaborator with read rigths
    let activities = await Activity.findNewActivitiesSocial([...followingsIds, ...authorsIds], lastSocialUpdate)

    // GQL filter
    if (filters) {
      let final = activities.filter(a => filters.includes(activityTypes[a.type]['filter']))
      return final
    }
    return activities

  } catch (err) {
    return err
  }
}

/**
 *  get timeline activities for user
 *
 * @param {Object} user
 * @oaram {Array} filters
 * @returns
 */
const getNewTimelineActivities = async (user, filters) => {
  try {
    const lastTimelineUpdate = user.lastActivityCheck.timeline
    const activities = await Activity.findNewActivitiesTimeline(user._id, lastTimelineUpdate)

    // GQL filter
    if (filters) {
      const final = activities.filter(a =>  filters.includes(activityTypes[a.type]['filter']))
      return final
    }

    return activities

  } catch (err) {
    return err
  }
}

/**
 * Return right author properties based on id
 *
 * @param {object} story
 * @param {string} id
 * @returns
 */
const findRightUser = (story, id) => {
  // sum author and collaborator props in one array, then filter
  let res = [...story.collaborators.map(c => c.author), story.author]
    .filter(a => a != id.toString())
  return res.length > 0 ? res[0]['username'] : ''
}

/**
 * Return object with values as functions that return messages
 *
 * @param {string} activityType
 * @param {string} title
 * @param {string} actualNewCollaborator
 * @returns {string}
 */
const activityMessagesMatrix = (activityType, title, actualNewCollaborator) => {
  const resolveMessages = {
    'collaboration_added': {
      'by_you': () => {
        return `You added ${actualNewCollaborator['username']} to Story ${title}`
      },
      'you': author => {
        return `${author} added you to Story ${title}`
      },
      'by_someone': author => {
        return `${author} added ${actualNewCollaborator['username']} to Story ${title}`
      }
    },
    'collaboration_removed': {
      'by_you': () => {
        return `You removed ${actualNewCollaborator['username']} from Story ${title}`
      },
      'you': author => {
        return `${author} removed you from Story ${title}`
      },
      'by_someone': author => {
        return `${author} removed ${actualNewCollaborator['username']} from Story ${title}`
      }
    },
    'collaboration_leaved': {
      'by_you': author => {
        return `${author} is no longer on Story ${title}`
      }
    },
    'collaboration_share_false': {
      'by_someone': author => {
        return `${author} change Story status to private, you are no more collaborating to Story ${title}`
      }
    }
  }

  return resolveMessages[activityType] ||
    {
      'by_you': () => '',
      'you': () => '',
      'by_someone': () => ''
    }
}

/**
 * Resolve and return activities with right type of message
 *
 * @param {array} activities
 * @param {object} user
 * @returns
 */
const resolveActivityTypeMessage = async (activities, user) => {
  try {

    const userId = user._id.toString()
    const authorPopulate = 'id name username'
    const stories = await Story.find({_id: activities.map(a => a.data.storyId)})
      .select('id author collaborators title')
      .populate('collaborators.author', authorPopulate)
      .populate('author', authorPopulate)

    const newCollaborators = await Author.find({_id: activities.map(a => a.data.collaboratorId)})
      .select('_id name username')

    return activities.map((activity) =>{
      let actualStory = stories.filter(s => s._id.equals(activity.data.storyId))[0]
      let title = actualStory['title']
      let actualNewCollaborator = newCollaborators.filter(c => c._id.equals(activity.data.collaboratorId))[0]
      let newCollaboratorId = actualNewCollaborator['_id'].toString()

      let authorId = activity['author'].toString()
      let type = ''

      // assign to type right value, based on conditions
      if (authorId == userId) type = 'by_you'
      else if (newCollaboratorId == userId) type = 'you'
      else type = 'by_someone'

      // assign right type to activity
      let username = findRightUser(actualStory, activity['author'])
      activity.message = activityMessagesMatrix(activity.type, title, actualNewCollaborator)[type](username)

      // if type is included in types for changing then change type
      let actTypesForChanging = ['collaboration_added', 'collaboration_removed']
      let actType = actTypesForChanging.includes(activity.type) ? activity.type + '_' + type : activity.type

      let final = {}
      // repack object, and change type
      Object.keys(activity).forEach(key => {
        let prop = activity[key]
        // change activity type
        if (key === 'type') prop = actType
        final[key] = prop
      })

      return final

    })

  } catch (err) {
    throw err
  }
}

/**
 * is user allowed to receive activity depends on activity role
 *
 * @param {object} activity
 * @param {object} user
 * @returns {boolean}
 */
const isAllowedToReceiveActivity = (activity, user) => {
  const rules = {
    'collaboration_share_false': {
      author: false,
      collaboratorId: true
    }
  }
  // what role user have in activity
  const role = user._id.equals(activity.author) ? 'author' : 'collaboratorId'

  const prop = rules[activity.type]
  // if it's in rules, resolve with boolean
  if (prop) return prop[role]
  return true

}

/**
 * get collaboration activities for user
 *
 * @param {Object} user
 * @returns
 */
const getNewCollaborationActivities = async (user, filters) => {
  try {
    let lastCollaborationUpdate = user.lastActivityCheck.collaboration

    let activities = await Activity.findNewActivitiesCollaboration(user._id, lastCollaborationUpdate)

    // filter activities based on activity role
    let filteredActivities = activities.filter(a => isAllowedToReceiveActivity(a, user))

    // GQL filter
    if (filters) {
      let final = filteredActivities.filter(a => filters.includes(activityTypes[a.type]['filter']))
      return await resolveActivityTypeMessage(final, user)
    }

    return await resolveActivityTypeMessage(filteredActivities, user)

  } catch (err) {
    return err
  }
}

/**
 * Get all Collaboration invites
 *
 * @param {string} authorId
 * @param {number} [days=30]
 * @param {boolean} [accepted=false]
 * @returns
 */
const getCollaborationInvites = async (userId, userEmail, days = config.daysCheck, accepted = false) => {
  try {

    let today = new Date()
    let targetDay = new Date(new Date().setDate(today.getDate() - days))

    let query = {
      $or: [
        {
          invited: userId,
          accepted,
          created: {
            $gt: targetDay
          }
        },
        {
          email: userEmail,
          accepted,
          created: {
            $gt: targetDay
          }
        },
      ]
    }
    let invitations = await CollaborationInvite.find(query)
    return invitations

  } catch (err) {
    return err
  }
}

/**
 * Get group invitations
 *
 * @param {String} authorId
 * @param {String} email
 * @param {Number} [days=config.daysCheck]
 * @returns {Promise}
 */
const getGroupInvitations = async (authorId, email, days = config.daysCheck) => {
  try {

    let targetDay = new Date(new Date().setDate(new Date().getDate() - days))

    if (!authorId && !email) return null

    let query = {
      accepted: null,
      created: {
        $gt: targetDay
      }
    }

    if (authorId) {
      query['invited.author'] = authorId
    } else if (email) {
      query['invited.email'] = email
    }

    let invitations = await GroupInvite.find(query)
    return invitations

  } catch (err) {
    return err
  }
}

/**
 * Get followers for user after days entered
 *
 * @param {string} userId
 * @param {number} [days=30]
 * @returns
 */
const getNewFollowers = async (userId, days = config.daysCheck) => { //TODO: mozda promeniti ime funkcije "getFollowersDays..."
  try {
    let today = new Date()
    let targetDay = new Date(new Date().setDate(today.getDate() - days))

    let query = {
      follows: userId,
      created: {
        $gt: targetDay
      }
    }

    let followings = await Following.find(query)
    return followings.map(f => f.author)

  } catch (err) {
    return err
  }
}

/**
 * Get timeline comments after days entered
 *
 * @param {string} userId
 * @param {Number} days
 * @returns
 */
const getTimelineComments = async (userId, days = config.daysCheck) => {
  try {
    let today = new Date()
    let targetDay = new Date(new Date().setDate(today.getDate() - days))

    let query = {
      author: userId,
      active: true,
      deleted: false,
      created: {
        $gt: targetDay
      }
    }
    // Get comments where user is author
    let comments = await Comments.find(query)
    return comments

  } catch (err) {
    return err
  }
}

/**
 * Get new social comments
 *
 * @param {object} user
 * @returns
 */
const getNewSocialComments = async (user) => {
  try {
    let userId = user._id
    let lastCheckSocialComments = user.lastCommentsCheck.social

    // Get all authors pages
    let pages = await Page.findAuthorsPages(userId)

    let query = {
      page: {
        $in: pages
      },
      active: true,
      deleted: false,
      created: {
        $gt: lastCheckSocialComments
      }
    }
    let comments = await Comments.find(query)

    // return new comments that are not written by the page author
    return comments.filter(c => c.author.toString() !== userId.toString() )

  } catch (err) {
    return err
  }
}

/**
 * Get new collaboration comments
 *
 * @param {object} userId
 * @returns
 */
const getNewCollaborationComments = async (user) => {
  let userId = user._id
  try {
    let storyQuery = {
      deleted: false,
      active: true,
      collaborators: {
        $elemMatch: {
          author: userId,
          edit: true
        }
      }
    }

    let collaborationStories = await Story.find(storyQuery)

    let allPages = []
    collaborationStories.forEach(story => allPages.push(...story.pages))

    let lastCheckCollaborationComments = user.lastCommentsCheck.collaboration
    let commentQuery = {
      page: {
        $in: allPages
      },
      active: true,
      deleted: false,
      created: {
        $gt: lastCheckCollaborationComments
      }
    }

    return await Comments.find(commentQuery)

  } catch (err) {
    return err
  }
}

/**
 * Save last activity check
 *
 * @param {string} userId
 * @param {object} newActivityCheck
 * @returns
 */
const saveLastActivitiesCheck = async (userId, newActivityCheck) => {
  try {

    let user = await Author.findOneActiveById(userId, 'throw_err_if_not_found')

    for (let key in newActivityCheck) {
      let prop = newActivityCheck[key]
      user.lastActivityCheck[key] = prop
    }

    await user.save()
    return user
  } catch (err) {
    return err
  }
}


export default {
  getNewTimelineActivities,
  getNewSocialActivities,
  getNewCollaborationActivities,
  activityMessagesMatrix,
  resolveActivityTypeMessage,
  isAllowedToReceiveActivity,
  getCollaborationInvites,
  getGroupInvitations,
  getNewFollowers,
  getTimelineComments,
  getNewSocialComments,
  getNewCollaborationComments,
  saveLastActivitiesCheck
}
