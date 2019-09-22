/**
 * @file Group model
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import mongoose, { Schema } from 'mongoose'
// errors
import { UnprocessableEntity } from '../../lib/errors'
import { moongooseErrorHandler } from '../../middleware/error'
// services
import translate from '../../lib/translate'

const groupSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'authors',
    required: [
      function () { return Boolean(this.members.length === 0) },
      translate.__('If no members owner is required')
    ]
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: 'authors'
    }
  ],
  active: {
    type: Boolean,
    default: null
  },
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
})

groupSchema.post('save', moongooseErrorHandler)

/**
 * Find one active group
 *
 * @param {String} groupId
 * @returns {Object} group
 */
groupSchema.statics.findOneActiveById = async (groupId, throwErr) => {
  try {
    const group = await mongoose.model('group').findOne({
      _id: groupId,
      active: true
    })

    if (!group && throwErr) {
      throw new UnprocessableEntity(translate.__('Group not found')) //TODO: message
    }

    return group
  } catch (err) {
    throw err
  }
}

/**
 * Find group for author
 *
 * @param {String} authorId
 * @returns {Object} group
 */
groupSchema.statics.findForAuthor = async (authorId, throwErr) => {
  try {
    const group = await mongoose.model('group').findOne({
      $and: [
        {
          $or: [
            {owner: authorId},
            {members: authorId}
          ]
        },
        {active: true}
      ]
    })

    if (!group && throwErr) {
      throw new UnprocessableEntity(translate.__('There is no group with specified author'))
    }

    return group
  } catch (err) {
    throw err
  }
}

/**
 * Find group by email
 *
 * @param {String} email
 * @returns {Object} group
 */
groupSchema.statics.findForEmail = async (email, throwErr) => {
  try {
    const group = await mongoose.model('group').findOne({
      members: {
        $elemMatch: {
          email: email
        }
      },
      active: true
    })

    if (!group && throwErr) {
      throw new UnprocessableEntity(translate.__(`There is no group with email ${email}`))
    }

    return group
  } catch (err) {
    throw err
  }
}

export default mongoose.model('group', groupSchema)
