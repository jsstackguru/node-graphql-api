/**
 * @file Favorite model
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import mongoose, { Schema } from 'mongoose'
import translate from '../../lib/translate'
import { moongooseErrorHandler } from '../../middleware/error'

const favoriteSchema = new Schema({
  author: {
    type: Schema.ObjectId,
    ref: 'authors',
    required: [true, translate.__('Author ID is required')]
  },
  story:{
    type: Schema.ObjectId,
    ref: 'stories',
    required: [true, translate.__('Story ID is required')]
  }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
})

favoriteSchema.post('save', moongooseErrorHandler)

export default mongoose.model('favorites', favoriteSchema)
