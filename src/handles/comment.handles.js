// Models
import { commentExtractor, Comment } from '../models/comment'
import { Story } from '../models/story'

// Libraries
import { UnprocessableEntity, BadRequest, Forbidden } from '../lib/errors'
import utils from '../lib/utils'
import translate from '../lib/translate'

// Extractors
import strings from '../routes/graphQueriesVars'
import { authorExtractor } from '../models/author'

// services
import eventEmitter from '../services/events'

const basicAuthor = strings.author.basic
/**
 * Create page comment
 *
 * @param {string} pageId
 * @param {string} commentId
 * @param {string} authorId
 * @param {string} text
 * @returns {Promise.<*>}
 */
const createComment = async (author, pageId, text) => {
  try {

    // check to see if pageId  is valid ObjectId
    if (!utils.isObjectID(pageId)) {
      throw new UnprocessableEntity(translate.__('pageId is not valid ObjectId'))
    }

    // check text, must contain some character
    if (!text) {
      throw new UnprocessableEntity(translate.__('You need to enter some text message'))
    }
    // create new comment object
    let commentObj = {
      author: author.id,
      page: pageId,
      text: text,
      created: new Date(),
      deleted: false,
      active: true,
      spam: 0,
      reply: null
    }

    // create comment
    const comment = await Comment.create(commentObj)
    // populate author
    await comment.populate('author', basicAuthor).execPopulate()

    const story = await Story.findStoryByPageId(pageId, 'throw_err_if_not_found')

    // emmit event
    eventEmitter.emit('create_comment', {
      story,
      comment,
      author
    })

    return comment

  } catch (err) {
    throw err
  }
}

/**
 * Create reply to a comment on a page
 *
 * @param {string} authorId
 * @param {string} commentId
 * @param {string} text
 * @returns {Promise.<*>}
 */
const createCommentReply = async (author, commentId, text) => {
  try {
    // check to see if commentId is valid ObjectId
    if (!utils.isObjectID(commentId)) {
      throw new UnprocessableEntity(translate.__('commentId is not valid ObjectId'))
    }
    // check if there is a comment
    const requiredComment = await Comment.findOneActiveById(commentId, 'throw_err_if_not_found')

    // check text, must contain some character
    if (!text) {
      throw new UnprocessableEntity(translate.__('You need to enter some text message'))
    }
    // create new comment object
    const commentObj = {
      author: author.id,
      page: requiredComment.page,
      text: text,
      deleted: false,
      active: true,
      spam: 0,
      reply: commentId
    }

    // create comment reply
    const comment = await Comment.create(commentObj)
    // populate author
    await comment.populate('author', basicAuthor)
      .populate({
        path: 'reply',
        select: commentExtractor.replyProperies,
        populate: {
          path: 'author',
          select: authorExtractor.basicProperties
        }
      }).execPopulate()

    const pageId = comment.page
    const story = await Story.findStoryByPageId(pageId, 'throw_err_if_not_found')

    // emmit event
    eventEmitter.emit('create_comment', {
      story,
      comment,
      author
    })

    return comment

  } catch (err) {
    throw err
  }
}

/**
 * Delete comment
 *
 * @param {String} id Comment ID
 * @param {Object} user Author
 */
const deleteComment = async (id, user) => {
  try {
    const comment = await Comment.findOne({_id: id})

    if (!comment) {
      throw new BadRequest(translate.__('Comment not found'))
    }

    if (!comment.author.equals(user._id)) {
      throw new Forbidden(translate.__('You don\'t have a permission to delete this comment'))
    }

    await comment.remove()

    return {
      _id: id
    }
  } catch (err) {
    throw err
  }
}

/**
 * Edit comment
 * @param {String} id Comment ID
 * @param {String} text Comment text
 * @param {String} authorId Author's ID
 */
const editComment = async (id, text, authorId) => {
  try {
    const comment = await Comment.findOne({ _id: id, active: true, deleted: false })
      .populate('author', basicAuthor)

    if (!comment) {
      throw new UnprocessableEntity(translate.__('Comment not found'))
    }
    if (!comment.author.equals(authorId)) {
      throw new Forbidden(translate.__('You are not the author of the comment'))
    }

    comment.text = text

    await comment.save()

    await comment.populate({
      path: 'reply',
      select: commentExtractor.replyProperies,
      populate: {
        path: 'author',
        select: authorExtractor.basicProperties
      }
    }).execPopulate()

    return commentExtractor.basic(comment)
  } catch (err) {
    throw err
  }
}

/**
 * Get comments by page ID
 * @param {String} id - Page ID
 * @returns {Array} - Page comments
 */
const getCommentsByPage = async id => {
  try {
    const comments = await Comment.find({
      page: id,
      active: true,
      deleted: false
    })
      .populate('author', authorExtractor.basicProperties)

    return comments
  } catch (err) {
    throw err
  }
}

module.exports = {
  createComment,
  createCommentReply,
  deleteComment,
  editComment,
  getCommentsByPage
}
