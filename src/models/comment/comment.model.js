/**
 * @file Comment model
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { UnprocessableEntity } from '../../lib/errors'
import translate from '../../lib/translate'
import { moongooseErrorHandler } from '../../middleware/error'

const commentsSchema = new Schema({
  author: {
    type: Schema.ObjectId,
    ref: 'authors',
    required: [true, translate.__('Author ID is required')]
  },
  page: {
    type: Schema.ObjectId,
    ref: 'page',
    required: [true, translate.__('Page ID is required')]
  },
  text: {
    type: String,
    validate: {
      validator: (v) => {
        return /\S/.test(v) // Validate if there is only whitespace
      },
      message: translate.__('Comment must contain some letters') //TODO: text
    },
    required: [true, translate.__('Text field is required')]
  },
  active: {
    type: Boolean,
    default: null
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: { //TODO: mozda da dodam da se automatski setuje ako je deleted true ?
    type: Date,
  },
  spam: { type: Number },
  reply: {
    type: Schema.ObjectId,
    ref: 'comments'
  }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
})

commentsSchema.post('save', moongooseErrorHandler)

commentsSchema.plugin(mongoosePaginate)

/**
 * Find one comment by id
 *
 * @param {String} commentId
 * @param {String} throwErr
 * @returns {Object}
 */
commentsSchema.statics.findOneActiveById = async (commentId, throwErr) => {
  try {
    let comment = await mongoose.model('comments').findOne({
      _id: commentId,
      active: true,
      deleted: false
    })

    if (!comment && throwErr) throw new UnprocessableEntity(translate.__('Comment not found'))

    return comment
  } catch (err) {
    throw err
  }
}

/**
 * Find all authors comments
 *
 * @param {String} authorId
 * @returns {Object}
 */
commentsSchema.statics.findAllAuthorsComments = async (authorId) => {
  try {
    let comments = await mongoose.model('comments').find({
      author: authorId,
      active: true,
      deleted: false
    })
    return comments
  } catch (err) {
    throw err
  }
}

/**
 * Delete all page comments, including comment replies (soft delete)
 *
 * @param {String} pageId
 * @returns {Object}
 */
commentsSchema.statics.deleteAllPageComments = async (pageId) => {
  try {
    let query = { page: pageId }
    let update = {
      $set : {
        active: false,
        deleted: true,
        deletedAt: new Date()
      }}
    let response = await mongoose.model('comments').updateMany(query, update)
    return response

  } catch (err) {
    throw err
  }
}

export default mongoose.model('comments', commentsSchema)
