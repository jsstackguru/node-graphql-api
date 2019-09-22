/**
 * @file PageSpam model
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import mongoose, { Schema } from 'mongoose'
import translate from '../../lib/translate'
import { moongooseErrorHandler } from '../../middleware/error'

const pageSpamSchema = new Schema({
  author: {
    type: Schema.ObjectId,
    ref: 'authors',
    required: [true, translate.__('Author ID is required')]
  },
  pageId: {
    type: Schema.ObjectId,
    ref: 'pages',
    required: [true, translate.__('Page ID is required')]
  },
  ipAddress: {
    type: String,
    required: [true, translate.__('IP Address is required')]
  },
  message: {
    type: String,
    required: [true, translate.__('Message is required')]
  },
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
})

pageSpamSchema.post('save', moongooseErrorHandler)

/**
 * Find spams by ip
 *
 * @param {String} ip
 * @returns
 */
pageSpamSchema.statics.findByIp = async (ip) => {
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
pageSpamSchema.statics.findSpamAuthor = async (authorId, pageId) => {
  try {

    let result = await mongoose.model('page_spam').find({author: authorId, pageId: pageId})
    return result

  } catch (err) {
    return err
  }
}

export default mongoose.model('page_spam', pageSpamSchema)
