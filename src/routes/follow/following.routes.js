/**
 * @file Routes for following
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

// Handlers
import followingHndl from '../../handles/following.handles'
// Services
import utils from '../../lib/utils'
// Libraries
import { UnprocessableEntity } from '../../lib/errors'
import translate from '../../lib/translate'

/**
 * Start to follow author
 *
 * @param {function} req  Request
 * @param {function} res  Response
 * @param {function} next Middleware
 * @returns {Promise.<*>}
 */
const follow = async (req, res, next) => {
  try {
    const authorId = req.body.authorId
    let followsId = req.effectiveUser.id

    if(!authorId || !utils.isObjectID(authorId)) {
      return next(new UnprocessableEntity( translate.__('Missing author id') ))
    } else if (followsId.toString() == authorId) {
      return next(new UnprocessableEntity(translate.__('You can\'t follow yourself')))
    }

    let result = await followingHndl.follow(followsId, authorId)

    res.send({
      message: translate.__('You successfully followed author'), // TODO: message
      data: result
    })
  } catch (err) {
    return next(err)
  }
}

/**
 * Stop to follow author
 *
 * @param {function} req  Request
 * @param {function} res  Response
 * @param {function} next Middleware
 * @returns {Promise.<*>}
 */
const unfollow = async (req, res, next) => {
  try {
    const authorId = req.body.authorId
    const followsId = req.effectiveUser.id

    if(!authorId) {
      return next(new UnprocessableEntity( translate.__('Missing author id') ))
    }

    let result = await followingHndl.unfollow(followsId, authorId)

    res.send({
      message: translate.__('You successfully unfollowed author'), // TODO: message
      data: result
    })

  } catch (err) {
    return next(err)
  }
}

export default {
  follow,
  unfollow
}
