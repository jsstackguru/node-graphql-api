/**
 * @file Author model
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
// services
import { isValidEmail } from '../../lib/utils'
import translate from '../../lib/translate'
// plan
import { planLevels } from '../../constants/plan'
// errors
import { UnprocessableEntity } from '../../lib/errors'
import { moongooseErrorHandler } from '../../middleware/error'

const authorSchema = new Schema({
  name: {
    type: String,
    default: ''
  },
  username: {
    type: String,
    required: [true, translate.__('Username is required')]
  },
  email: {
    type: String,
    validate: {
      validator: (v) => {
        return isValidEmail(v) // Validate if email is in valid format
      },
      message: translate.__('Email must be a valid format') //TODO: text
    },
    required: [true, translate.__('Email is required')]
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  admin: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: false
  },
  location: {
    name: String,
    lon: String,
    lat: String
  },
  notif: {
    collaboration: {
      userLeavesStory: Boolean,
      removedFromStory: Boolean,
      storyUpdates: Boolean,
      newCollaborator: Boolean,
      invitations: Boolean
    },
    social: {
      newFollower: Boolean,
      comments: Boolean,
      favoritedYourStory: Boolean,
      sharedStory: Boolean,
      friendStoryUpdates: Boolean,
      friendNewStory: Boolean,
      newFriend: Boolean
    }
  },
  firstTime: {
    type: Boolean,
    default: true
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  password: String,
  pushNotif: {
    newStoryShare: Boolean,
    newStoryPublic: Boolean,
    newFollower: Boolean,
    newComment: Boolean
  },
  sync: {
    lastCheck: {
      type: Date,
      default: null
    }
  },
  token: {
    expired: Date,
    refresh: String,
    auth: String,
    access: String,
  },
  lastActivityCheck: {
    collaboration: Date,
    social: Date,
    timeline: Date
  },
  lastCommentsCheck: {
    social: Date,
    collaboration: Date
  },
  plan: {
    level: {
      type: String,
      validate: {
        validator: (v) => {
          let isValid = true
          // iterate over plans
          for (let key in planLevels) {
            let prop = planLevels[key]
            // if prop not found in plan levels then not valid
            if (prop === v) isValid = false
          }
          return !isValid
        },
        message: translate.__('Plan level not recognized') //TODO: text
      },
      default: 'BASIC'
    },
    expires: Date,
  },
  storage: {
    usage: {
      type: Number,
      default: 0
    },
  }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
})

authorSchema.post('save', moongooseErrorHandler)

authorSchema.plugin(mongoosePaginate)

authorSchema.methods.speak = () => {
  return 'speak method is active'
}

/**
 * Find author by email
 *
 * @constructor
 * @param {string} email Email to find
 */
authorSchema.statics.findByEmail = async (email) => {
  try {
    // check does email is already taken
    let user = await mongoose.model('authors').findOne({email: email, deleted: false, active: true})

    return user
  } catch (err) {
    throw err
  }
}

/**
 * Find all authors by email
 *
 * @constructor
 * @param {string} emails Email to find
 */
authorSchema.statics.findAllByEmail = async (emails) => {
  try {
    // check does email is already taken
    let user = await mongoose.model('authors').find({email: {$in: emails}, deleted: false, active: true})

    return user
  } catch (err) {
    return err
  }
}

/**
 * Find active author by email
 *
 * @param {string} email Email to find
 */
authorSchema.statics.findActiveByEmail = async (email, throwErr, customMessage) => {
  try {
    // check does email is already taken
    let user = await mongoose.model('authors').findOne({email: email, deleted: false, active: true})

    let message = customMessage ? customMessage : 'Author not found'
    if (!user && throwErr) throw new UnprocessableEntity(translate.__(message))

    return user
  } catch (err) {
    throw err
  }
}

/**
 * Find author by username
 *
 * @param {string} username Username to find
 * @returns {Object}
 */
authorSchema.statics.findByUsername = async (username) => {
  try {
    // check does username is already taken
    let user = await mongoose.model('authors').findOne({username: username})

    return user
  } catch (err) {
    throw err
  }
}

/**
 * Find active author by username
 *
 * @param {string} username Username to find
 * @returns {Object}
 */
authorSchema.statics.findActiveByUsername = async username => {
  try {
    // check does username is already taken
    let user = await mongoose.model('authors').findOne({username: username, active: true})

    return user
  } catch (err) {
    throw err
  }
}

/**
 * Find one active author by id
 *
 * @param {String} authorId Author ID to find
 * @param {String} throwErr
 * @returns {Object}
 */
authorSchema.statics.findOneActiveById = async (authorId, throwErr) => {
  try {

    let user = await mongoose.model('authors').findOne({_id: authorId, active: true, deleted: false})

    if (!user && throwErr) throw new UnprocessableEntity(translate.__('Author not found'))
    return user

  } catch (err) {
    throw err
  }
}

/**
 * Find many authors storage usage
 *
 * @param {array} authors Author ID to find
 * @returns {Object}
 */
authorSchema.statics.findManyUsersStorageUsage = async (authorsArr, throwErr) => {
  try {

    let authors = await mongoose.model('authors').find({
      _id: {
        $in: authorsArr
      },
      active: true,
      deleted: false
    })

    if (authors.length == 0 && throwErr) throw new UnprocessableEntity(translate.__('There are no authors with specific ID\'s')) //TODO: message

    // sum all authors storage usage
    let final = authors
      .map(a => a['storage']['usage'])
      .reduce((prev, curr) => {
        return prev + curr
      }, 0)

    return final ? final : null


  } catch (err) {
    throw err
  }
}

// Duplicate the ID field.
authorSchema.virtual('id').get(function(){
  return this._id.toHexString()
})
// Ensure virtual fields are serialised.
authorSchema.set('toJSON', {
  virtuals: true
})

export default mongoose.model('authors', authorSchema)
