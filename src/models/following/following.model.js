/**
 * @file Following model
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import mongoose, { Schema } from 'mongoose'
import translate from '../../lib/translate'
import { moongooseErrorHandler } from '../../middleware/error'

const followingSchema = new Schema({
  author: {
    type: Schema.ObjectId,
    ref: 'authors',
    required: [true, translate.__('Author ID is required')]
  },
  follows: {
    type: Schema.ObjectId,
    ref: 'authors',
    required: [true, translate.__('Follows ID is required')]
  },
  active: { //TODO: mislim da bi ovo trebalo zbog brisanja authora
    type: Boolean,
    default: null
  }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
})

followingSchema.post('save', moongooseErrorHandler)

/**
 * Delete all following and followers for author
 *
 * @param {String} authorId
 * @returns {Array}
 */
followingSchema.statics.deleteAllFollowingAndFollowers = async (authorId) => {
  try {
    let query = {
      $or: [
        { author: authorId },
        { follows: authorId }
      ]
    }

    let followings = await mongoose.model('followings').deleteMany(query)
    return followings

  } catch (err) {
    throw err
  }
}

export default  mongoose.model('followings', followingSchema)
