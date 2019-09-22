/**
 * @file Device model
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import mongoose, { Schema } from 'mongoose'
import translate from '../../lib/translate'
import { moongooseErrorHandler } from '../../middleware/error'

const devicesSchema = new Schema({
  author: {
    type: Schema.ObjectId,
    ref: 'authors'
  },
  appVersion:{
    type: String,
    required: [true, translate.__('App version is required')]
  },
  locale: {
    type: String,
    required: [true, translate.__('Locale is required')]
  },
  osVersion: {
    type: String,
    required: [true, translate.__('OS version is required')]
  },
  pushToken: {
    type: String,
    required: [true, translate.__('Push token is required')]
  },
  timezone: {
    type: String,
    required: [true, translate.__('Timezone is required')]
  },
  platform: {
    type: String,
    required: [true, translate.__('Platform is required')]
  }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
})

devicesSchema.post('save', moongooseErrorHandler)

export default mongoose.model('devices', devicesSchema)
