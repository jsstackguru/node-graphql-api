/**
 * @file Events service
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import { EventEmitter } from 'events'

// Services
import agenda from './jobs'

export const eventEmitter = new EventEmitter()

eventEmitter
  .on('register', newAuthor => {
    agenda.now('registration', newAuthor)
  })
  .on('join_app', data => {
    agenda.now('join_app', data) //TODO: emit somewhere
  })
  .on('invitation_accepted', data => {
    agenda.now('invitation_accepted', data) //TODO: emit somewhere
  })
  .on('registration_successful', author => {
    agenda.now('registration_successful', author) //TODO: emit somewhere
  })
  .on('reset_password', data => {
    agenda.now('reset_password', data)
  })
  .on('reset_password_successful', data => {
    agenda.now('reset_password_successful', data) // TODO: emit somewhere
    agenda.schedule('in 10 minutes', 'password_changed', data) // TODO: revision this
  })
  .on('report_comment_spam', data => {
    agenda.schedule('in 10 minutes', 'report_comment_spam', data)
  })
  .on('create_comment', data => {
    agenda.schedule('in 10 minutes', 'create_comment', data)
  })
  .on('delete_account', data => {
    agenda.now('delete_account', data)
  })
  .on('add_collaborator', data => {
    // if only read rights (social activity)
    if (!data.edit) {
      agenda.schedule('in 10 minutes', 'story_shared', data)
    // collaboration activity
    } else {
      agenda.schedule('in 10 minutes', 'add_collaborator', data)
    }
  })
  .on('add_collaborator_by_email', data => {
    // TODO:
    if (!data.edit) {
      agenda.schedule('in 10 minutes', 'story_shared_by_email', data)
    }
  })
  .on('leave_collaboration', data => {
    agenda.now('leave_collaboration', data)
  })
  .on('remove_from_collaboration', data => {
    agenda.now('remove_from_collaboration', data)
  })
  .on('collaboration_share_false', data => {
    agenda.now('collaboration_share_false', data)
  })
  .on('story_created', data => {
    agenda.now('story_created', data)
  })
  .on('story_update', data => {
    agenda.schedule('in 10 minutes', 'story_update', data)
  })
  .on('favorite_added', data => {
    agenda.schedule('in 5 minutes', 'favorite_added', data)
  })
  .on('follow_author', async data => {
    await agenda.schedule('in 5 minutes', '', data)
  })
  .on('spam', data => {
    if (data.storyId) {
      // console.log('story') //TODO:
    } else if (data.pageId) {
      // console.log('page') //TODO:
    } else if (data.commentId) {
      // console.log('comment') //TODO:
    }
  })
  .on('content_update', () => {

  })
  // group has been created
  .on('group_created', () => {
    //TODO:
  })
  .on('group_invitation', () => {
    //TODO:
  })
  .on('group_invitation_accept', () => {
    // TODO:
  })
  .on('group_leave', () => {
    // TODO:
  })
  .on('public_story', () => {
    
  })

export default eventEmitter
