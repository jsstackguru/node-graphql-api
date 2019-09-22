/**
 * @file Handles for spam
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

// Models
import Story from '../models/story/story.model'
import Page from '../models/page/page.model'
import Comments from '../models/comment/comment.model'
import Author from '../models/author/author.model'
import StorySpam from '../models/story-spam/story-spam.model'
import PageSpam from '../models/page-spam/page-spam.model'
import CommentSpam from '../models/comment-spam/comment-spam.model'
// Services
import { UnprocessableEntity } from '../lib/errors'
import translate from '../lib/translate'
import events from '../services/events'

/**
 * report story as spam, handler
 *
 * @param {String} userId
 * @param {String} storyId
 * @param {String} ipAddress
 * @param {String} message
 * @returns //TODO: finish this!
 */
const reportStory = async (userId, storyId, ipAddress, message) => {
  try {

    let author = await Author.findOneActiveById(userId, 'throw_err_if_not_found')

    let story = await Story.findOneActiveById(storyId, 'throw_err_if_not_found')

    if(String(author._id) === String(story.author)) {
      throw new UnprocessableEntity(translate.__('You can\'t report your story'))
    }

    const authorSpam = await StorySpam.findSpamAuthor(author._id, storyId)
    if (authorSpam.length > 0) {
      throw new UnprocessableEntity(translate.__('You already reported this story'))
    }

    const ipSpam = await StorySpam.findByIp(ipAddress)
    if (ipSpam.length > 4) {
      throw new UnprocessableEntity(translate.__('You can\'t report from the same IP address')) //TODO: revision
    }

    let newSpam = await StorySpam.create({
      author: author._id,
      storyId: story._id,
      ipAddress: ipAddress,
      message: message ? message : null
    })

    // emit event for story spam
    events.emit('spam', newSpam)

    return newSpam

  } catch (err) {
    throw err
  }
}

/**
 * report story as spam, handler
 *
 * @param {String} userId
 * @param {String} pageId
 * @param {String} ipAddress
 * @param {String} message
 * @returns //TODO: finish this!
 */
const reportPage = async (userId, pageId, ipAddress, message) => {
  try {

    let author = await Author.findOneActiveById(userId, 'throw_err_if_not_found')

    let page = await Page.findActivePage(pageId, 'throw_err_if_not_found')

    if(String(author._id) === String(page.author)) {
      throw new UnprocessableEntity(translate.__('You can\'t report your page'))
    }

    const pageSpam = await PageSpam.findSpamAuthor(author._id, pageId)
    if (pageSpam.length > 0) {
      throw new UnprocessableEntity(translate.__('You already reported this page'))
    }

    const ipSpam = await PageSpam.findByIp(ipAddress)
    if (ipSpam.length > 4) {
      throw new UnprocessableEntity(translate.__('You can\'t report from the same IP address')) //TODO: revision
    }

    let newSpam = await PageSpam.create({
      author: author._id,
      pageId: page._id,
      ipAddress: ipAddress,
      message: message ? message : null
    })

    // emit event for story spam
    events.emit('spam', newSpam)

    return newSpam

  } catch (err) {
    throw err
  }
}

/**
 * report comment as spam, handler
 *
 * @param {String} userId
 * @param {String} commentId
 * @param {String} ipAddress
 * @param {String} message
 * @param {Number} reason
 * @returns //TODO: finish this!
 */
const reportComment = async (userId, commentId, ipAddress, message, reason) => {
  try {

    const author = await Author.findOneActiveById(userId, 'throw_err_if_not_found')
    const comment = await Comments.findOneActiveById(commentId, 'throw_err_if_not_found')
    const page = await Page.findActivePage(comment.page, 'throw_err_if_not_found')
    const story = await Story.findOne({pages: page.id})

    if (String(author._id) === String(comment.author)) {
      throw new UnprocessableEntity(translate.__('You can\'t report your comment'))
    }

    const commentSpam = await CommentSpam.findSpamAuthor(author._id, commentId)
    if (commentSpam.length > 0) {
      throw new UnprocessableEntity(translate.__('You already reported this comment'))
    }

    const ipSpam = await CommentSpam.findByIp(ipAddress)
    if (ipSpam.length > 4) {
      throw new UnprocessableEntity(translate.__('You can\'t report from the same IP address')) //TODO: revision
    }
    const newSpam = await CommentSpam.create({
      author: author._id,
      commentId: comment._id,
      ipAddress: ipAddress,
      message: message ? message : null,
      reason: reason
    })
    
    return {
      spam: newSpam,
      comment,
      story
    }

  } catch (err) {
    throw err
  }
}

module.exports = {
  reportStory,
  reportPage,
  reportComment
}
