/**
 * @file Synchronization routes
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

// Models
import { Author } from '../models/author'
import { Group } from '../models/group'
import { Page } from '../models/page'
import { Story } from '../models/story'

// Libs
import { BadRequest, UnprocessableEntity } from '../lib/errors'
import translate from '../lib/translate'
import authorHandles from './author.handles'

// Config
import { planLevels, planLimits } from '../constants/plan'

/**
 * Synchronize author's Stories, pages and content
 * @param {Object} user Author
 * @param {Date} syncDate Last synchronization date
 * @param {Array} storyIds List of Story ids on user's device
 * @param {Object} plan Subscribtion data
 * @returns `{Promise<{
 *    stories: Object[],
 *    pages: Object[],
 *    deletedPages: Object[],
 *    deletedStories: Object[],
 *    groups: Object[],
 *    plan: Object[],
 *    lastSynchronizationDate: Date}>}`
 */
const synchronize = async (user, syncDate, storyIds, plan) => {
  try {
    // Validate plan data
    if (plan && (!plan.level || !plan.expires)) {
      throw new BadRequest(translate.__('Plan data is invalid'))
    }
    let query = {
      $or: [
        {
          author: user.id
        },
        {
          $and: [
            {'collaborators.edit': true},
            {'collaborators.author': user.id}
          ]
        }
      ]
    }

    if (syncDate && !storyIds) {
      Object.assign(query, {
        updated: {$gte: new Date(syncDate)},
        deleted: false,
        active: true
      })
    } else if (syncDate && storyIds.length > 0) {
      Object.assign(query, {
        $and: [
          {
            $or: [
              {
                updated: {$gte: new Date(syncDate)}
              },
              {
                _id: {$nin: storyIds}
              }
            ]
          },
          { deleted: false },
          { active: true }
        ]
      })
    } else {
      Object.assign(query, {
        $and: [
          { deleted: false },
          { active: true }
        ]
      })
    }
    // find the stories
    const stories = await Story.find(query)
      .select('id created updated matchId')
      .populate('pages', 'id created updated contents matchId')
    // find deleted stories by author or where author is collaborator
    const deletedStories = await Story.find({
      deleted: true,
      $or: [
        { author: user.id, },
        {
          $and: [
            {'collaborators.edit': true},
            {'collaborators.author': user.id}
          ]
        }
      ],
      deletedAt: { $gte: syncDate }
    })
      .select('id created updated deletedAt matchId')

    // new pages
    const pages = await Page.find({created: {$gte: syncDate}, deleted: false, active: true})
      .select('id title content created updated matchId')
    // deleted pages
    const deletedPages = await Page.find({deletedAt: {$gte: syncDate}, deleted: true})
      .select('id created updated deletedAt matchId')

    // family groups for user
    const groups = await Group.find({
      $and: [
        { active: true },
        { $or: [
          { owner: user.id },
          {
            members: {
              $in: [user.id]
            }
          }
        ] }
      ]
    })

    return {
      stories,
      deletedStories,
      pages,
      deletedPages,
      groups,
      userPlan: user.plan,
      lastSynchronizationDate: new Date(),
    }
  } catch (err) {
    throw err
  }
}

/**
 * Check whether client's data is newer then on the server
 *
 * @param {String} userId - Author ID
 * @param {Date} clintSyncDate - Last check date
 * @returns {Boolean} - Client's data is newer then on the server
 */
export const newerDataFromClient = async (userId, clintSyncDate) => {
  try {
    const author = await Author.findById(userId)
    if (!author) {
      throw new UnprocessableEntity(translate.__('Author not found'))
    }

    return author.lastSynchronizationDate < clintSyncDate
  } catch (err) {
    throw err
  }
}

/**
 * Synchronize plan data
 *
 * @param {String} authorId - Author's ID
 * @param {Object} plan - Plan data from the client
 * @param {Object} clientStorageUsage - Storage usage from the client
 * @returns {Object} - Synchronize valid data
 */
export const syncPlan = async (authorId, plan, storage) => {
  try {
    const author = await Author.findById(authorId)
    const clientStorageUsage = storage.usage

    if (!author) {
      throw new UnprocessableEntity(translate.__('Author not found'))
    }

    const { level } = plan

    if (!planLevels.include(level)) {
      throw new BadRequest(translate.__('Plan level does not match'))
    }

    const dbStorageUsage = await authorHandles.storageUsage(authorId)
    let allowSync = true
    let storageUsage = clientStorageUsage > dbStorageUsage ? clientStorageUsage : dbStorageUsage

    // If storage on client is a larger then on the database
    if (clientStorageUsage > dbStorageUsage) {
      // If storage usage is over the limit
      allowSync = clientStorageUsage >= planLimits
    }

    return {
      data: {
        allowSync,
        storageUsage,
        planLevel: author.plan.level
      }
    }
  } catch (err) {
    throw err
  }
}

export default {
  newerDataFromClient,
  synchronize
}
