/**
 * @file Database setup, connection and import models
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import config from '../config'
import mongoose from 'mongoose'

mongoose.connect(config.db.uri, {
  useNewUrlParser: true,
})

mongoose.Promise = global.Promise

var db = mongoose.connection
// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  // we're connected!
  // eslint-disable-next-line no-console
  console.log('Database connected')

  require('./author/author.model')
  require('./forgot-password/forgot-password.model')
  require('./story/story.model')
  require('./page/page.model')
  require('./collaboration-invite/collaboration-invite.model')
  require('./activity/activity.model')
  require('./following/following.model')
  require('./story-spam/story-spam.model')
  require('./page-spam/page-spam.model')
  require('./device/device.model')
  require('./comment/comment.model')
  require('./comment-read/comment-read.model')
  require('./comment-spam/comment-spam.model')
  require('./group/group.model')
  require('./group-invite/group-invite.model')
})

exports.db = mongoose
