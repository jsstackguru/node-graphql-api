/**
 * @file StorySpam model
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import mongoose, { Schema } from 'mongoose'
import translate from '../../lib/translate'
import { moongooseErrorHandler } from '../../middleware/error'

const storySpamSchema = new Schema({
  author: {
    type: Schema.ObjectId,
    ref: 'authors',
    required: [true, translate.__('Author ID is required')]
  },
  storyId: {
    type: Schema.ObjectId,
    ref: 'stories',
    required: [true, translate.__('Story ID is required')]
  },
  ipAddress: {
    type: String,
    required: [true, translate.__('IP address is required')]
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

storySpamSchema.post('save', moongooseErrorHandler)

/**
 * Find spams by ip
 *
 * @param {String} ip
 * @returns
 */
storySpamSchema.statics.findByIp = async (ip) => {
  try {

    let spam = await mongoose.model('story_spam').find({ipAddress: ip})
    return spam ? spam : []

  } catch (err) {
    return err
  }
}

/**
 * Find spam author
 *
 * @param {String} authorId
 * @param {String} storyId
 * @returns
 */
storySpamSchema.statics.findSpamAuthor = async (authorId, storyId) => {
  try {

    let result = await mongoose.model('story_spam').find({author: authorId, storyId: storyId})
    return result

  } catch (err) {
    return err
  }
}

export default mongoose.model('story_spam', storySpamSchema)
