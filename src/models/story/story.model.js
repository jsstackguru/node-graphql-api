/**
 * @file Story model
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import mongoose, { Schema } from 'mongoose'
// services
import translate from '../../lib/translate'
// plugin
import mongoosePaginate from 'mongoose-paginate'
// errors
import { UnprocessableEntity } from '../../lib/errors'
import { moongooseErrorHandler } from '../../middleware/error'

const storySchema = new Schema({
  author: {
    type: Schema.Types.ObjectId, ref: 'authors',
    required: [true, translate.__('Author is required')]
  },
  pages: [{
    type: Schema.Types.ObjectId,
    ref: 'pages'
  }],
  title: {
    type: String,
    required: [true, translate.__('Title is required')]
  },
  slug: {
    type: String,
  },
  status: String,
  views: {
    type: Number,
    default: 0
  },
  theme: {
    cover: String
  },
  active: {
    type: Boolean,
    default: null
  },
  deleted: Boolean,
  deletedAt: Date,
  matchId: String, //@TODO: test
  banInPublic: Boolean,
  collaborators: [{
    _id: false, // @nikson revision
    author: {
      type: Schema.Types.ObjectId,
      ref: 'authors',
      required: [true, translate.__('Collaborator author is required')]
    },
    edit: {
      type: Boolean,
      default: false
    }
  }],
  featured: Boolean,
  share: {
    collaborators: Boolean,
    followers: Boolean,
    link: Boolean,
    search: Boolean
  }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
})

// mongoose error handler
storySchema.post('save', moongooseErrorHandler)
// mongoose paginate
storySchema.plugin(mongoosePaginate)

/**
 * Get list of stories by query and page match
 * @param {Object} query Query for stories filter
 */
storySchema.statics.getList = async (query, pageMatch) => {
  try {
    // check does email is already taken
    let stories = await mongoose.model('stories')
      .find(query)
      .populate({ path: 'author', select: 'id name username avatar' })
      .populate({ path: 'pages', match: pageMatch })

    return stories
  } catch (err) {
    throw err
  }
}

/**
 * Find one stories by id
 *
 * @param {String} storyId
 * @param {Boolean} throwErr if used (and true) and story are not found, throw error
 * @returns {Object}
 */
storySchema.statics.findOneActiveById = async (storyId, throwErr) => {
  try {

    let story = await mongoose.model('stories').findOne({ _id: storyId, active: true, deleted: false })

    if (!story && throwErr) throw new UnprocessableEntity(translate.__('Story not found'))

    return story
  } catch (err) {
    throw err
  }
}

/**
 * Find story by page
 *
 * @param {String} pageId
 * @param {Boolean} throwErr if used (and true) and story are not found, throw error
 * @returns {Object}
 */
storySchema.statics.findStoryByPageId = async (pageId, throwErr) => {
  try {

    let story = await mongoose.model('stories').findOne({
      pages: {
        $in: pageId
      },
      active: true,
      deleted: false
    })

    if (!story && throwErr) throw new UnprocessableEntity(translate.__('Story not found'))

    return story
  } catch (err) {
    throw err
  }
}

/**
 * Delete author from all collaborations
 *
 * @param {String} authorId
 * @returns {Object}
 */
storySchema.statics.deleteAuthorFromCollaborations = async (authorId) => {
  try {
    let query = {
      collaborators: {
        $elemMatch: {
          author: authorId
        }
      }
    }
    let update = {
      $pull: {
        collaborators: { author: authorId }
      }
    }
    let story = await mongoose.model('stories').updateMany(query, update)
    return story

  } catch (err) {
    throw err
  }
}

/**
 * Find author collaborations
 *
 * @param {String} authorId
 * @returns {Object}
 */
storySchema.statics.findAuthorsCollaborations = async (authorId, edit = true, stories = false) => {
  try {
    let query = {
      $or: [
        {
          collaborators: {
            $elemMatch: {
              author: authorId,
              edit
            }
          }
        }
      ]
    }
    // if third arg true, then find story authors too
    if (stories) query.$or.push({author: authorId})

    return await mongoose.model('stories').find(query)

  } catch (err) {
    throw err
  }
}

export default mongoose.model('stories', storySchema)

