/**
 * @file Handler for followings collection
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

// Services
import eventEmitter from '../services/events'
// Libraries
import { UnprocessableEntity } from '../lib/errors'
import translate from '../lib/translate'
// Models
import Following from '../models/following/following.model'
import Author from '../models/author/author.model'
// Extractor
import AuthorExtractor from '../models/author/author.extractor'

/**
 * Start to following author
 *
 * @param {string} effectiveUserId  Who staring to following author
 * @param {string} followAuthorId   Author who is being to be followed
 * @returns {Promise.<*>}
 */
const follow = async (effectiveUserId, followAuthorId) => {
  try {

    const author = await Author.findOneActiveById(followAuthorId, 'throw_err_if_not_found')

    const following = await Following.findOne({ author: effectiveUserId, follows: followAuthorId })

    if (following) {
      throw new UnprocessableEntity(translate.__('User is following this author already')) //TODO: message
    }


    await Following.create({
      author: effectiveUserId,
      follows: followAuthorId,
    })

    // emit event
    eventEmitter.emit('follow_author', {
      author: effectiveUserId,
      follows: author._id
    })

    return AuthorExtractor.basic(author)

  } catch (err) {
    throw err
  }
}

/**
 * Stop to following author
 *
 * @param {string} effectiveUserId
 * @param {string} followAuthorId
 * @returns {Promise.<*>}
 */
const unfollow = async (effectiveUserId, followAuthorId) => {
  try {
    const author = await Author.findById(followAuthorId)

    if (!author) {
      throw new UnprocessableEntity(translate.__('Author is not found'))
    }

    const following = await Following.findOne({ author: effectiveUserId, follows: followAuthorId })
    if (!following) {
      throw new UnprocessableEntity(translate.__('User don\'t follow this author'))
    }

    await Following.deleteOne({_id: following._id})

    // emit event
    eventEmitter.emit('unfollow_author', {
      author: effectiveUserId,
      follows: author._id
    })

    return AuthorExtractor.basic(author)
  } catch (err) {
    throw err
  }
}

export default {
  follow,
  unfollow
}
