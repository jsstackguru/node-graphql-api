/**
 * @file Routes for story
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import fs from 'fs'
import mime from 'mime'
import rimraf from 'rimraf'

/*  Handles */
import storyHndl from '../../handles/story.handles'
/*  Errors  */
import { BadRequest } from '../../lib/errors'
/*  Libraries */
import translate from '../../lib/translate'
/*  Utils */
import { paginate, isObjectID } from '../../lib/utils'
/* event emmiter */
import eventEmitter from '../../services/events'

const myStories = async (req, res, next) => {
  try {
    let user = req.effectiveUser
    let filters = req.params.filters
    let status = req.params.status
    let search = req.params.search

    let stories = await storyHndl.myStories(user.id, filters, status, search)

    res.send(paginate(stories))

  } catch (err) {
    return next(err)
  }
}

/**
 * Create Story
 *
 * @param {function} req Request
 * @param {function} res Response
 * @param {function} next Middleware
 * @returns {Promise.<*>}
 */
const create = async (req, res, next) => {
  try {
    const title = req.body.title
    const privacyType = req.body.privacyType
    const cover = (req.files && req.files.cover) ? req.files.cover : null
    const collaborators = req.body.collaborators || []
    const page = req.body.page
    const pageCover = (req.files) ? req.files.pageCover : null
    const contents = req.body.content || null
    const files = req.files || null

    if (!title || title == '') {
      let err = new BadRequest(translate.__('Title missing'))
      return next(err)
    }

    if (!privacyType) {
      let err = new BadRequest(translate.__('Privacy type missing'))
      return next(err)
    }

    if (!page) {
      let err = new BadRequest(translate.__('Story must have at least one page'))
      return next(err)
    }

    if (!contents || contents.length == 0) {
      let err = new BadRequest(translate.__('Story page must have at least one element'))
      return next(err)
    }

    const author = req.effectiveUser

    const story = await storyHndl.create(
      author,
      title,
      privacyType,
      cover,
      collaborators,
      page,
      pageCover,
      contents,
      files
    )

    // trigger event
    eventEmitter.emit('story_created', {
      author,
      story
    })
    // send response
    res.send({
      data: story
    })

  } catch (err) {
    console.log(err.stack)
    return next(err)
  }
}

/**
 * Export preview
 *
 * @param {function} req Request
 * @param {function} res Response
 * @param {function} next Middleware
 * @returns {Promise.<*>}
 */
const exportPreview = async (req, res, next) => {
  try {
    let user = req.effectiveUser
    let preview = req.body.preview || false

    let content = await storyHndl.exportAllStories(user._id, preview)

    res.json(content)
  } catch (err) {
    return next(err)
  }
}

/**
 * Export all content for download
 * @param {function} req Request
 * @param {function} res Response
 * @param {function} next Middleware
 * @returns {Promise.<*>}
 */
const exportDownload = async (req, res, next) => {
  try {
    let authorId = req.effectiveUser._id

    let data = await storyHndl.downloadExportedStories(authorId)

    let file = data
    let mimetype = mime.lookup(file)

    // set headers for download
    res.setHeader('Content-disposition', 'attachment; filename=' + authorId + '.zip')
    res.setHeader('Content-type', mimetype)

    let filestream = fs.createReadStream(file)
    filestream.pipe(res)

    await new Promise((resolve, reject) => {
      filestream.on('close', () => {
        // delete files from server
        fs.unlinkSync(file)

        let directory = __dirname + '/../../exports/' + authorId + '/'

        rimraf(directory, () => {
          resolve(directory)
        })
      })

      // handle error if exist
      filestream.on('error', (err) => {
        reject(err)
      })
    })

  } catch (err) {
    return next(err)
  }
}

/**
 * Update Story
 *
 * @param {function} req Request
 * @param {function} res Response
 * @param {function} next Middleware
 * @returns {Promise.<*>}
 */
const update = async (req, res, next) => {
  try {

    const id = req.body.id
    const title = req.body.title
    const cover = (req.files && req.files.cover) ? req.files.cover : null
    const pageIds = req.body.pageIds

    if (!id) {
      throw new BadRequest(translate.__('Story ID missing'))
    }

    if (!title || title == '') {
      let err = new BadRequest(translate.__('Title missing'))
      return next(err)
    }

    const author = req.effectiveUser

    const result = await storyHndl.update(author, id, title, pageIds, cover)

    res.send({
      data: result
    })

  } catch (err) {
    return next(err)
  }
}

/**
 * Delete Story
 *
 * @param {function} req Request
 * @param {function} res Response
 * @param {function} next Middleware
 * @returns {Promise.<*>}
 */
const deleteStory = async (req, res, next) => {
  try {

    const storyId = req.params.id
    const authorId = req.effectiveUser._id
    if (!storyId || !isObjectID(storyId)) {
      throw new BadRequest(translate.__('Story ID missing, or not good format')) // TODO: message
    }

    await storyHndl.deleteStory(authorId, storyId)

    res.send({
      // status: true,
      message: 'You successfully deleted story', //TODO: message
      data: storyId // TODO: da li da vracam rekord uz status i poruku?
    })

  } catch (err) {
    console.log(err.stack)
    return next(err)
  }
}

/**
 * Set share settings fot the story
 * @param {Function} req Request
 * @param {Function} res Response
 * @param {Function} next Middleware
 */
const setShare = async (req, res, next) => {
  try {
    const storyId = req.body.id
    const settings = req.body.share
    const privacyType = req.body.privacyType
    const user = req.effectiveUser

    if (!storyId) {
      throw new BadRequest(translate.__('Story ID missing'))
    }

    const response = await storyHndl.setShareSettings(user.id, storyId, privacyType, settings)

    // emit public story has been published //TODO: do we need this?
    if (privacyType === 'public') {
      eventEmitter.emit('public_story', {
        story: storyId
      })
    }

    res.send({data: response})
  } catch (err) {
    return next(err)
  }
}

/**
 * Set Story as a favorite by user
 * 
 * @param {Function} req Request
 * @param {Function} res Response
 * @param {Function} next Middleware
 */
const setFavorite = async (req, res, next) => {
  try {
    const id = req.params.id
    const user = req.effectiveUser

    if (!id) {
      throw new BadRequest(translate.__('Story ID is required'))
    }

    await storyHndl.setFavorite(id, user.id)

    res.send({
      status: true,
      message: translate.__('The Story has been set as a favorite')
    })
  } catch (err) {
    return next(err)
  }
}

/**
 * Unset Story from favorite
 * 
 * @param {Function} req Request
 * @param {Function} res Response
 * @param {Function} next Middleware
 */
const unsetFavorite = async (req, res, next) => {
  try {
    const user = req.effectiveUser
    const id = req.params.id

    if (!id) {
      throw new BadRequest(translate.__('Missing Story ID'))
    }

    await storyHndl.unsetFavorite(id, user.id)

    res.send({
      status: true,
      message: translate.__('The Story has been removed from favorites'),
      story: id
    })
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  create,
  deleteStory,
  exportPreview,
  exportDownload,
  myStories,
  setShare,
  setFavorite,
  unsetFavorite,
  update
}
