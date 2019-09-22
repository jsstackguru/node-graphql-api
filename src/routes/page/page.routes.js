// Handles
import * as pageHndl from '../../handles/page.handles'
// Libraries
import { BadRequest } from '../../lib/errors'
import translate from '../../lib/translate'
import utils from '../../lib/utils'

/**
 * Copy page
 *
 * @param {function} req Request
 * @param {function} res Response
 * @param {function} next Middleware
 * @returns {Promise.<*>}
 */
const copy = async (req, res, next) => {
  try {
    const pageId = req.body.pageId
    const storyId = req.body.storyId

    if(!pageId || !utils.isObjectID(pageId)) {
      throw new BadRequest(translate.__('Missing page id'))
    }
    if (!storyId || !utils.isObjectID(storyId)) {
      throw new BadRequest(translate.__('Missing story id'))
    }

    let user = req.effectiveUser
    let result = await pageHndl.copy(pageId, storyId, user._id)

    res.send({
      data: result
    })

  } catch (err) {
    return next(err)
  }
}

/**
 * Move page
 *
 * @param {function} req Request
 * @param {function} res Response
 * @param {function} next Middleware
 * @returns {Promise.<*>}
 */
const move = async (req, res, next) => {
  try {
    const pageId = req.body.pageId
    const storyId = req.body.storyId

    if (!pageId || !utils.isObjectID(pageId)) {
      return next(new BadRequest(translate.__('Missing page id')))
    }
    if (!storyId || !utils.isObjectID(storyId)) {
      return next(new BadRequest(translate.__('Missing story id')))
    }

    let user = req.effectiveUser
    let removePageAfter = true
    let result = await pageHndl.copy(pageId, storyId, user._id, removePageAfter)

    res.send({
      data: result
    })

  } catch (err) {
    return next(err)
  }
}

/**
 * Insert content element
 *
 * @param {function} req Request
 * @param {function} res Response
 * @param {function} next Middleware
 * @returns //TODO: dovrši
 *
 */
const insertContentElement = async (req, res, next) => { try {
  const types = ['text', 'image', 'gallery', 'gif', 'audio', 'video', 'recording']

  let user = req.effectiveUser
  let storyId = req.body.storyId
  let pageId = req.params.id
  let content = req.body.content
  let files = !utils.isObjEmpty(req.files) ? req.files : null
  let order = req.body.order

  let typeValidation = types.find(t => t === content.type)
  if (!typeValidation) {
    throw new BadRequest(translate.__('You need correct file type'))
  }

  // return error if content type is not text and without files
  if (!files && content.type !== 'text') {
    throw new BadRequest(translate.__('You need to send a file'))
  }

  let page = await pageHndl.addContentElement(user, storyId, pageId, content, files, order)

  res.json({data: page})

} catch (err) {
  return next(err)
}
}

/**
 * Remove single content element
 *
 * @param {function} req
 * @param {function} res
 * @param {function} next
 * @returns {Object}
 */
const removeContentElement = async (req, res, next) => {
  try {
    let user = req.effectiveUser
    let pageId = req.params.id
    // let contentId = req.body.content ? req.body.content.content_id : undefined
    let contentId = req.body.contentId

    if(!contentId || !pageId || !utils.isObjectID(pageId)) {
      throw new BadRequest(translate.__('Bad parameters')) // TODO: da li da bude više validacija ?
    }
    let page = await pageHndl.removeContentElement(user, pageId, contentId)
    res.json({data: page})

  } catch (err) {
    return next(err)
  }

}

/**
 * Create new page in Story
 *
 * @param {function} req Request
 * @param {function} res Response
 * @param {function} next Middleware
 * @returns {Promise<*>}
 */
export const create = async (req, res, next) => {
  try {
    const storyId = req.body.storyId

    if(!storyId) {
      throw new BadRequest( translate.__('Missing Story ID') )
    }

    const cover = (req.files) ? req.files.cover : null
    const dateFrom = req.body.dateFrom
    const dateTo = req.body.dateTo
    const place = req.body.place
    const files = req.files
    const content = req.body.content || null

    if (!content || content.length == 0) {
      throw new BadRequest( translate.__('Story page must have at least one element') )
    }

    const title = req.body.title
    const order = req.body.pageNumber
    const matchId = req.body.matchId
    const author = req.effectiveUser

    const result = await pageHndl.newPage(author, storyId, title, cover, dateFrom, dateTo, place, content, matchId, order, files)

    res.json(result)

  } catch (err) {
    return next(err)
  }
}

/**
 * Create new page in Story
 *
 * @param {function} req Request
 * @param {function} res Response
 * @param {function} next Middleware
 * @returns {Promise<*>}
 */
const update = async (req, res, next) => {
  try {

    const pageId = req.body.pageId

    if (!pageId) {
      return next(new BadRequest(translate.__('Missing page ID')))
    }

    const author = req.effectiveUser
    const title = req.body.title
    const place = req.body.place
    const pageCover = req.files.cover
    const content = req.body.content
    const dateFrom = req.body.dateFrom
    const dateTo = req.body.dateTo
    const matchId = req.body.matchId
    const files = req.files

    let result = await pageHndl.update(
      author._id,
      pageId,
      title,
      place,
      pageCover,
      content,
      dateFrom,
      dateTo,
      matchId,
      files
    )

    return res.send({data: result})

  } catch (err) {
    return next(err)
  }

}

/**
 * Delete page
 *
 * @param {function} req Request
 * @param {function} res Response
 * @param {function} next Middleware
 * @returns {Promise<*>} //TODO: finish this!
 */
const deletePage = async (req, res, next) => {
  try {
    const pageId = req.params.id
    const storyId = req.body.storyId
    const user = req.effectiveUser

    if (!pageId) {
      return next(new BadRequest(translate.__('Missing page ID')))
    }
    if (!storyId) {
      return next(new BadRequest(translate.__('Missing story ID')))
    }
    await pageHndl.deletePage(user._id, storyId, pageId, 'remove_from_story')

    return res.send({
      // status: true,
      message: 'You successfully deleted page', //TODO: message
      data: pageId //TODO: revision
    })

  } catch (err) {
    return next(err)
  }

}

export default {
  copy,
  move,
  insertContentElement,
  removeContentElement,
  create,
  update,
  deletePage
}
