/**
 * @file Email service
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

/* eslint-disable camelcase */
// dependencies
import config from '../config'
import PostageApp from 'postageapp'
import uuid from 'node-uuid'

const postage = new PostageApp(config.postageapp.API_ID)


/**
 * Send email via Postageapp service
 *
 * @param {Object} data
 */
export const send = async (data) => {
  data.uid = uuid.v4()
  if (!config.test) {
    await postage.sendMessage(data)
  }
}

/**
 * Author's activation email with activation link
 *
 * @param {Object} author Author's data (email, name, username)
 */
export const activation = async author => {
  try {
    const name = author.name
    await send({
      recipients: author.email,
      template: 'activate_user',
      variables: {
        name,
        activation_url: `${config.baseUrl}/activate-user/${author.token.refresh}`
      }
    })
    return author
  } catch (err) {
    console.log(err.stack)
    throw err
  }
}

/**
 * Join app, author invited and send link
 *
 * @param {Object} author Author's data (email, name, username)
 */
export const joinAppEmail = (author, link) => {
  try {
    const { name } = author
    send({
      template: 'join_app',
      variables: {
        name,
        link
      }
    })
  } catch (err) {
    throw err
  }
}

/**
 * invitation accepted
 *
 * @param {object} author
 * @param {string} invitedEmail
 */
export const invitationAcceptedEmail = (author, invitedEmail) => {
  try {
    const { username } = author
    send({
      template: 'invitation_accepted',
      variables: {
        username,
        invitedEmail
      }
    })
  } catch (err) {
    throw err
  }
}

/**
 * Author's welcome email
 *
 * @param {Object} author Author's data (username, email)
 */
export const registrationSuccessfulEmail = author => {
  try {
    const { username, email } = author
    send({
      recipients: email,
      template: 'registration_successful',
      variables: {
        username,
      }
    })
  } catch (err) {
    throw err
  }
}

/**
 * Send email for reset password
 *
 * @param {object} user     user who need to receive an email
 * @param {string} code     code for validation
 */
export const resetPassword = (user, code) => {
  try {
    send({
      recipients: user.email,
      template: 'reset_password',
      variables: {
        name: user.name,
        activation_url: config.baseUrl + '/resetpass/' + user.id + '/' + code
      }
    })
  } catch (err) {
    throw err
  }
}

/**
 * Send email for successful reset password
 *
 * @param {object} user  user who need to receive an email
 */
export const resetPasswordSuccessfulEmail = (user) => {
  try {
    send({
      recipients: user.email,
      template: 'reset_password_successful',
      variables: {
        name: user.name,
      }
    })
  } catch (err) {
    throw err
  }
}

/**
 * Send email for password changed
 *
 * @param {object} user  user who need to receive an email
 */
export const passwordChangedEmail = (user) => {
  try {
    send({
      recipients: user.email,
      template: 'password_changed',
      variables: {
        name: user.name,
      }
    })
  } catch (err) {
    throw err
  }
}

/**
 * Send email for delete account
 *
 * @param {object} user  user who need to receive an email
 */
export const deleteAccountEmail = (user) => {
  try {
    send({
      recipients: user.email,
      template: 'delete_account',
      variables: {
        name: user.name,
      }
    })
  } catch (err) {
    throw err
  }
}

/**
 * Send email to admin for reported spam story
 *
 * @param {object} user
 * @param {object} story
 * @param {object} data
 */
export const reportCommentSpamEmail = (user, story, reason, comment) => {
  try {
    send({
      recipients: user.email,
      template: 'story_report_spam',
      variables: {
        name: user.name,
        username: user.username,
        storyTitle: story.title,
        reason,
        comment
      }
    })
  } catch (err) {
    throw err
  }
}

/**
 * Send email for invitation for collaboration on Story
 *
 * @param {object} collaborator
 * @param {object} story
 * @param {object} user
 * @param {boolean} edit Does user is edit or view permission
 */
export const collaborationInvitation = (collaborator, story, user, edit) => {
  send({
    recipients: collaborator.email,
    template: 'collaboration_invite',
    variables: {
      name: collaborator.name,
      author: user.name,
      author_url: config.baseUrl + '/' + user.username,
      journal_name: story.title,
      journal_url: config.baseUrl + '/' + user.username + '/story/' + story.slug,
      edit: edit || false
    }
  })
}

/**
 * Send email for adding collaborator (edit: false)
 *
 * @param {object} story
 * @param {object} collaborator
 */
export const storySharedEmail = (story, collaborator) => {
  send({
    recipients: collaborator.email,
    template: 'story_shared',
    variables: {
      story_title: story.title,
      // TODO: link is missing
    }
  })
}

/**
 * Send email for adding collaborator by email (edit: false)
 *
 * @param {object} story
 * @param {object} collaborator
 */
export const storySharedByEmailEmail = (story, email) => {
  send({
    recipients: email,
    template: 'story_shared_email',
    variables: {
      story_title: story.title,
      // TODO: link is missing
    }
  })
}

/**
 * Send invitations by emails (missing email addresses in iStory)
 *
 * @param {Array} emailAddress
 * @param {Object} collaborator
 * @param {Object} story
 * @param {Object} user
 * @param {boolean} edit
 */
export const collaborationInvitationByEmail = (emailAddress, collaborator, story, user, edit) => {
  send({
    recipients: emailAddress,
    template: 'collaboration_invite',
    variables: {
      name: collaborator ? collaborator.name : emailAddress,
      author: user.name,
      author_url: config.baseUrl + '/' + user.username,
      journal_name: story.title,
      journal_url: config.baseUrl + '/' + user.username + '/story/' + story.slug,
      edit: edit || false
    }
  })
}
