/**
 * @file ForgotPasswords model
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import mongoose, { Schema } from 'mongoose'
import translate from '../../lib/translate'
import { moongooseErrorHandler } from '../../middleware/error'

const ObjectId = Schema.Types.ObjectId

const forgotPasswordsSchema = new Schema({
  author: {
    type: ObjectId,
    ref: 'authors',
    required: [true, translate.__('Author ID is required')]
  },
  code: {
    type: String,
    required: [true, translate.__('Code is required')]
  },
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

forgotPasswordsSchema.post('save', moongooseErrorHandler)

export default mongoose.model('forgotpasswords', forgotPasswordsSchema)
