/**
 * @file CollaborationInvite model
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import mongoose, { Schema } from 'mongoose'
import translate from '../../lib/translate'
import { moongooseErrorHandler } from '../../middleware/error'

const collaborationInviteSchema = new Schema({
  author: {
    type: Schema.ObjectId,
    ref: 'authors',
    required: [true, translate.__('Author ID is required')]
  },
  story: {
    type: Schema.ObjectId,
    ref: 'stories',
    required: [true, translate.__('Story ID is required')]
  },
  active: {
    type: Boolean,
    // default //TODO: ? default null ?
  },
  invited: { //TODO: da email bude pod invited kao kod group invite
    type: Schema.ObjectId,
    ref: 'authors',
    required: [
      function() { return !this.email }, // required true if not email
      translate.__('Invited ID is required if not invited via email') //TODO: text
    ]
  },
  edit: {
    type: Boolean,
    required: [true, translate.__('Edit is required')]
  },
  accepted: {
    type: Boolean,
    default: null
  },
  email: {
    type: String,
    required: [
      function() { return !this.invited }, // required true if not invited
      translate.__('Email is required if not invited via user ID') //TODO: text
    ]
  },
  token: {
    type: String
  }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
})

collaborationInviteSchema.post('save', moongooseErrorHandler)

/**
 * Find all active invitations for user
 *
 * @param {String} authorId
 * @returns
 */
collaborationInviteSchema.statics.findAllActiveInvitations = async (authorId) => {
  try {

    let invites = await mongoose.model('collaboration_invites').find({
      author: authorId,
      active: true
    })
    return invites

  } catch (err) {
    return err
  }
}

export default mongoose.model('collaboration_invites', collaborationInviteSchema)
