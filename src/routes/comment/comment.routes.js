// Handles
import commentsHndl from '../../handles/comment.handles'
// Services
import translate from '../../lib/translate'
import { BadRequest } from '../../lib/errors'

/**
 * Post new comment
 *
 * @param {function} req
 * @param {function} res
 * @param {function} next
 * @returns
 */
const postNewComment = async (req, res, next) => {
  try {
    let user = req.effectiveUser
    let pageId = req.body.pageId
    let comment = req.body.comment

    if (!pageId) {
      throw new BadRequest(translate.__('You are missing page parameter')) //TODO: message
    }

    if (!comment) {
      throw new BadRequest(translate.__('You are missing comment parameter')) //TODO: message
    }

    const result = await commentsHndl.createComment(user, pageId, comment)
    res.send({
      data: result
    })
  } catch (err) {
    return next(err)
  }
}

/**
 * Post new comment reply
 *
 * @param {function} req
 * @param {function} res
 * @param {function} next
 * @returns
 */
const postNewCommentReply = async (req, res, next) => {
  try {
    let user = req.effectiveUser
    let commentId = req.params.id
    let comment = req.body.comment
    if (!comment) {
      throw new BadRequest(translate.__('You are missing comment parameter')) //TODO: message
    }

    const result = await commentsHndl.createCommentReply(user, commentId, comment)

    res.send({
      data: result
    })

  } catch (err) {
    return next(err)
  }
}

/**
 * Delete comment
 * 
 * @param {Function} req Request
 * @param {Function} res Response
 * @param {Function} next Middleware
 */
const deleteComment = async (req, res, next) => {
  try {
    const id = req.params.id
    const user = req.effectiveUser

    if (!id) {
      throw new BadRequest(translate.__('Comment ID is missing'))
    }
    
    await commentsHndl.deleteComment(id, user)

    res.send({
      status: true,
      data: {
        _id: id
      }
    })
  } catch (err) {
    return next(err)
  }
}

/**
 * Edit comment by id
 * 
 * @param {Function} req Request
 * @param {Response} res Response
 * @param {Function} next Middleware
 */
const editComment = async (req, res, next) => {
  try {
    const id = req.params.id
    const comment = req.body.comment
    const user = req.effectiveUser

    if (!id) {
      throw new BadRequest(translate.__('Comment ID is required'))
    }
    if (!comment) {
      throw new BadRequest(translate.__('Comment text is required'))
    }

    const response = await commentsHndl.editComment(id, comment, user.id)

    res.send({
      data: response
    })
  } catch (err) {
    return next(err)
  }
}

export default {
  editComment,
  deleteComment,
  postNewComment,
  postNewCommentReply
}

