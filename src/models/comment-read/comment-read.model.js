/**
 * @file Comment model
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import mongoose, { Schema } from 'mongoose'
import translate from '../../lib/translate'
import { moongooseErrorHandler } from '../../middleware/error'

const commentsReadsSchema = new Schema({
  comment: {
    type: Schema.ObjectId,
    ref: 'comments',
    required: [true, translate.__('Comment ID is required')]
  },
  userRead: [{
    type: Schema.Types.ObjectId,
    ref: 'authors'
  }]
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
})

commentsReadsSchema.post('save', moongooseErrorHandler)

export default mongoose.model('comments_reads', commentsReadsSchema)
