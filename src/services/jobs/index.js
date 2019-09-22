/**
 * @file Agenda jobs declaration
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import Agenda from 'agenda'
import config from '../../config'

// story jobs
import {
  storyUpdate,
  storyCreated,
  favoriteStory,
  storyShared,
  commentsAndReplies
} from './story.jobs'

// author jobs
import {
  register,
  startFollow,
  resetPasswordSuccessful,
  registrationSuccessful,
  forgotPassword,
  passwordChanged,
  reportCommentSpam,
  deleteAccount,
  joinApp,
  invitationAccepted
} from './author.jobs'

// collaborator jobs
import {
  userRemoveYouFromCollaboration,
  userRemoveAnotherCollaborator,
  collaboratorAdded,
  collaboratorLeaved,
  collaborationShareFalse
} from './collaboration.jobs'

// Services
import log from '../log'

const mongoDb = config.test ? config.db.testUri : config.db.uri

const agenda = new Agenda({
  db: {
    address: mongoDb
  }
})

/**
 * Init agenda jobs
 */
const init = async () => {
  try {
    await agenda.on('ready', async () => {
      console.log('agenda is ready')
      await agenda.start()
    })
  } catch (err) {
    console.log(err.stack)
    throw err
  }
}

if (!config.test) {
  init()
}

// Events
agenda.on('start', job => {
  if (job && job.attrs && job.attrs.name) {
    log.info(`Job ${job.attrs && job.attrs.name} starting`)
  }
})

agenda.on('complete', job => {
  if (job && job.attrs && job.attrs.name) {
    log.info(`Job ${job.attrs && job.attrs.name} finished`)
  }
})

// Cancel jobs
async function gracefulStop() {
  await agenda.stop()
  process.exit(0)
}

process.on('SIGTERM', gracefulStop)
process.on('SIGINT' , gracefulStop)

/**
 * Find existing job
 * @param {Object} query
 */
const findExistingJob = async query => await agenda.unique(query)

/**
 * Jobs
 */

agenda.define('test', (job, done) => {
  const { name } = job.attrs.data
  // eslint-disable-next-line no-console
  console.log(`Hello ${name}!`)
  done()
})

/**
 * User start to follows someone
 */
agenda.define('start_follows', async job => {
  try {
    const { author, follows } = job.attrs.data
    // Try to find existing job
    const existingJob = await findExistingJob({
      authorId: author,
      follows: follows
    })
    if (existingJob) {
      await existingJob.remove()
    }
    const data = startFollow(author, follows)
    return data
  } catch (err) {
    job.fail(err)
  }
})

/**
 * New author is registered
 * @param {Object} job
 */
agenda.define('registration', async (job) => {
  try {
    const { data } = job.attrs
    
    // Send an email
    await register(data)
  } catch (err) {
    throw err
  }
})

/**
 * Invitation to join app
 * @param {Object} job
 */
agenda.define('join_app', (job, done) => {
  try {

    const { author, link } = job.attrs.data

    // Send an email
    joinApp(author, link)

    done()
  } catch (err) {
    throw err
  }
})

/**
 * Invitation accepted
 * @param {Object} job
 */
agenda.define('invitation_accepted', (job, done) => {
  try {

    const { author, invitedEmail } = job.attrs.data

    invitationAccepted(author, invitedEmail)

    done()
  } catch (err) {
    throw err
  }
})



/**
 * Registration successful
 * @param {Object} job
 * @param {Function} done
 */
agenda.define('registration_successful', (job, done) => {
  try {
    const author = job.attrs.data

    registrationSuccessful(author)

    done()
  } catch (err) {
    throw err
  }
})


/**
 * Event after forgot password
 * @param {Object} job
 * @param {Function} done
 */
agenda.define('reset_password', (job, done) => {
  try {
    const { author, code } = job.attrs.data

    forgotPassword(author, code)

    done()
  } catch (err) {
    throw err
  }
})

/**
 * Reset password confiramtion mail
 * @param {Object} job
 * @param {Function} done
 */
agenda.define('reset_password_successful', (job, done) => {
  try {
    const { author } = job.attrs.data

    resetPasswordSuccessful(author)

    done()
  } catch (err) {
    throw err
  }
})

/**
 * Password changed
 * @param {Object} job
 * @param {Function} done
 */
agenda.define('password_changed', (job, done) => {
  try {
    const { author } = job.attrs.data

    passwordChanged(author)

    done()
  } catch (err) {
    throw err
  }
})

/**
 * Delete account
 * @param {Object} job
 * @param {Function} done
 */
agenda.define('delete_account', (job, done) => {
  try {
    const { author } = job.attrs.data

    deleteAccount(author)

    done()
  } catch (err) {
    throw err
  }
})

/**
 * Password changed
 * @param {Object} job
 * @param {Function} done
 */
agenda.define('report_comment_spam', (job, done) => {
  try {
    const { author, story, reason, comment } = job.attrs.data

    reportCommentSpam(author, story, reason, comment)

    done()
  } catch (err) {
    throw err
  }
})

/**
 * Create comment
 * @param {Object} job
 * @param {Function} done
 */
agenda.define('create_comment', (job, done) => {
  try {
    const { author, story, comment } = job.attrs.data

    commentsAndReplies(author, story, comment)

    done()
  } catch (err) {
    throw err
  }
})

/**
 * Event after story has been created
 * @param {Object} job
 * @returns {Object} - New activity
 */
agenda.define('story_created', async job => {
  try {
    const { data } = job.attrs

    return await storyCreated(data)
  } catch (err) {
    throw err
  }
})

/**
 * Event for adding collaborator (edit: false)
 * @param {Object} job
 */
agenda.define('story_shared', async job => {
  try {
    const { data } = job.attrs

    return await storyShared(data)
  } catch (err) {
    throw err
  }
})

/**
 * Event for adding collaborator (edit: false) by email
 * @param {Object} job
 */
agenda.define('story_shared_by_email', async job => {
  try {

    const { data } = job.attrs

    return await storyShared(data)
  } catch (err) {
    throw err
  }
})

/**
 * Event after story has been updated
 * @param {Object} job
 * @returns {Object} - New activity
 */
agenda.define('story_update', async job => {
  try {
    const { data } = job.attrs

    return await storyUpdate(data)
  } catch (err) {
    throw err
  }
})

/**
 * Event for story added to favorites
 * @param {Object} job
 * @returns {Object} - New activity
 */
agenda.define('favorite_added', async job => {
  try {
    const { data } = job.attrs

    return await favoriteStory(data)
  } catch (err) {
    throw err
  }
})

/**
 * Event for adding collaborator (edit: true)
 * @param {Object} job
 */
agenda.define('add_collaborator', async job => {
  try {

    const { data } = job.attrs
    await collaboratorAdded(data)

  } catch (err) {
    throw err
  }
})

/**
 * Event for collaborator leave
 * @param {Object} job
 */
agenda.define('leave_collaboration', async job => {
  try {

    const { data } = job.attrs
    await collaboratorLeaved(data)

  } catch (err) {
    throw err
  }
})

/**
 * Remove collaborator from Story
 * @param {Object} job
 * @returns {Object} - New activity
 */
agenda.define('remove_from_collaboration', async job => {
  try {
    const { data } = job.attrs

    // User removed another user from collaboration
    await userRemoveAnotherCollaborator(data)

    // User removed you from collaboration
    await userRemoveYouFromCollaboration(data)
  } catch (err) {
    throw err
  }
})

/**
 * Collaboration share set to false
 * @param {Object} job
 * @returns {Object} - New activity
 */
agenda.define('collaboration_share_false', async job => {
  try {
    const { data } = job.attrs

    // User removed another user from collaboration
    await collaborationShareFalse(data)

  } catch (err) {
    throw err
  }
})

export default agenda
