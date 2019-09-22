/**
 * @file Page model
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import mongoose, { Schema } from 'mongoose'
import _ from 'underscore'
// services
import translate from '../../lib/translate'

// errors
import { UnprocessableEntity } from '../../lib/errors'
import { moongooseErrorHandler } from '../../middleware/error'

const ObjectId = Schema.Types.ObjectId

var pageSchema = new Schema({
  title: {
    type: String
    // required: [true, translate.__('Title is required')]
  },
  slug: String,
  content: Array,
  dateFrom: Date,
  dateTo: Date,
  author: {
    type: ObjectId,
    ref: 'authors',
    required: [true, translate.__('Author is required')]
  },
  status: String,
  theme: {
    cover: String
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  active: Boolean,
  place: {
    id: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    lon: {
      type: String,
      default: null
    },
    lat: {
      type: String,
      default: null
    }
  },
  matchId: String,
  original: {
    type: ObjectId,
    ref: 'pages'
  },
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
})

// mongoose error handler
pageSchema.post('save', moongooseErrorHandler)

/**
 * Find active page
 *
 * @param {String} pageId
 * @returns {Object}
 */
pageSchema.statics.findActivePage = async (pageId, throwErr) => {
  try {
    let page = await mongoose.model('pages').findOne({
      _id: pageId,
      active: true,
      deleted: false
    })

    if (!page && throwErr) throw new UnprocessableEntity(translate.__('Page not found'))

    return page
  } catch (err) {
    throw err
  }
}


/**
 * Find authors pages
 *
 * @param {String} authorId
 * @returns {Array}
 */
pageSchema.statics.findAuthorsPages = async(authorId) => {
  try {
    let pages = await mongoose.model('pages').find({
      author: authorId,
      active: true,
      deleted: false
    })

    return pages
  } catch (err) {
    throw err
  }
}

/**
 * Soft delete all authors pages
 *
 * @param {String} authorId
 * @returns {Array}
 */
pageSchema.statics.deleteAllAuthorPages = async(authorId) => {
  try {
    let query = {
      author: authorId
    }
    let update = {
      $set: {
        active: false,
        deleted: true,
        deletedAt: new Date()
      }
    }

    let pages = await mongoose.model('pages').updateMany(query, update)
    return pages

  } catch (err) {
    throw err
  }
}

export default mongoose.model('pages', pageSchema)
