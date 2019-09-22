/**
 * @file Routes for spam
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

// Handles
import spamHndl from '../../handles/spam.handles'
// Services
import translate from '../../lib/translate'
import eventEmitter from '../../services/events'
// errors
import { UnprocessableEntity } from '../../lib/errors'
/**
 * report story as spam
 *
 * @param {function} req
 * @param {function} res
 * @param {function} next
 * @returns
 */
const reportStory = async (req, res, next) => {
  try {

    let user = req.effectiveUser
    let message = req.body.message
    let storyId = req.params.id
    let ipAddress = req.ip

    await spamHndl.reportStory(user._id, storyId, ipAddress, message)

    res.send({
      status: true,
      message: translate.__('You successfully report story'),
      // data: spam //TODO: da li drugaciji response
    })

  } catch (err) {
    return next(err)
  }
}

/**
 * report page as spam
 *
 * @param {function} req
 * @param {function} res
 * @param {function} next
 * @returns
 */
const reportPage = async (req, res, next) => {
  try {

    let user = req.effectiveUser
    let message = req.body.message ? req.body.message : null
    let pageId = req.params.id
    let ipAddress = req.ip

    await spamHndl.reportPage(user._id, pageId, ipAddress, message)

    res.send({
      status: true,
      message: translate.__('You successfully report page'),
      // data: spam //TODO: da li drugaciji response
    })

  } catch (err) {
    return next(err)
  }
}

/**
 * report comment as spam
 *
 * @param {function} req
 * @param {function} res
 * @param {function} next
 * @returns
 */
const reportComment = async (req, res, next) => {
  try {

    const user = req.effectiveUser
    const message = req.body.message
    const reason = req.body.reason
    const commentId = req.params.id
    const ipAddress = req.ip

    if (!message) {
      throw new UnprocessableEntity(translate.__('Message missing!')) //TODO: text
    }
    const data = await spamHndl.reportComment(user._id, commentId, ipAddress, message, reason)

    const { spam, comment, story } = data
    const eventData = {
      author: user,
      story,
      message: spam.message,
      reason: spam.reason,
      comment: comment.text
    }
    // emit
    eventEmitter.emit('report_comment_spam', eventData)

    res.send({
      status: true,
      message: translate.__('You successfully report comment'),
      // data: spam //TODO: da li drugaciji response
    })

  } catch (err) {
    return next(err)
  }
}

export default {
  reportStory,
  reportPage,
  reportComment
}
