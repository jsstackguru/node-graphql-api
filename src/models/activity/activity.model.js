/**
 * @file Activity model
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import mongoose, { Schema } from 'mongoose'
import activityTypes from '../../lib/activityTypes'
import { moongooseErrorHandler } from '../../middleware/error'
import translate from '../../lib/translate.js'
// models
import { Story } from '../story'
// utils
import utils from '../../lib/utils'

const activitySchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'authors',
  },
  active: {
    type: Boolean,
    default: null
  },
  timestamp: { //TODO: mislim da ovo nisam nigde koristio?
    type: Number,
    default: Date.now
  },
  type: {
    type: String,
    required: [true, translate.__('Type is required')] //TODO: messages
  },
  data: {
    type: Schema.Types.Mixed,
    required: [true, translate.__('Data is required')] // TODO: messages
  }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
})

activitySchema.post('save', moongooseErrorHandler)

/**
 * Find many active activities
 *
 * @param {string} authorId Author ID to find
 * @returns {Object}
 */
activitySchema.statics.findManyActiveByAuthor = async (authorId, fromDate) => {
  try {

    let activities = await mongoose.model('activities').find({
      author: authorId,
      active: true,
      updated: {
        $gt: fromDate
      }
    })
    return activities

  } catch (err) {
    return err
  }
}

/**
 * Find many active timeline activities from date
 *
 * @param {string} authorId Author ID to find
 * @returns {Object}
 */
activitySchema.statics.findNewActivitiesTimeline = async (authorId, fromDateTimeline) => {
  try {
    const activities = await mongoose.model('activities').find({
      author: authorId,
      active: true,
      updated: {
        $gt: fromDateTimeline
      }
    })
    return activities.filter(a => {
      const type = activityTypes[a.type]['tab']
      return type === 'timeline' || type.includes('timeline')
    })

  } catch (err) {
    return err
  }
}

/**
 * Delay last check date proposed in table inside
 *
 * @param {*} activity
 * @param {*} [lastCheckDate=new Date()]
 * @returns {date}
 */
export const delaySocialQuery = (activity, lastCheckDate = new Date()) => {
  if (!activity) activity = {}
  let rules = {
    'story_created': '1 hour'
  }
  let timeInterval = rules[activity.type]
  if (timeInterval) {
    return utils.calculateDate(timeInterval, lastCheckDate)
  }
  return lastCheckDate
}

/**
 * Find many active social activities from date
 *
 * @param {String} authorId Author ID to find
 * @returns {Object}
 */
activitySchema.statics.findNewActivitiesSocial = async (followingsIds, fromDateSocial) => {
  try {

    let activities = await mongoose.model('activities').find({
      $or: [
        {
          author: {
            $in: followingsIds
          },
          active: true,
          updated: {
            $gt: fromDateSocial
          }
        },
        {
          type: 'system_message' //TODO: da li i ovde treba kad je kreiran?
        }
      ]
    })
    return activities.filter(a => {
      const type = activityTypes[a.type]['tab']
      // filter all fromDates, and for specified types return delayed time
      const delayedDate = delaySocialQuery(a, fromDateSocial)
      return (
        (type === 'social' || type.includes('social'))
        && delayedDate < a.updated //TODO: ovaj uslov se nakon kverija svodi i na system messages
      )
    })

  } catch (err) {
    return err
  }
}

/**
 * Find many active collaboration activities from date
 *
 * @param {string} authorId Author ID to find
 * @returns {Object}
 */
activitySchema.statics.findNewActivitiesCollaboration = async (userId, fromDateCollaboration) => {
  try {

    // find all stories where user is collaborator or author
    let allStories = await Story.findAuthorsCollaborations(userId, true, true)
    let storiesIds = allStories.map(s => s._id)

    let activities =  await mongoose.model('activities').find({
      active: true,
      updated: {
        $gt: fromDateCollaboration
      },
      $or: [
        { 'data.storyId': { $in: storiesIds } },
        { 'data.oldCollaborators': userId } // used with "collaboration_share_false" activity
      ]
    }).lean()

    return activities.filter(a => {
      let type = activityTypes[a.type]['tab']
      return  type === 'collaboration' || type.includes('collaboration')
    })

  } catch (err) {
    return err
  }
}

export default mongoose.model('activities', activitySchema)

