/**
 * @file Handles for the Page
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import _ from 'underscore'
import probe from 'ffmpeg-probe'
import ffmpeg from 'ffmpeg'
import config from '../config'
import uuid from 'node-uuid'
import path from 'path'
import slug from 'slug'

// Models
import Page from '../models/page/page.model'
import Story from '../models/story/story.model'
import Comments from '../models/comment/comment.model'

// Services
import { uploadMediaS3 } from '../services/media/upload'
import { removeMediaS3 } from '../services/media/remove'
import { eventEmitter } from '../services/events'

// Libraries
import { UnprocessableEntity, Unauthorized } from '../lib/errors'
import translate from '../lib/translate'

// Extractors
import { authorExtractor, Author } from '../models/author'

/**
 * Create page
 *
 * @param {object} author Page author
 * @param {string} storyId Story ID (where page belongs)
 * @param {string} title Page title
 * @param {date} dateFrom Dedicated date for page - i.e. story from vacation and author wants to set date of story (optional)
 * @param {date} dateTo Dedicated date for page (optional)
 * @param {object} place Location for page, contains: location, longitude, latitude, name
 * @param {Array} content Array of page content. Available types: text, image, gallery, recording, audio, gif, video
 * @param {integer} order Order index in Story
 * @param {string} matchId ID sent from iOS device to help in synchronization
 */

const create = async (author, title, dateFrom, dateTo, place, cover, content, matchId, status) => {
  try {
    const slug = await generateSlug(title)
    // escape place if it's not set correctly
    if (place && place.lon === 0 && place.lat === 0 && place.name === '') {
      place = null
    }
    let data = {
      author,
      title,
      dateFrom,
      dateTo,
      place,
      content,
      matchId,
      theme: {
        cover
      },
      slug,
      status,
      active: true,
      deleted: false,
    }

    // upload cover
    if (cover) {
      let file = cover
      let type = file.type.split('/')
      let extension = type[1]
      let imageId = uuid.v1()
      let key = 'images/' + author._id + '/' + imageId + '.' + extension

      // upload page cover file
      await uploadMediaS3(file, key)

      // set cover to page
      data.theme.cover = key
    }
    // try to find page with match id
    let page = await Page.findOneAndUpdate({
      $and: [{matchId: matchId}, {matchId: {$ne: null}}],
      deleted: false, active: true
    }, data, {
      new: true
    })
    
    if (!page) {
      // create new page
      page = await Page.create(data)
    }

    await page.populate('author', authorExtractor.basicProperties).execPopulate()
    
    return page
  } catch (err) {
    throw err
  }
}

/**
 * Update page
 * @param {string} authorId Author's ID, user who's trying to update page
 * @param {string} id Page ID
 * @param {string} title
 * @param {Object} place
 * @param {file} pageCover
 * @param {Object[]} content
 * @param {string} dateFrom
 * @param {string} dateTo
 * @param {string} matchId
 * @param {array} files
 * @return {Promise.<*>}
 */
const update = async (authorId, pageId, title, place, pageCover, content, dateFrom, dateTo, matchId, files) => {
  try {
    let page = await Page.findActivePage(pageId, 'throw_err_if_not_found')

    // if (!page) {
    //   throw new UnprocessableEntity(translate.__('Page is not found'))
    // }

    if (authorId.toString() !== page.author.toString() ) {
      throw new UnprocessableEntity(translate.__('User is not the author'))
    }

    let updateQuery =  {
      author: authorId,
      title: title || page.title,
      dateFrom: dateFrom || page.dateFrom,
      dateTo: dateTo || page.dateTo,
      place: place || page.place,
      content: content || page.content,
      matchId: matchId || page.matchId,
      theme: {
        cover: pageCover || page.theme.cover
      }
    }

    // upload cover
    if (pageCover) {
      let file = pageCover
      let type = file.type.split('/')
      let extension = type[1]
      let imageId = uuid.v1()
      let key = 'images/' + authorId._id + '/' + imageId + '.' + extension

      // upload page cover file
      await uploadMediaS3(file, key)

      // set cover to page
      updateQuery.theme.cover = key
    }

    // update page properties
    for (let key in updateQuery) {
      let prop = updateQuery[key]
      page[key] = prop
    }

    // update content
    if (content && files) {
      const author = await Author.findById(authorId)
      if (author) {
        page = await updateContents(author, page._id, content, files)
      }
    }

    await page.save()

    await page.populate('author', authorExtractor.basicProperties).execPopulate()

    return page

  } catch (err) {
    throw err
  }
}

/**
 * Insert single content element
 *
 * @param {Object} user
 * @param {String} storyId
 * @param {String} pageId
 * @param {Object} content
 * @param {Array} files
 * @param {Number} order
 * @returns
 */
const addContentElement = async (user, storyId, pageId, content, files, order) => {
  try {
    if (!user) {
      throw new Unauthorized(translate.__('Author not found'))
    }

    // find story
    let story = await Story.findById(storyId)

    if (!story) {
      throw new UnprocessableEntity(translate.__('Story not found'))
    }

    let collaborator = story.collaborators.find(coll => {
      return coll.author.equals(user._id) && coll.edit
    })
    if (!story.author.equals(user._id) && !collaborator) {
      throw new UnprocessableEntity(translate.__('You don\'t have permission to edit this Story'))
    }

    // get page
    let page = await Page.findActivePage(pageId, 'throw_err_if_not_found')
    // if (!page) {
    //   throw new UnprocessableEntity(translate.__('Page not found'))
    // }
    // check if user is author
    if (!page.author.equals(user._id)) {
      throw new UnprocessableEntity(translate.__('User is not the author'))
    }

    // variable to collect files
    let fileList = getContentFileList(files)

    let newActivityContent = []

    // set uniq content id if doesn't exist
    if (!content.contentId) {
      content.contentId = uuid.v1()
      // set element as updated
      newActivityContent.push(content.contentId)
    }

    // set create/update date
    content.created = content.created || new Date()
    content.updated = new Date()

    // eslint-disable-next-line default-case
    switch (content.type) {
    // gallery
      case 'gallery':
        content = await galleryElementHandler(content, files, page)
        break

      // image
      case 'image':
        content = await imageElementHandler(content, fileList, page, order)
        break

      // audio
      case 'audio':
        content = await audioElementHandler(content, fileList, page, order)
        break

      // video
      case 'video':
        content = await videoElementHandler(content, fileList, page, order)
        break

      // gif
      case 'gif':
        content = await gifElementContentHandler(content, fileList, page, order)
        break

      // recording
      case 'recording':
        content = await recordingContentElementHandler(content, fileList, page, order)
        break

      // text
      case 'text':
        content = await generateTextContentElement(content)
        break
    }

    // set story as updated
    story.updated = new Date()
    await story.save()

    // update page and update
    let newContent = page.content

    if (order) {
      newContent.splice(order, 1, content)
    } else {
      newContent.push(content)
    }

    // update page
    page.updated = new Date()
    page.content = newContent

    await page.save()

    await page.populate('author', authorExtractor.basicProperties).execPopulate()

    // emit event
    eventEmitter.emit('content_update', { story: story, page: page, user: user, content: newActivityContent })

    return page

  } catch (err) {
    throw err
  }
}

/**
 * return all urls that contain @pageId
 *
 * @param {Object} content
 * @param {String} pageId
 * @param {Array} [result=[]]
 * @returns {Array}
 */
const findUrlsInContent = (content, pageId, result = []) => {
  for (let key in content) {
    let prop = content[key]
    // if prop is object
    if (typeof prop === 'object' && !Array.isArray(prop)) {
      // recursion
      findUrlsInContent(prop, pageId, result)
    }
    // if prop is array
    else if (Array.isArray(prop)) {
      prop.forEach(item => {
        // recursion
        findUrlsInContent(item, pageId, result)
      })
    }
    // if prop is string
    else if (typeof prop === 'string') {
      if (prop.includes(pageId) && !prop.startsWith('rtmp://')) {
        result.push(prop)
      }

    }
  }
  return result
}

/**
 * remove single content from page contents
 *
 * @param {Object} user
 * @param {String} contentId
 * @returns {Object}
 */
const removeContentElement = async (user, pageId, contentId) => { //TODO: testovi
  try {
    // find page with unique contentId
    let page = await Page.findActivePage(pageId, 'throw_err_if_not_found')
    // if (!page) {
    //   throw new UnprocessableEntity(translate.__('Page not found'))
    // }

    // if user is not author of that page
    if (String(page.author) !== String(user._id)) {
      throw new UnprocessableEntity(translate.__('User is not the author'))
    }

    let content = page.content.find(item => String(item.contentId) === contentId)
    if (!content) {
      throw new UnprocessableEntity(translate.__('Content not found'))
    }
    // define what bucket to use, depends on content type
    let bucket = content.type === 'video' ? 'istory-videos' : 'istory'

    // find all keys from bucket to delete
    let keys = findUrlsInContent(content, pageId)

    // delete from S3
    for (let key of keys) {
      await removeMediaS3(key, bucket)
    }
    // delete content from page
    let newContent = page.content.filter(item => String(item.contentId) !== contentId)

    // assign new content in page
    page.content = newContent
    await page.save()

    await page.populate('author', authorExtractor.basicProperties).execPopulate()

    return page

  } catch (err) {
    throw err
  }
}

/**
 * Update page content
 *
 * // for image
 * content[0][type] = 'image'
 * content[0][caption] = 'image caption'
 * content[0][image] = @path_to_image_file
 *
 * @param {Object} user
 * @param {String} pageId
 * @param {Object[]} content
 * @param {File[]} files
 * @returns {Promise.<*>}
 */
const updateContents = async (user, pageId, content, files) => {
  try {
    // get page
    let page = await Page.findById(pageId)
    if (!page) {
      throw new UnprocessableEntity(translate.__('Page not found'))
    }
    // check if user is author
    if ( String(page.author) != String(user._id) ) {
      throw new UnprocessableEntity(translate.__('User is not the author'))
    }

    // variable to collect files
    let fileList = getContentFileList(files)

    let feedUpdatedContent = []
    let promiseQueue = []

    // @TODO: Add validation for each media content type (gallery, image, audio, recording, video)
    if (content) {
      // update content
      content.forEach((obj, index) => {
        // set uniq content id if doesn't exist
        if (!obj.contentId) {
          obj.contentId = uuid.v1()
          // set element as updated
          feedUpdatedContent.push(obj.contentId)
        }

        // set create/update date
        obj.created = obj.created || new Date()
        obj.updated = new Date()

        // eslint-disable-next-line default-case
        switch (obj.type) {
          // gallery
          case 'gallery':
            promiseQueue.push( galleryElementHandler(obj, files, page) )
            break

            // image
          case 'image':
            promiseQueue.push( imageElementHandler(obj, fileList, page, index) )
            break

            // audio
          case 'audio':
            promiseQueue.push( audioElementHandler(obj, fileList, page, index) )
            break

          case 'video':
            promiseQueue.push( videoElementHandler(obj, fileList, page, index) )
            break

            // gif
          case 'gif':
            promiseQueue.push( gifElementContentHandler(obj, fileList, page, index) )
            break

            // recording
          case 'recording':
            promiseQueue.push( recordingContentElementHandler(obj, fileList, page, index) )
            break

            // text
          case 'text':
            promiseQueue.push( generateTextContentElement(obj) )
            break
        }

      })
    }

    // find journal
    let story = await Story.findOne({ pages: {$in: [page.id]} })

    if (!story) {
      throw new UnprocessableEntity('Story not found')
    }

    let contents = await Promise.all(promiseQueue)

    if (contents.length > 0) {
      // try to find deleted content elements
      let currentPageContent = page.content

      let deletedContent = currentPageContent.filter(content => {
        let existing = contents.find(c => c.contentId == content.contentId)
        if (!existing) {
          return content
        }
      })

      if (deletedContent.length > 0) {
        let deleteContentPromise = []
        // prepare to remove content elements
        deletedContent.forEach(content => {
          // find all keys from bucket to delete
          let pageId = String(page._id)
          let keys = findUrlsInContent(content, pageId)
          // delete from Amazon S3 server
          for (let key in keys) {
            let bucket = content.type === 'video' ? 'istory-videos' : 'istory'
            deleteContentPromise.push( removeMediaS3(key, bucket) )
          }
        })
        // remove files for content
        if (deleteContentPromise.length > 0) {
          await Promise.all(deleteContentPromise)
        }
      }

      // trigger event
      eventEmitter.emit('content_update', { story: story, page: page, user: user, content: feedUpdatedContent })

      const newContent = contents.filter(content => {
        return page.content.find(c => c.contentId !== content.contentId)
      })

      if (_.difference(page.content, contents)) {
        eventEmitter.emit('story_update', {
          user: user,
          story: story,
          newContent
        })
      }

      page.content = contents
      await page.save()

      // update story
      story.updated = new Date()
      await story.save()
    }

    return page

  } catch (err) {
    throw err
  }
}

/**
 * Generate content element with default values
 *
 * @param {Object} obj
 * @returns {{type: string, url: string, contentId: *, created: *, updated: *, matchId: null, date: null, sections: Array, caption: null, place: {lat: null, lon: null, name: null, addr: null}}}
 */
const generateGalleryContentElement = (obj) => {
  let now = new Date()

  return {
    type: 'gallery',
    url: obj ? obj.url : '',
    contentId: obj.contentId,
    created: (obj && obj.created) ? obj.created : now,
    updated: (obj && obj.created) ? obj.created : now,
    matchId: (obj && obj.matchId) ? obj.matchId : null,
    date: (obj && obj.date) ? obj.date : null,
    sections: (obj && obj.sections) ? obj.sections : [],
    caption: (obj && obj.caption) ? obj.caption : null,
    place: {
      lat: (obj && obj.place) ? obj.place.lat : null,
      lon: (obj && obj.place) ? obj.place.lon : null,
      name: (obj && obj.place) ? obj.place.name : null,
      addr: (obj && obj.place) ? obj.place.addr : null,
    }
  }
}

/**
 * Generate image content element
 *
 * @param {Object} obj
 * @returns {{type: string, contentId: *, url: *, image: null, thumb: null, thumb2: null, created: *, updated: *, place: {lat: null, lon: null, name: null, addr: null}, matchId: null, date: null, caption: null}}
 */
const generateImageContentElement = (obj) => {
  let now = new Date()

  return {
    type: 'image',
    contentId: obj.contentId,
    image: (obj && obj.url) ? obj.url : null,
    created: (obj && obj.created) ? obj.created : now,
    updated: (obj && obj.created) ? obj.created : now,
    place: {
      lat: (obj && obj.place) ? obj.place.lat : null,
      lon: (obj && obj.place) ? obj.place.lon : null,
      name: (obj && obj.place) ? obj.place.name : null,
      addr: (obj && obj.place) ? obj.place.addr : null
    },
    matchId: (obj && obj.matchId) ? obj.matchId : null,
    date: (obj && obj.date) ? obj.date : null,
    caption: (obj && obj.caption) ? obj.caption : null
  }
}

/**
 * Generate audio content element
 *
 * @param {Object} obj
 * @returns {{type: string, url: string, contentId: *, caption: null, title: null, created: *, updated: *, matchId: null, date: null, place: {lat: null, lon: null, name: null, addr: null}, image: null, duration: null}}
 */
const generateAudioContentElement = (obj) => {
  let now = new Date()

  return {
    type: 'audio',
    url: obj ? obj.url : '',
    contentId: obj.contentId,
    caption: (obj && obj.caption) ? obj.caption : null,
    title: (obj && obj.title) ? obj.title : null,
    created: (obj && obj.created) ? obj.created : now,
    updated: (obj && obj.created) ? obj.created : now,
    matchId: (obj && obj.matchId) ? obj.matchId : null,
    date: (obj && obj.date) ? obj.date : null,
    place: {
      lat: (obj && obj.place) ? obj.place.lat : null,
      lon: (obj && obj.place) ? obj.place.lon : null,
      name: (obj && obj.place) ? obj.place.name : null,
      addr: (obj && obj.place) ? obj.place.addr : null
    },
    image: obj ? obj.image : null,
    duration: (obj && obj.duration) ? obj.duration : null
  }
}

/**
 *
 * @param obj
 * @returns {{type: string, url: null, image: null, rtmp: null, contentId: *, caption: null, created: *, updated: *, matchId: null, date: null, place: {lat: null, lon: null, name: null, addr: null}, videoId: null, video: null}}
 */
const generateVideoContentElement = (obj) => {
  let now = new Date()

  return {
    type: 'video',
    url: obj ? obj.url : null,
    image: obj ? obj.image : null,
    rtmp: (obj && obj.rtmp) ? obj.rtmp : null,
    contentId: obj.contentId,
    caption: (obj && obj.caption) ? obj.caption : null,
    created: (obj && obj.created) ? obj.created : now,
    updated: (obj && obj.created) ? obj.created : now,
    matchId: (obj && obj.matchId) ? obj.matchId : null,
    date: (obj && obj.date) ? obj.date : null,
    place: {
      lat: (obj && obj.place) ? obj.place.lat : null,
      lon: (obj && obj.place) ? obj.place.lon : null,
      name: (obj && obj.place) ? obj.place.name : null,
      addr: (obj && obj.place) ? obj.place.addr : null
    },
    videoId: obj ? obj.videoId : null,
    video: obj ? obj.video : null
  }
}

/**
 * Generate GIF content element
 *
 * @param {Object} obj
 * @returns {{type: string, url: string, contentId: *, caption: null, created: *, updated: *, matchId: null, image: null, date: null, place: {lat: null, lon: null, name: null, addr: null}}}
 */
const generateGifContentElement = function (obj) {
  let now = new Date()

  return {
    type: 'gif',
    url: obj ? obj.url : '',
    contentId: obj.contentId,
    caption: (obj && obj.caption) ? obj.caption : null,
    created: (obj && obj.created) ? obj.created : now,
    updated: (obj && obj.created) ? obj.created : now,
    matchId: (obj && obj.matchId) ? obj.matchId : null,
    image: (obj && obj.image) ? obj.image : null,
    date: (obj && obj.date) ? obj.date : null,
    place: {
      lat: (obj && obj.place) ? obj.place.lat : null,
      lon: (obj && obj.place) ? obj.place.lon : null,
      name: (obj && obj.place) ? obj.place.name : null,
      addr: (obj && obj.place) ? obj.place.addr : null
    }
  }
}

/**
 * Generate recording content element
 *
 * @param {Object} obj
 * @returns {{url: null, created: *, updated: *, contentId: null, matchId: null, caption: null, type: string, place: {lat: null, lon: null, name: null, addr: null}, duration: number}}
 */
const generateRecordingContentElement = (obj) => {
  let now = new Date()

  return {
    url: (obj && obj.url) ? obj.url : null,
    created: (obj && obj.created) ? obj.created : now,
    updated: (obj && obj.created) ? obj.created : now,
    contentId: (obj && obj.contentId) ? obj.contentId : null,
    matchId: (obj && obj.matchId) ? obj.matchId : null,
    caption: (obj && obj.caption) ? obj.caption : null,
    type: 'recording',
    place: {
      lat: (obj && obj.place) ? obj.place.lat : null,
      lon: (obj && obj.place) ? obj.place.lon : null,
      name: (obj && obj.place) ? obj.place.name : null,
      addr: (obj && obj.place) ? obj.place.addr : null
    },
    duration: (obj && obj.duration) ? obj.duration : 0
  }
}

/**
 * Generate text content element
 *
 * @param {Object} obj
 * @returns {{updated: Date, created: *, text: string, type: string, style: string, contentId: null, matchId: null}}
 */
const generateTextContentElement = (obj) => {
  let now = new Date()

  return {
    updated: (obj && obj.updated) ? obj.updated : now,
    created: (obj && obj.created) ? obj.created : now,
    text: (obj && obj.text) ? obj.text : '',
    type: 'text',
    style: 'normal',
    contentId: (obj && obj.contentId) ? obj.contentId : null,
    matchId: (obj && obj.matchId) ? obj.matchId : null
  }
}

/**
 * Handle with gallery content element
 *
 * @param {Object} obj
 * @param {File[]} files
 * @param {Number} pageId
 * @returns {Promise.<{type: string, url: string, contentId: *, created: *, updated: *, matchId: null, date: null, sections: Array, caption: null, place: {lat: null, lon: null, name: null, addr: null}}>}
 */
const galleryElementHandler = async (obj, files, page) => {
  try {
    let galleryContentElement = generateGalleryContentElement(obj)
    let pageId = page._id
    let promiseQueue = []

    if (files && files.content && files.content.length > 0) {
      files.content.forEach((file, index) => {
        if (file.gallery) {
          const galleryFile = file.gallery
          galleryFile.sections.forEach((row, sectionIndex) => {
            let imagesArray = []

            row.images.forEach( (image, imageIndex) => {
              if (image) {
                let imageFile = Object.keys(image).map(key => image[key])

                if (imageFile.length > 0) {
                  let fieldName = imageFile[0].fieldName
                  let matchFileName = 'contents[' + index + '][sections][' + sectionIndex + '][images][' + imageIndex + '][image]'
                  if (fieldName == matchFileName) {
                    let mediaFile = imageFile[0]
                    let type = mediaFile.type.split('/')
                    let extension = type[1]
                    let key = 'images/' + pageId + '/' + uuid.v1() + '.' + extension
                    // let imageResults = await uploadMediaS3(mediaFile, key)
                    promiseQueue.push( uploadMediaS3(mediaFile, key))
                    imagesArray.push({
                      image: key,
                      id: uuid.v1(),
                      size: mediaFile ? mediaFile.size : 0
                    })
                  }

                }
              }
            })

            if (galleryContentElement.sections && imagesArray.length > 0) {
              if (galleryContentElement.sections.length == 0) {
                galleryContentElement.sections.push({
                  id: uuid.v1(),
                  images: imagesArray
                })
              } else {
                galleryContentElement.sections[sectionIndex].id = uuid.v1()
                galleryContentElement.sections[sectionIndex].images = imagesArray
              }
            }
          })
        }
      })
    }

    await Promise.all(promiseQueue)

    // try to find content
    let objContent = page.content.find(c => {
      return c.contentId === obj.contentId
    })
    if (objContent) {
      objContent.caption = obj.caption
    }

    // let results = await Promise.all(promiseQueue)
    return objContent || galleryContentElement

  } catch (err) {
    throw err
  }
}

/**
 * Handle with image content element
 *
 * @param {Object} obj
 * @param {File[]} fileList
 * @param {Object} page
 * @returns {Promise.<{type: string, contentId: *, url: *, image: null, thumb: null, thumb2: null, created: *, updated: *, place: {lat: null, lon: null, name: null, addr: null}, matchId: null, date: null, caption: null}>}
 */
const imageElementHandler = async (obj, fileList, page, index) => {
  try {
    let imageContentElement = generateImageContentElement(obj)

    let contentFile = fileList.find(el => {
      return parseInt(el.content) == parseInt(index)
    })

    const pageId = page._id

    if (contentFile) {
      let file = contentFile.file
      // let type = file.type.split('/')
      let filePath
      // var extension = type[1];
      if (typeof file !== 'string') {
        filePath = file.name
      } else {
        filePath = file
      }
      let extension = path.extname(filePath)

      const key = 'images/' + pageId + '/' + uuid.v1() + extension

      obj.url = key

      await uploadMediaS3(file, key)

      imageContentElement.size = file.size ? file.size : 0
      imageContentElement.image = key

      return imageContentElement

    } else {
      let pageContent = page.content.find(row => {
        return row.contentId == obj.contentId
      })
      imageContentElement.url = (pageContent) ? pageContent.url : null

      return imageContentElement
    }
  } catch (err) {
    throw err
  }
}

/**
 * Handler for audio element
 *
 * @param {Object} obj
 * @param {File[]} fileList
 * @param {Object} page
 * @param {Number} index
 * @returns {Promise.<*>}
 */
const audioElementHandler = async (obj, fileList, page, index) => {
  try {
    let audioContentElement = generateAudioContentElement(obj)
    let pageId = page._id

    let contentFile = fileList.find( el => {
      return parseInt(el.content) === parseInt(index)
    })

    if (contentFile) {
      var file = contentFile.file.audio
      var partname = file.type.split('/')
      var extension = partname[1]
      var key = 'audios/' + pageId + '/' + uuid.v1() + '.' + extension
      obj.url = audioContentElement.url = key
      delete obj.mimeType

      // upload audio file
      await uploadMediaS3(file, key)

      // get data from audio file
      let probeData = await probe(file.path)

      if (probeData) {
        audioContentElement.duration = probeData.format.duration
      }
      // upload image
      let imageFile = contentFile.file.image
      if (imageFile) {
        // get image extension
        let partname = imageFile.type.split('/')
        let extension = partname[1]
        let imageKey = 'audios/' + pageId + '/' + uuid.v1() + '.' + extension

        await uploadMediaS3(imageFile, imageKey)

        audioContentElement.image = imageKey
      }

      audioContentElement.size = file.size || 0

      return audioContentElement

    } else {
      let pageContent = page.content.find( row => {
        return row.contentId == obj.contentId
      })
      if ( pageContent ) {
        obj.url = audioContentElement.url = (pageContent) ? pageContent.url : null

        audioContentElement.caption = pageContent.title
        audioContentElement.image = pageContent.image
        audioContentElement.duration = pageContent.duration
        audioContentElement.size = pageContent.size
      }

      return audioContentElement
    }
  } catch (err) {
    throw err
  }
}

/**
 * Handler for video element
 *
 * @param {Object} obj
 * @param {File[]} fileList
 * @param {Object} page
 * @param {Number} index
 * @returns {Promise.<*>}
 */
const videoElementHandler = async (obj, fileList, page, index) => {
  try {
    let videoContentElement = generateVideoContentElement(obj)
    let contentFile = fileList.find( el => {
      return parseInt(el.content) == parseInt(index)
    })
    let pageId = page._id

    if (contentFile) {
      // upload video file
      let videoContent = await uploadVideo(contentFile.file.video, pageId)

      videoContentElement = Object.assign(videoContentElement, videoContent)

      delete obj.mimeType

      return videoContentElement

    } else {

      if (!obj.url) {
        let pageContent = page.content.find( row => {
          return row.contentId == obj.contentId
        })
        if (pageContent) {
          videoContentElement = [...pageContent]
        }
      }

      return videoContentElement

    }

  } catch (err) {
    throw err
  }
}

/**
 * Upload video file
 *
 * @param {File} file
 * @param {String} pageId
 * @returns {*}
 */
const uploadVideo = async (file, pageId) => {
  try {
    let partname = file.name.split('.')
    let extension = partname[partname.length - 1]
    let key = pageId + '/' + uuid.v1() + '.' + extension

    const gm = require('gm')
    const imageMagick = gm.subClass({ imageMagick: true })

    await uploadMediaS3(file, key, config.aws.s3.videoBucket)

    // get image from file
    let process = new ffmpeg(file.path)
    let video = await process
    let imageFilename = uuid.v1()
    let imageFile = '/tmp/' + imageFilename + '.jpg'

    // Callback mode
    let videoResults = await new Promise((resolve, reject) => {
      video.fnExtractFrameToJPG('/tmp', {
        startTime: 0,
        durationTime: 1,
        frameRate: 1,
        // number : 1,
        fileName: imageFile
      }, async (error) => {
        if (error) {
          reject(error)
        }
        const fs = require('fs')
        const readStream = await fs.createReadStream('/tmp/' + imageFilename + '_1.jpg')

        // This will wait until we know the readable stream is actually valid before piping
        readStream.on('open', async () => {
          // This just pipes the read stream to the response object (which goes to the client)
          var imageFilenameS3 = 'images/' + pageId + '/' + imageFilename + '.jpg'
          await uploadMediaS3(readStream, imageFilenameS3)

          var videoResults = {
            url: key,
            image: imageFilenameS3,
            size: file.size,
            duration: video.metadata.duration
          }
          await imageMagick(readStream)
            .identify( (err, features) => {

              if (err) {
                return Promise.reject(err)
              }
              if (features && features.size) {
                videoResults.width = features.size.width
                videoResults.height = features.size.height
              }

              resolve(videoResults)
            })
        })
      })
    })

    return videoResults

  } catch (err) {
    throw err
  }
}

/**
 * Handler for git content element
 *
 * @param {object} obj
 * @param {array} fileList
 * @param {object} page
 * @param {number} index
 * @returns {Promise.<*>}
 */
const gifElementContentHandler = async (obj, fileList, page, index) => {
  try {
    let gifContentElement = generateGifContentElement(obj)
    let pageId = page._id

    let contentFile = fileList.find(el => {
      return parseInt(el.content) == parseInt(index)
    })
    if (contentFile) {
      // upload video file
      let gifContent = await uploadVideo(contentFile.file.video, pageId)

      gifContentElement = Object.assign(gifContentElement, gifContent)

      delete obj.mimeType

      return gifContentElement

    } else {
      var pageContent = page.content.find(row => {
        return row.contentId == obj.contentId
      })
      if (pageContent) {
        gifContentElement = [...pageContent]
      }

      return gifContentElement
    }
  } catch (err) {
    throw err
  }
}

/**
 * Handle recording content element
 *
 * @param {Object} obj
 * @param {File[]} fileList
 * @param {Object} page
 * @param {Number} index
 * @returns {Promise.<*>}
 */
const recordingContentElementHandler = async (obj, fileList, page, index) => {
  try {
    let recordingContentElement = generateRecordingContentElement(obj)
    let contentFile = fileList.find( el => {
      return parseInt(el.content) == parseInt(index)
    })
    let pageId = page._id

    if (contentFile) {

      let file = contentFile.file.audio
      // var partname = imageFile.type.split('/');
      let extension = file.type
      let key = 'audios/' + pageId + '/' + uuid.v1() + '.' + extension
      recordingContentElement.url = key
      delete obj.mimeType

      // upload audio file
      await uploadMediaS3(file, key)

      // get data from audio file
      let probeData = await probe(file.path)
      if (probeData) {
        recordingContentElement.duration = probeData.format.duration
        recordingContentElement.size = file.size
      }
      // upload image
      let imageFile = contentFile.file.image
      if (imageFile) {
        // get image extension
        let partname = imageFile.type.split('/')
        let extension = partname[1]
        let imageKey = 'audios/' + pageId + '/' + uuid.v1() + '.' + extension

        await uploadMediaS3(imageFile, imageKey)

        recordingContentElement.image = imageKey
      }

    } else {

      let pageContent = page.content.find(row => {
        return row.contentId == obj.contentId
      })
      recordingContentElement.url = pageContent ? pageContent.url : null
      recordingContentElement.title = pageContent ? pageContent.title : null
      recordingContentElement.place = pageContent ? pageContent.place : null
      recordingContentElement.date = pageContent ? pageContent.date : null
      recordingContentElement.duration = pageContent ? pageContent.duration : null

    }

    return recordingContentElement

  } catch (err) {
    throw err
  }
}

/**
 * Checks if user is author or co-author (collaborator: true) of a given story
 *
 * @param {*} user
 * @param {*} story
 * @returns
 */
const isUserAuthorOrCoAuthor = (userId, story) => {

  if (story.author.toString() === userId.toString()) return 'author'

  let result = story.collaborators.filter(collaborator => collaborator.edit === true && collaborator.author.toString() === userId.toString())

  return result.length > 0 ? 'collaborator' : null
}

/**
 * Copy or move page to new story
 *
 * @param {String} pageId
 * @param {String} storyId
 * @param {Object} user
 * @returns {Promise.<*>}
 */
const copy = async (pageId, storyId, userId, deletePage) => {
  try {
    let page = await Page.findActivePage(pageId, 'throw_err_if_not_found')

    // user is not the author of the page
    if (!page.author.equals(userId)) {
      throw new UnprocessableEntity(translate.__('You can\'t copy this page'))
    }

    // find story
    let story = await Story.findOneActiveById(storyId, 'throw_err_if_not_found')

    // find previous story
    let prevStory = await Story.findOne({
      pages: pageId,
      active: true,
      deleted: false
    })
    // if user is not author or co-author of the story
    if (!isUserAuthorOrCoAuthor(userId, story) || !isUserAuthorOrCoAuthor(userId, prevStory)) {
      throw new UnprocessableEntity(translate.__('User is not author or collaborator on the story')) //TODO: text
    }

    // if only one page in story and want to move
    if (prevStory.pages.length === 1 && deletePage) {
      throw new UnprocessableEntity(translate.__('You cannot move page when only one is in story')) //TODO: text
    }


    let pageTitle = (page.title || 'page') + ' Copy'
    let pageSlug = await generateSlug(pageTitle, page._id)

    let pageCopy = {
      author: userId,
      active: true,
      deleted: false,
      status: story.status,
      created: new Date(),
      updated: new Date(),
      title: pageTitle,
      desc: '',
      content: page.content,
      cat: [],
      slug: pageSlug,
      tags: [],
      theme: page.theme,
      font: page.font,
      rating: page.rating,
      dateFrom: page.dateFrom,
      dateTo: page.dateTo,
      place: page.place,
      settings: page.settings,
      share: page.share,
      original: page.id
    }

    pageCopy.content.forEach( item => {
      item.contentId = uuid.v1()
    })

    // save copied page
    const newPage = await Page.create(pageCopy)

    // add new page to story
    await Story.updateOne({_id: story._id}, {$push: {pages: newPage._id}})

    // remove page if removePage arg is true
    if (deletePage) {
      await removePage(pageId, prevStory) //TODO: revision
    }

    await newPage.populate('author', authorExtractor.basicProperties).execPopulate()

    return newPage

  } catch (err) {
    throw err
  }
}


/**
 * Remove page from story
 *
 * @param {String} storyId
 * @param {String} pageId
 * @returns {Object} story
 */
const removePage = async (pageId, storyId) => { //TODO: revision
  try {
    let query = {
      _id: storyId,
      active: true, //TODO: da li da gledam active: true, ili i neaktivne?
      deleted: false
    }
    let story = await Story.findOne(query)
    if (story) {
      // Remove requested page from story
      let newPages = story.pages.filter(page => page.toString() !== pageId.toString())

      // assign new pages to story
      story.pages = newPages
      await story.save()

      return story
    }
    return
  } catch (err) {
    throw err
  }
}

/**
 * Copy pages from Story
 *
 * @param {object} user
 * @param {object} story
 * @returns {Promise.<*>}
 */
const copyPagesFromStory = async (user, story) => {
  try {
    // get pages from story for user
    let userPages = await getUserPages(user._id, story.pages)
    let promiseArray = []

    if (userPages.length > 0) {
      // create copy story
      // let storyCopy = await storyHndl.create(user, story.title + ' - collaboration pages', 'private', [], [], [], null, null)
      let storyCopy = await Story.create({
        title: story.title + translate.__(' - your pages'),
        status: 'private',
        pages: [],
        collaborators: [],
        place: null,
        created: new Date,
        updated: new Date,
        views: 0,
        theme: {
          cover: null,
        },
        deleted: false,
        active: true,
        banInPublic: false,
        spam: 0,
        featured: false,
        author: user._id,
        share: {
          followers: false,
          link: false,
          search: false
        }
      })

      userPages.forEach(page => {
        promiseArray.push( copy(page._id, storyCopy._id, user._id) )
      })

      let newPages = await Promise.all(promiseArray)
      let newPageIds = newPages.map(page => page['_id'])

      // save to story
      storyCopy = await Story.findByIdAndUpdate(storyCopy._id, {$push: {pages: newPageIds}})

      // emit event //TODO:!!!
      return storyCopy
    }

    return null

  } catch (err) {
    throw err
  }
}

/**
 * Get pages from user
 *
 * @param {string} userId
 * @param {string[]} pageIds
 * @returns {Promise.<*>}
 */
const getUserPages = async (userId, pageIds) => {
  try {
    let userPages = await Page.find({_id: {$in: pageIds}, author: userId, deleted: false, active: true})

    return userPages
  } catch (err) {
    throw err
  }
}

/**
 * Create a new page
 *
 * @param author
 * @param storyId
 * @param title
 * @param cover
 * @param dateFrom
 * @param dateTo
 * @param place
 * @param content
 * @param matchId
 * @param order
 * @param files
 * @returns {Promise<*>}
 */
const newPage = async (author, storyId, title, cover, dateFrom, dateTo, place, content, matchId, order, files) => {
  try {

    // find the Story
    let story = await Story.findById(storyId)

    if (!story) {
      throw new UnprocessableEntity( translate.__('Story not found') )
    }

    // check author's permission for Story
    let collaborator = story.collaborators.find(coll => {
      return coll.author == author._id && coll.edit == true
    })
    if(!story.author.equals(author._id) && !collaborator) {
      throw new Unauthorized(translate.__('You don\'t have permission for this Story'))
    }

    let newPage = await create(author._id, title, dateFrom, dateTo, place, cover, [], matchId, story.status)

    // add page to story
    await Story.updateOne({_id: story._id}, { $push: {pages: newPage._id }})

    if(content) {
      newPage = await updateContents(author, newPage._id, content, files)
    }

    await newPage.populate('author', authorExtractor.basicProperties).execPopulate()

    return newPage

  } catch (err) {
    throw err
  }
}

/**
 * Generate slug for page by title and page ID
 * @param {string} title
 * @param {string} pageId
 * @return {Promise.<*>}
 */
const generateSlug = async (title, pageId) => {
  try {
    if (!title || title == '') {
      title = 'page'
    }
    // check does stories with the same title exist
    let query = { title: title }
    if (pageId) {
      query = Object.assign(query, {
        _id: {
          $ne: pageId
        }
      })
    }

    // generate slug from title
    let newSlug = slug(title.replace(/'/g, '').replace(/[^a-zA-Z0-9\s]+/g, ' ')).toLowerCase()

    let pages = await Page.find(query)

    if (pages) {
      let existing = pages.length

      // if exist, add increase number by one and add to slug:
      // i.e. page-title-2
      if (existing > 0) {
        let newNumber = existing + 1
        newSlug += '-' + newNumber
      }
    }

    return newSlug
  } catch (err) {
    throw err
  }
}

/**
 * Get content file list
 *
 * @param {Array} files
 * @returns {Array}
 */
const getContentFileList = (files = []) => {
  let fileList = []

  if (files && files.content && files.content.length > 0) {
    const contentFiles = Object.keys(files.content).map(key => files.content[key])
    // find files
    contentFiles.forEach(file => {
      if (!file.sections) {
        let fileIndex
        let targetFile
        if (file.image && file.audio) {
          fileIndex = file.audio.fieldName.match(/\d+/)[0]
          targetFile = {
            audio: file.audio,
            image: file.image
          }
        } else if (file.image && file.video) {
          fileIndex = file.video.fieldName.match(/\d+/)[0]
          targetFile = {
            video: file.video,
            image: file.image
          }
        } else if (file.image) {
          fileIndex = file.image.fieldName.match(/\d+/)[0]
          targetFile = file.image
        } else if (file.video) {
          fileIndex = file.video.fieldName.match(/\d+/)[0]
          targetFile = {
            video: file.video,
            image: null
          }
        } else if (file.audio) {
          fileIndex = file.audio.fieldName.match(/\d+/)[0]
          //let targetFile = file.audio;
          targetFile = {
            audio: file.audio,
            image: null
          }
        }
        fileList.push({
          content: fileIndex,
          file: targetFile
        })
      }
    })
  }
  return fileList
}

/**
 * Delete page (soft delete)
 *
 * @param {String} pageId
 * @param {String} storyId
 * @param {Object} user
 * @returns {Object} Deleted page
 */
const deletePage = async (authorId, storyId, pageId, removeFromStory) => {
  try {
    //find page
    let page = await Page.findActivePage(pageId, 'throw_err_if_not_found')

    if (String(page.author) !== authorId.toString()) {
      throw new UnprocessableEntity( translate.__('You don\'t have permission for this action') )
    }

    await Story.findOneActiveById(storyId, 'throw_err_if_not_found')

    // remove page from story
    if (removeFromStory) await removePage(pageId, storyId)

    // soft delete all comments on page
    await Comments.deleteAllPageComments(pageId)

    // set page properties
    page.active = false
    page.deleted = true
    page.deletedAt = new Date()
    // save page
    await page.save()

    // activity event emitter ? TODO: ?
    return page.id

  } catch (err) {
    throw err
  }
}

module.exports = {
  create,
  update,
  isUserAuthorOrCoAuthor,
  copy,
  removePage,
  addContentElement,
  findUrlsInContent,
  removeContentElement,
  updateContents,
  copyPagesFromStory,
  getUserPages,
  generateSlug,
  newPage,
  deletePage
}

