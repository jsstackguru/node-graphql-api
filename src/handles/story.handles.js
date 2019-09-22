/**
 * @file Controller for stories collection
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import slug from 'slug'
import uuid from 'node-uuid'
import mkdirp from 'mkdirp'
import path from 'path'
import fs from 'fs'
import config from '../config'
import zipAFolder from 'zip-a-folder'

// Models
import Story from '../models/story/story.model'
import { Author, authorExtractor } from '../models/author'
import Page from '../models/page/page.model'
import { Favorite } from '../models/favorite'
import { Following } from '../models/following'

// Libraries
import { UnprocessableEntity, BadRequest, Unauthorized } from '../lib/errors'
import translate from '../lib/translate'

// Services
import { eventEmitter } from '../services/events'
import { uploadMediaS3 } from '../services/media/upload'

// Handles
import collaborationHndl from './collaboration.handles'
import pageHndl from './page.handles'
import { readMediaS3 } from '../services/media/read'

// Extractors
import { pageExtractor } from '../models/page'

/**
 * Collect stories for my story
 *
 * @param {String} userId Author's id
 * @param {Array} filters Filters for stories
 * @param {String} status Story status for filter
 * @param {String} search Term for search stories and pages
 */
const myStories = async (userId, filters = ['my', 'collaboration', 'shared'], status, search) => {
  try {
    let myStories = []

    // get my stories
    if (!filters.includes('my')) {
      return null
    }

    if (!filters || filters.length == 0 || filters.includes('my')) {
      let stories = await getMyStories(userId, status, search)
      if (stories) {
        myStories = myStories.concat(stories)
      }
    }

    // get my collaboration stories
    if (filters.includes('collaboration')) {
      let collaborationStories = await getCollaborationStories(userId, status, search)
      if (collaborationStories) {
        myStories = myStories.concat(collaborationStories)
      }
    }

    // get shared collaboration stories
    if (filters.includes('shared')) {
      let sharedStories = await getSharedStories(userId, status, search)
      if (sharedStories) {
        myStories = myStories.concat(sharedStories)
      }
    }

    return myStories

  } catch (err) {
    throw err
  }
}

/**
 * Get stories by author (not collaboration, only his stories)
 *
 * @param {String} userId Author's ID
 * @param {String} status Story's privacy status
 * @param {String} search Term for searching
 */
const getMyStories = async (userId, status, search) => {
  try {
    let searchQueries = queryForStorySearch({
      author: userId,
      deleted: false,
      active: true,
      collaborators: []
    }, search)
    let query = searchQueries.query
    let pageMatch = searchQueries.pageMatch

    // check does email is already taken
    let stories = await Story.getList(query, pageMatch)

    return stories
  } catch (err) {
    throw err
  }
}

// exports.getMyStories = getMyStories

/**
 * Get stories for collaboration (author is collaborator with edit permission)
 *
 * @param {String} userId Author's ID
 * @param {String} status Story's privacy status
 * @param {String} search Term for story searcing
 */
const getCollaborationStories = async (userId, status, search) => {
  try {
    let searchQueries = queryForStorySearch({
      author: userId,
      deleted: false,
      active: true,
      collaborators: {$ne: []}
    }, search)
    let query = searchQueries.query
    let pageMatch = searchQueries.pageMatch

    // check does email is already taken
    let stories = await Story.getList(query, pageMatch)

    return stories

  } catch (err) {
    throw err
  }
}

/**
 * Get stories shared with author (author is collaborator with view permission)
 *
 * @param {String} userId Author's ID
 * @param {String} status Story's privacy status
 * @param {String} search Term for story searching
 */
const getSharedStories = async (userId, status, search) => {
  try {
    let searchQueries = queryForStorySearch({
      deleted: false,
      active: true,
      'collaborators.author': userId
    }, search)
    let query = searchQueries.query
    let pageMatch = searchQueries.pageMatch

    // check does email is already taken
    let stories = await Story.getList(query, pageMatch)

    return stories

  } catch (err) {
    throw err
  }
}

/**
 * Get query for stories
 *
 * @param {Object} query Basic query for search
 * @param {String} search Term for searching story and pages
 * @returns {Object} {query, pageMatch}
 */
const queryForStorySearch = (query, search) => {
  // search by story title and page content
  let pageMatch = {}
  if (search) {
    // search story
    Object.assign(query, {
      title: {$regex: search, $options: 'i'}
    })
    // search page by title and content
    Object.assign(pageMatch, {
      match: {
        $or: [
          { title: {$regex: search, $options: 'i'} },
          { content: {
            $or: [
              {$elemMatch: {text: {$regex: search, $options: 'i'}}},
              {$elemMatch: {caption: {$regex: search, $options: 'i'}}}
            ]
          }
          }
        ]
      }
    })
  }

  return {
    query: query,
    pageMatch: pageMatch
  }
}

// exports.queryForStorySearch = queryForStorySearch

/**
 * Create Story
 *
 * @param {object} user
 * @param {string} title
 * @param {string} privacyType
 * @param {File} cover
 * @param {Array} collaborators
 * @param {Object} page
 * @param {File} pageCover
 * @param {Array} contents
 * @param {Array} files
 * @returns {Promise.<*>}
 */
const create = async (
  user,
  title,
  privacyType,
  cover,
  collaborators,
  page,
  pageCover,
  contents,
  files,
  matchId
) => {

  try {
    if (!title) {
      throw new BadRequest(translate.__('Story title can not be empty'))
    }
    // generate slug
    let newSlug = await generateSlug(title)

    // upload cover
    let key

    if (cover) {
      let file = cover
      let type = file.type.split('/')
      let extension = type[1]
      key = 'images/' + user.id + '/' + uuid.v1() + '.' + extension

      await uploadMediaS3(file, key)
    }

    let cdate = new Date()

    let story = await Story.create({
      author: user.id,
      title: title,
      isDefault: false,
      theme: {
        template: 'default',
        cover: key || null,
      },
      status: privacyType,
      share: {
        followers: false,
        link: false,
        search: false,
      },
      pages: [],
      deleted: false,
      matchId,
      active: true,
      created: cdate,
      updated: cdate,
      slug: newSlug,
      banInPublic: false,
      collaborators: []
    })

    // create blank page
    let blankPage = await pageHndl.create(
      user._id,
      page.title,
      page.dateFrom,
      page.dateTo,
      page.place,
      null,
      page.matchId,
      page.order
    ) // TODO: videti sta sa page.order

    // send invitations to collaborators
    if (collaborators) {
      // send invite by id
      if (collaborators.ids && collaborators.ids.length > 0) {
        await collaborationHndl.inviteCollaborators(collaborators.ids, story.id, user)
      }

      // send invite by email
      if (collaborators.email_addresses && collaborators.email_addresses.length > 0) {
        await collaborationHndl.inviteCollaboratorByEmails(collaborators.email_addresses, story.id, user)
      }
    }

    // create page
    if (blankPage) {
      // add page to the Story
      story = await Story.findOneAndUpdate({_id: story._id}, {$push: {pages: blankPage.id}}, {new: true})

      await pageHndl.update(user._id, blankPage._id, page.title, page.place, pageCover, null, page.dateFrom, page.dateTo, page.matchId, page.order) // TODO: cemu sluzi ovaj red?
    }
    // create page content
    if (blankPage && contents) {
      await pageHndl.updateContents(user, blankPage.id, contents, files)
    }

    // populate fields
    await story.populate('author', authorExtractor.basicProperties).execPopulate()
    await story.populate({
      path: 'pages',
      populate: {
        path: 'author',
        select: authorExtractor.basicProperties
      }
    }).execPopulate()

    return story

  } catch (err) {
    throw err
  }

}

/**
 * create story copy with copied pages
 *
 * @param { String } userId
 * @param { String } title
 * @param { Array } pages
 */
const createStoryCopy = async (userId, story, pages) => {
  try {

    let newTitle = 'Copy of ' + story.title
    // generate slug
    let newSlug = await generateSlug(newTitle)

    let newStory = await Story.create({
      author: userId,
      title: newTitle,
      isDefault: false,
      theme: {
        template: 'default',
        cover: null,
      },
      status: story.status,
      share: {
        followers: false,
        link: false,
        search: false,
      },
      pages: Array.isArray(pages) ? pages : [],
      deleted: false,
      active: true,
      slug: newSlug,
      banInPublic: false,
      collaborators: []
    })

    // populate fields
    await newStory.populate('author', authorExtractor.basicProperties).execPopulate()
    await newStory.populate({
      path: 'pages',
      populate: {
        path: 'author',
        select: authorExtractor.basicProperties
      }
    }).execPopulate()
    
    return newStory

  } catch (err) {
    throw err
  }
}

/**
 * Get Stories by title
 *
 * @param {string} title
 * @returns {Promise.<*>}
 */
const getByTitle = async (title) => {
  try {
    let stories = await Story.find({ title: {$regex: title, $options: 'i'}, deleted: false })

    return stories
  } catch (err) {
    throw err
  }
}

// exports.getByTitle = getByTitle

/**
 * Get all pages from author
 *
 * @param {string} authorId
 * @returns {Promise.<*>}
 */
const getAllAuthorPages = async (authorId) => {
  try {

    let stories = await getAllAuthorStories(authorId)

    // collect page ids
    let pageIds = []
    stories.forEach(story => {
      let authorPageIds = story.pages.filter(async pageId => {
        let page = await Page.findOne({_id: pageId, active: true, deleted: false})
        if (page && page.author == authorId) {
          return page
        }
      })

      pageIds = pageIds.concat(authorPageIds)
    })

    let pages = await Page.find({ _id: {$in: pageIds}, deleted: false, active: true })

    return pages

  } catch (err) {
    throw err
  }
}

/**
 * Get all Stories from author
 *
 * @param {string} authorId
 * @returns {Promise.<*>}
 */
const getAllAuthorStories = async (authorId) => {
  try {
    if (!authorId) {
      throw new BadRequest( translate.__('Author ID missing') )
    }

    let stories = await Story.find({
      deleted: false,
      active: true,
      $or: [
        { author: authorId },
        {
          $and: [
            {'collaborators.author': authorId},
            {'collaborators.edit': true},
          ]
        }
      ]
    })

    return stories

  } catch (err) {
    throw err
  }
}

/**
 * Export all Stories from author
 * @param {string} authorId
 * @param {boolean} preview
 * @returns {Promise.<{totalSize: integer, fileTree: {}}>}
 */
const exportAllStories = async (authorId, preview = true) => {
  try {
    // get all stories
    let stories = await getAllAuthorStories(authorId)
    // get all pages
    let pages = await getAllAuthorPages(authorId)

    let storyUrls = []
    let fileTree = {}

    stories.forEach(story => {
      // find pages
      let storyPages = pages.filter(page => {
        return story.pages.find(p => {
          return p.equals(page._id) && page.author.equals(authorId)
        })
      })

      if (storyPages.length > 0) {

        let coverImage = null
        // find story cover
        if (story.theme.cover) {
          coverImage = story.theme.cover
          storyUrls.push({
            type: 'image',
            url: coverImage
          })
        }

        // get story pages
        let pagesFromStory = []
        storyPages.forEach(page => {
          // get content
          let pageContent = []
          page.content.forEach(content => {
            // eslint-disable-next-line default-case
            switch (content.type) {
              // text
              case 'text':
                pageContent.push({
                  type: 'text',
                  text: content.text
                })
                break
                // image
              case 'image':
                if (content.image.url) {
                  pageContent.push({
                    image: content.image.url,
                    type: 'image',
                    caption: content.caption || null,
                    size: content.size
                  })
                  storyUrls.push({
                    url: content.image.url,
                    type: 'image',
                    size: content.size
                  })
                }
                break
                // gallery
              case 'gallery':
                content.sections.forEach(section => {
                  section.images.forEach(image => {
                    pageContent.push({
                      image: image.image,
                      type: 'image',
                      caption: content.caption || null,
                      size: content.size
                    })
                    storyUrls.push({
                      url: image.image,
                      type: 'image',
                      size: content.size
                    })
                  })
                })
                break
              // audio
              case 'audio':
                pageContent.push({
                  type: 'audio',
                  url: content.url,
                  caption: content.caption || null,
                  size: content.size
                })
                storyUrls.push({
                  url: content.url,
                  type: 'audio',
                  size: content.size
                })
                break
                // memo
              case 'recording':
                pageContent.push({
                  type: 'recording',
                  url: content.url,
                  caption: content.caption || null,
                  size: content.size
                })
                storyUrls.push({
                  type: 'recording',
                  url: content.url,
                  size: content.size
                })
                break
                // gif
              case 'gif':
                pageContent.push({
                  type: 'gif',
                  url: content.url,
                  caption: content.caption || null,
                  size: content.size
                })
                storyUrls.push({
                  type: 'gif',
                  url: content.url,
                  size: content.size
                })
                break
                // video
              case 'video':
                pageContent.push({
                  type: 'video',
                  url: content.url,
                  caption: content.caption || null,
                  size: content.size
                })
                storyUrls.push({
                  type: 'video',
                  url: content.url,
                  size: content.size
                })
                break
            }
          })

          page = Object.assign(page, {
            content: pageContent
          })

          pagesFromStory.push({
            title: 'Page' + (page.title ? ('-' + page.title) : '') + '-' + page.created,
            content: page.content
          })
        })

        fileTree[story.title + '-' + story.created] = {
          cover: coverImage || null,
          pages: pagesFromStory
        }
      }
    })


    // get content size
    let totalSize = 0

    if(preview) {
      let size = getStorageSize(storyUrls)
      if (size) {
        totalSize += parseInt(size)
      }
    }

    return {
      totalSize: preview ? totalSize : null,
      fileTree: fileTree
    }
  } catch (err) {
    throw err
  }
}

/**
 * Get total size for content elements
 * @param {array} contents
 * @returns {number}
 */
const getStorageSize = (contents) => {
  try {
    let totalSize = 0

    contents.forEach(content => {
      totalSize += content.size || 0
    })

    return totalSize
  } catch (err) {
    throw err
  }
}

/**
 * Download author's content from all Stories
 * @param {string} authorId
 * @returns {Promise.<*[]>}
 */
const downloadExportedStories = async (authorId) => {
  try {
    let author = await Author.findOneActiveById(authorId)

    if (!author) {
      throw new UnprocessableEntity(translate.__('THe author not found'))
    }

    let stories = await exportAllStories(authorId, false)

    let fileTree = stories.fileTree
    let bucket = __dirname + '/../../exports/' + authorId
    let bucketUrl = 'http://istory.s3.amazonaws.com/'
    let bucketVideoUrl = 'http://istory-videos.s3.amazonaws.com/'

    let promiseArray = []

    // fileTree.forEach( (tree, index) => {
    for (let index in fileTree ) {
      let tree = fileTree[index]
      let storyName = index
      // story cover
      let cover = tree.cover
      if(cover) {
        let coverKey = cover.replace(bucketUrl, '')
        let extension = path.extname(coverKey)
        let coverName = storyName + ' story cover' + extension
        let newDirectory = bucket + '/' + storyName + '/'
        let newFile = newDirectory + coverName

        // create new directory
        mkdirp.sync(newDirectory)

        promiseArray.push(
          makeContentLocalCopy(coverKey, newFile, 'cover')
        )
      }

      // export pages
      tree.pages.forEach(page => {

        let pageName = page.title
        let newDirectory = bucket + '/' + storyName + '/' + pageName + '/'

        // create new directory
        mkdirp.sync(newDirectory)

        // page content
        let cover = page.cover
        if(cover) {
          let coverKey = cover.replace(bucketUrl, '')
          let extension = path.extname(coverKey)
          let coverName = pageName + ' page cover' + extension
          let newFile = newDirectory + coverName

          // create new directory
          mkdirp.sync(newDirectory)

          promiseArray.push( makeContentLocalCopy(coverKey, newFile, 'cover') )
        }

        // page content
        page.content.forEach(content => {
          let contentName
          let contentKey
          let newFile
          let extension

          // eslint-disable-next-line default-case
          switch(content.type) {
            // text
            case 'text':
              contentName = (pageName ? pageName + ' ' : 'page') + (content.caption ? content.caption : ' text') + '.txt'
              newFile = newDirectory + contentName

              promiseArray.push( () => {
                return new Promise((resolve, reject) => {
                  fs.writeFile(newFile, content.text, 'utf8', function (err) {
                    if (err) {
                      reject(err)
                    } else {
                      resolve(newFile)
                    }
                  })
                })
              })
              break
            // image
            case 'image':
              contentKey = content.image.replace(bucketUrl, '')
              extension = path.extname(contentKey)
              contentName = (pageName ? pageName + ' ' : 'page') + (content.caption ? content.caption : ' image') + extension
              newFile = newDirectory + contentName

              promiseArray.push(
                makeContentLocalCopy(contentKey, newFile, content.type)
              )
              break
            // audio
            case 'audio':
              contentKey = content.url.replace(bucketUrl, '')
              extension = path.extname(contentKey)
              contentName = (pageName ? pageName + ' ' : 'page') + (content.caption ? content.caption : ' audio') + extension
              newFile = newDirectory + contentName

              promiseArray.push(
                makeContentLocalCopy(contentKey, newFile, content.type)
              )
              break
            // gif
            case 'gif':
              contentKey = content.url.replace(bucketVideoUrl, '')
              extension = path.extname(contentKey)
              contentName = (pageName ? pageName + ' ' : 'page') + (content.caption ? content.caption : ' gif') + extension
              newFile = newDirectory + contentName

              promiseArray.push(
                makeContentLocalCopy(contentKey, newFile, content.type)
              )
              break
            // recording
            case 'recording':
              contentKey = content.url.replace(bucketUrl, '')
              extension = path.extname(contentKey)
              contentName = (pageName ? pageName + ' ' : 'page') + (content.caption ? content.caption : ' recording') + extension
              newFile = newDirectory + contentName

              promiseArray.push(
                makeContentLocalCopy(contentKey, newFile, content.type)
              )
              break
            // video
            case 'video':
              contentKey = content.url.replace(bucketVideoUrl, '')
              extension = path.extname(contentKey)
              contentName = (pageName ? pageName + ' ' : 'page') + (content.caption ? content.caption : ' video') + extension
              newFile = newDirectory + contentName

              promiseArray.push(
                makeContentLocalCopy(contentKey, newFile, content.type)
              )
              break

            // gallery
            case 'gallery':
              content.sections.forEach((section, sectionIndex) => {
                if (section.images.length > 0) {
                  section.images.forEach((img, imgIndex) => {
                    contentKey = img.replace(bucketUrl, '')
                    extension = path.extname(contentKey)
                    contentName = (pageName ? pageName + ' ' : 'page') + (content.caption ? content.caption : ` ${'image'}_${sectionIndex}${imgIndex}` ) + extension
                    newFile = newDirectory + contentName
                    promiseArray.push(
                      makeContentLocalCopy(contentKey, newFile, content.type)
                    )
                  })
                }
              })
              break
          }
        })

      })
    }

    // Execute all things you have to done
    await Promise.all(promiseArray)

    let result = await downloadWholeBucket(authorId)

    return result

  } catch (err) {
    throw err
  }
}

/**
 * Make copy of file from Amazon S3 to local server
 * @param {string} filename Link to Amazon S3 file
 * @param {string} newFile Path to local file
 * @returns {Promise.<*>}
 */
const makeContentLocalCopy = async (filename, newFile, contentType) => {
  try {
    switch (contentType) {
      case 'video':
      case 'gif':
        return await readMediaS3(filename, newFile, config.aws.s3.videoBucket)
      default:
        return await readMediaS3(filename, newFile)
    }

  } catch (err) {
    return null
    // throw err
  }
}

/**
 * download whole bucket
 *
 * @param {string} userId
 * @return {Promise.<*>}
 */
const downloadWholeBucket = async (authorId) => {
  try {
    const archiveFile = __dirname + '/../../exports/' + authorId + '_archive.zip'
    
    await zipAFolder.zip(`${__dirname}/../../exports/${authorId}`, archiveFile)

    return archiveFile
  } catch (err) {
    throw err
  }
}

/**
 * update Story by id
 *
 * @param {object} user
 * @param {string} id
 * @param {string} title
 * @param {object} cover
 * @param {string} bodyCover
 * @returns {Promise|*|promise|e}
 */
const update = async (user, id, title, pageIds, cover) => {
  try {
    let story = await Story.findById(id)
      .populate('author', 'id name username avatar')
      .populate('pages', 'id title theme content')
      .populate('collaborators.author', 'id name username avatar')

    if (!story) {
      throw new UnprocessableEntity(translate.__('Story not found'))
    }

    if (!story.author.equals(user.id)) {
      throw new Unauthorized(translate.__('You don\'t have permission to update this Story'))
    }

    if (!title) {
      throw new BadRequest(translate.__('Story title is required'))
    }
    
    let newSlug = await generateSlug(title, story.id)

    if (story) {
      const cdate = new Date()
      let update = {
        updated: cdate,
        slug: newSlug,
        title: title,
        //theme: theme,
        collaborators: story.collaborators ? story.collaborators : [],
      }
      // set pages if exists
      if (pageIds) {
        await Page.updateMany({_id: {$in: story.pages}}, {updated: new Date}, {new: true})
        Object.assign(update, {
          pages: pageIds
        })
      }
      Object.assign(story, update)
    }

    // upload cover
    if (cover) {
      const file = cover
      const type = file.type.split('/')
      const extension = type[1]
      const key = 'images/' + user.id + '/' + uuid.v1() + '.' + extension

      await uploadMediaS3(cover, key)

      const themeUpdate = {
        template: 'default',
        cover: key ? key : '',
      }

      story.theme = themeUpdate
    }

    // save story changes
    await story.save()

    await story.populate('pages', 'id title theme content')
      .execPopulate()

    // trigger event
    eventEmitter.emit('story_update', {
      user: user,
      story: story
    })

    return story

  } catch (err) {
    throw err
  }
}

/**
 * Generate slug for Story
 *
 * @param {string} title
 * @param {string} id
 * @returns //TODO: finish this
 */
const generateSlug = async (title, id = null) => {
  try {
    let query = {
      title: title
    }
    if (id) {
      Object.assign(query, {
        _id: {$ne: id}
      })
    }
    const stories = await Story.find(query)
    const existing = stories.length

    // generate slug from title
    // NOTE: slug is used to access Story in web app
    let newSlug = slug(title.replace(/'/g, '').replace(/[^a-zA-Z0-9\s]+/g, ' ')).toLowerCase()

    // if exist, add increase number by one and add to slug:
    // i.e. story-title-2
    if (existing > 0) {
      let newNumber = existing + 1
      newSlug += '-' + newNumber
    }

    return newSlug
  } catch (err) {
    throw err
  }
}

/**
 * Delete story, and move collaborators pages to new (copy of) Story
 *
 * @param {Object} user
 * @param {String} storyId
 * @returns {Promise.<*>}
 */
const deleteStory = async (authorId, storyId) => {
  try {
    let story = await Story.findOneActiveById(storyId, 'throw_err_if_not_found')
    // if user not author throw error
    if (authorId.toString() !== story.author.toString()) {
      throw new Unauthorized(translate.__('You don\'t have permission for this action')) //TODO: message
    }

    let pages = story.pages
    let completePages = []

    // get full page objects into array
    for (let pageId of pages) {
      let page = await Page.findActivePage(pageId)
      if (page) {
        completePages.push(page)
      }
    }

    // Extract unique collaborators id's
    let uniqueCollaborators = Array.from(
      new Set(
        completePages
          .map(page => page.author.toString())
          .filter(author => author !== authorId)
      )
    )

    // move pages to story copy
    for (let authorId of uniqueCollaborators) {
      // find all pages in story from one collaborator
      const pages = completePages.filter(page => page.author.toString() === authorId.toString())
      // extract pages id's only
      const pagesIds = pages.map(p => p._id)
      const userId = pages[0].author
      // create story copy
      await createStoryCopy(userId, story, pagesIds) // TODO: da li da vracam kopije story-a. event emmiter?
    }

    // change deleted story properties
    story.pages = []
    story.deleted = true
    story.active = false
    story.deletedAt = new Date()
    story.collaborators = []

    await story.save()

    return story

  } catch (err) {
    throw err
  }
}

/**
 * Set share settings fot the story
 * 
 * @param {String} userId User's ID
 * @param {String} id Story's ID
 * @param {String} privacyType Privacy status
 * @param {Object} shareSettings Share settings
 */
const setShareSettings = async (userId, id, privacyType, shareSettings) => {
  try {
    const story = await Story.findOne({_id: id, active: true, deleted: false})
    if (!story) {
      throw new UnprocessableEntity(translate.__('Story not found'))
    }
    if (!story.author.equals(userId)) {
      throw new Unauthorized(translate.__('You are not the author of the Story'))
    }

    const update = {}

    // if settings doesn't exist set all settings
    // on default values for privacy type
    if (!shareSettings) {
      switch (privacyType) {
        case 'public':
          shareSettings = {
            collaborators: true,
            followers: true,
            link: true,
            search: true,
          }
          break
        case 'private':
          shareSettings = {
            collaborators: false,
            followers: false,
            link: false,
            search: false,
          }
          break
      }
    }

    // set story update
    if (privacyType === 'private') {
      // set settings to default values
      shareSettings = {
        collaborators: false,
        followers: false,
        link: false,
        search: false
      }
    }

    Object.assign(update, {
      share: {
        collaborators: shareSettings.collaborators,
        followers: shareSettings.followers,
        link: shareSettings.link,
        search: shareSettings.search,
      }
    })

    // if collaborators option is switched off, remove collaborators
    if (shareSettings.collaborators == false) {
      if (story.collaborators && story.collaborators.length > 0) {
        // remove collaborators
        const collaboratorIds = story.collaborators.map(coll => coll.author)
        let removeCollaboratorPromises = []
        collaboratorIds.forEach(collId => {
          removeCollaboratorPromises.push(
            collaborationHndl.removeFromCollaboration(id, collId, userId)
          )
        })
        if (removeCollaboratorPromises.length > 0) {
          await Promise.all(removeCollaboratorPromises)
        }
        // emit
        eventEmitter.emit('collaboration_share_false', {
          userId,
          story,
          collaboratorIds
        })
      }
      // if collaborators option is switched off, remove invitations
      // @TODO: remove activities and scheduled jobs
    }
        
    // update the story's privacy status
    story.share = update.share
    await story.save()
        
    // set privacy for the pages
    await Page.updateMany({ _id: {$in: story.pages} }, { status: privacyType })
        
    return update.share
  } catch (err) {
    throw err
  }
}

/**
 * Set the Story as a favorite
 * 
 * @param {String} storyId Story ID
 * @param {String} authorId Author ID
 */
const setFavorite = async (storyId, authorId) => {
  try {
    // try to find story
    const story = await Story.findOneActiveById(storyId)
    if (!story) {
      throw new UnprocessableEntity(translate.__('Story not found'))
    }
    // try to find author
    const author = await Author.findOneActiveById(authorId)
    if (!author) {
      throw new UnprocessableEntity(translate.__('Author not found'))
    }
    // check does story is favorite already for the author
    let favorite = await Favorite.findOne({
      author: authorId,
      story: storyId
    })
    if (favorite) {
      throw new UnprocessableEntity(translate.__('This Story is the author\'s favorite already'))
    }

    favorite = await Favorite.create({
      author: authorId,
      story: storyId
    })

    // event emitter
    eventEmitter.emit('favorite_added', { author, story })

    return favorite
  } catch (err) {
    throw err
  }
}

/**
 * Get favorites Stories by author
 * @param {String} authorId Author ID
 */
const getFavoritesByAuthor = async (authorId) => {
  try {
    const favorites = await Favorite.find({
      author: authorId
    })
    const storyIds = favorites.map(favorite => favorite.story)
    const stories = await Story.find({
      _id: { $in: storyIds },
      active: true,
      deleted: false
    })

    return stories.filter(async story => {
      return await canAccessStory(story, authorId)
    })
  } catch (err) {
    throw err
  }
}

/**
 * Can access story
 * @param {Object} story Story
 * @param {Object} authorId Author ID
 */
const canAccessStory = async (story, authorId) => {
  try {
    const collaboratorIds = story.collaborators && story.collaborators.map(coll => coll.author)
    // get followers
    const follower = await Following.findOne({ follows: story.author, author: authorId } )

    // Story is private, only author can access to them
    if ( story.status == 'private' && (!story.author.equals(authorId)) ) {
      return false
    }

    // check does search is enabled
    if (!story.share && story.share.search) {
      if ( authorId ) {
        // check if user is author
        if (!story.author.equals(authorId)) {
          // check for collaboration
          const collaborator = collaboratorIds.find(id => id.equals(authorId))
          if ( !collaborator ) {
            // check for followers
            if ( (story.share.followers && !follower) && !story.share.link ) {
              return false
            }
          }

        }
      } else if ( !story.share.link ) {
        return false
      }
    }
    return true
  } catch (err) {
    console.log(err.stack)
    throw err
  }
}

/**
 * Unfavorite story
 * @param {String} id 
 * @param {String} authorId 
 */
const unsetFavorite = async (id, authorId) => {
  try {
    const story = await Story.findOneActiveById(id)

    if (!story) {
      throw new UnprocessableEntity(translate.__('Story not found'))
    }

    if (!await canAccessStory(story, authorId)) {
      throw new UnprocessableEntity(translate.__('You don\'t have a permission to this Story'))
    }

    const values = {
      story: id,
      author: authorId
    }
    await Favorite.findOneAndDelete(values)

    return values
  } catch (err) {
    throw err
  }
}

export default {
  canAccessStory,
  create,
  createStoryCopy,
  deleteStory,
  downloadExportedStories,
  downloadWholeBucket,
  exportAllStories,
  generateSlug,
  getAllAuthorPages,
  getAllAuthorStories,
  getByTitle,
  getCollaborationStories,
  getFavoritesByAuthor,
  getMyStories,
  getSharedStories,
  getStorageSize,
  makeContentLocalCopy,
  myStories,
  setShareSettings,
  setFavorite,
  update,
  unsetFavorite,
  queryForStorySearch,
}
