/**
 * @file CommentSpam model
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import mongoose, { Schema } from 'mongoose'
import translate from '../../lib/translate'
import { moongooseErrorHandler } from '../../middleware/error'

const commentSpamSchema = new Schema({
  author: {
    type: Schema.ObjectId,
    ref: 'authors',
    required: [true, translate.__('Author ID is required')]
  },
  commentId: {
    type: Schema.ObjectId,
    ref: 'comments',
    required: [true, translate.__('Comment ID is required')]
  },
  ipAddress: {
    type: String,
    required: [true, translate.__('IP address is required')]
  },
  message: {
    type: String,
    required: [true, translate.__('Message is required')]
  },
  reason: Number
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
})

commentSpamSchema.post('save', moongooseErrorHandler)

/**
 * Find spams by ip
 *
 * @param {String} ip
 * @returns
 */
commentSpamSchema.statics.findByIp = async (ip) => {
  try {

    let spam = await mongoose.model('page_spam').find({ipAddress: ip})
    return spam ? spam : []

  } catch (err) {
    return err
  }
}

/**
 * Find spam author
 *
 * @param {String} authorId
 * @param {String} pageId
 * @returns
 */
commentSpamSchema.statics.findSpamAuthor = async (authorId, commentId) => {
  try {

    let result = await mongoose.model('comment_spam').find({author: authorId, commentId: commentId})
    return result

  } catch (err) {
    return err
  }
}

export default mongoose.model('comment_spam', commentSpamSchema)
