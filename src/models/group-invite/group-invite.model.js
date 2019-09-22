/**
 * @file Sharing Ivite model
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import mongoose, { Schema } from 'mongoose'
import { UnprocessableEntity } from '../../lib/errors'
import translate from '../../lib/translate'
import { moongooseErrorHandler } from '../../middleware/error'

const groupInviteSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'authors',
    required: [true, translate.__('Author ID is required')]
  },
  invited: {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'authors',
      required: [
        function() { return !this.invited.email },
        translate.__('Invited ID is required if not invited via email')
      ]
    },
    email: {
      type: String,
      required: [
        function() { return !this.invited.author },
        translate.__('Email is required if not invited via user ID')
      ]
    },
  },
  token: {
    type: String,
    required: [true, translate.__('Token is required')]
  },
  active: {
    type: Boolean,
    default: null
  },
  accepted: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
})

groupInviteSchema.post('save', moongooseErrorHandler)

/**
 * Find active group invitation by ID
 *
 * @param {String} invitationId
 * @returns {Object} group
 */
groupInviteSchema.statics.findOneActiveById = async (invitationId, throwErr) => {
  try {
    const groupInvitation = await mongoose.model('group_invites').findOne({
      _id: invitationId,
      active: true
    })

    if (!groupInvitation && throwErr) {
      throw new UnprocessableEntity(translate.__('There is no requested invitation'))
    }

    return groupInvitation
  } catch (err) {
    throw err
  }
}

/**
 * Find invited users in status pending, for author
 *
 * @param {String} invitationId
 * @returns {Object} group
 */
groupInviteSchema.statics.findAllPendingInvitations = async (authorId, throwErr) => {
  try {
    const groupInvitation = await mongoose.model('group_invites').find({
      author: authorId,
      active: true, //TODO: ovaj active mozda ne treba ovde
      accepted: null
    })

    if (groupInvitation.length == 0 && throwErr) {
      throw new UnprocessableEntity(translate.__('There are no pending invitations'))
    }

    return groupInvitation
  } catch (err) {
    throw err
  }
}


export default mongoose.model('group_invites', groupInviteSchema)
