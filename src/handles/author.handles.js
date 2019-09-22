/**
 * @file Handler for author collection
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import randtoken from 'rand-token'
import uuid from 'node-uuid'

// Models
import Author from '../models/author/author.model'
import Page from '../models/page/page.model'
import ForgotPassword from '../models/forgot-password/forgot-password.model'
import Story from '../models/story/story.model'
import Comments from '../models/comment/comment.model'
import Following from '../models/following/following.model'
import GroupInvite from '../models/group-invite/group-invite.model'

// Extractors
import authorExtractor from '../models/author/author.extractor'

// Handles
import utils from '../lib/utils'
import pageHndl from './page.handles'
import storyHndl from './story.handles'

// Services
import { uploadMediaS3 } from '../services/media/upload'
import { generateToken } from '../services/auth'

// Libraries
import { UnprocessableEntity, BadRequest } from '../lib/errors'
import translate from '../lib/translate'

// Constants
import {planLevels, planLimits} from '../constants/plan'
import { Group } from '../models/group'

// Local constants
import { TOKEN } from '../constants/app'

// temporary function for printing token in console when server starts
const getToken = (email) => {
  return generateToken(email)
}

/**
 * Authorize user by token
 *
 * @param {string} token Access token for user
 * @returns {Object} Return author fond by access token
 */
const authorize = async (token) => {
  try {

    // find author by token
    const author = await Author.findOne({'token.access': token, 'active': true, 'deleted': false})

    return authorExtractor.login(author)

  } catch (err) {
    return err
  }
}

/**
 * Create author
 *
 * @param {Object} user Author's data to be stored
 * @returns {Object} New created author
 */
const create = async (user) => {
  try {
    // create author
    const newUser = await Author.create(user)

    return newUser
  } catch (err) {
    return err
  }
}

/**
 * Get author basic data by id
 */
const getById = async (id) => {
  try {
    let author = await Author.findOne({'_id': id, active: true, deleted: false})

    return authorExtractor.basic(author)

  } catch (err) {
    return err
  }
}

/**
 * Login author by email and password
 *
 * @param {String} email email
 * @param {String} password password
 * @returns {Object} user's data
 */
const login = async (email, password) => {
  try {
    password = utils.generatePassword(password)
    // find author
    let user = await Author.findOne({email: email, password: password, active: true, deleted: false})

    if (!user) {
      return null
    }
    let update = {}

    // generate refresh token
    if (Object.is(update, null)) {
      if (!update.token) {
        const token = generateToken(user.email)
        const now = new Date()
        const expireDate = now.setDate(now.getDate() + TOKEN.EXPIRE_DAYS)
        Object.assign(update, {
          token: {
            access: token,
            refresh: randtoken.generate(32),
            expired: new Date(expireDate)
          }
        })
      }
    }

    // update author
    if (!Object.is(update, null)) {
      user = await Author.findOneAndUpdate({_id: user.id}, update, { new: true })
    }

    return authorExtractor.login(user)

  } catch (err) {
    throw err
  }
}

/**
  * Check does token has expired
 *
  * @param {Date} createDate
  * @returns {Boolean}
  */
const tokenHasExpired = (expiredDate) => {
  if (!expiredDate) {
    return true
  } else {
    var now = new Date()
    return now > new Date(expiredDate)
  }
}

/**
 * Signup new author
 *
 * @param {String} email Email for new user
 * @param {String} username Username for new user
 * @param {String} name Name for new author
 */
const register = async (email, username, password, name, invitationToken) => {
  try {
    // generate auth token
    const token = randtoken.generate(32)

    // check username
    const usernameError = utils.validateUsername(username)
    if (usernameError) {
      return new BadRequest(usernameError)
    }

    // try to find whether username exist
    let usernameUser = await Author.findByUsername(username)

    if (usernameUser) {
      return new UnprocessableEntity('The username is already taken')
    }

    // check password
    const passwordError = utils.validatePassword(password)
    if (passwordError) {
      return new BadRequest(passwordError)
    }

    // chech email
    let user = await Author.findActiveByEmail(email) //TODO: revision!

    if (user) {
      return new UnprocessableEntity('The email is already taken')
    }

    let now = new Date()
    let expireDate = now.setDate(now.getDate() + 30)

    // create author
    let newAuthor = await Author.create({
      email: email,
      username: username,
      password: utils.generatePassword(password),
      name: name || username,
      token: {
        refresh: randtoken.generate(64),
        expired: expireDate,
        access: generateToken(email),
      },
      created: new Date(),
      updated: new Date(),
      authToken: token,
      deleted: false,
      active: false,
      admin: false,
      notif: {
        collaboration: {
          userLeavesStory: true,
          removedFromStory: true,
          storyUpdates: true,
          newCollaborator: true,
          invitations: true
        },
        social: {
          newFollower: true,
          comments: true,
          favoritedYourStory: true,
          sharedStory: true,
          friendStoryUpdates: true,
          friendNewStory: true,
          newFriend: true
        }
      },
      firstTime: true,
      pushNotif: {
        newStoryShare: true,
        newStoryPublic: true,
        newFollower: true,
        newComment: true
      },
      lastActivityCheck: {
        timeline: new Date(),
        social: new Date(),
        collaboration: new Date()
      },
      plan: {
        level: planLevels.BASIC,
        expires: null,
      },
      storage: {
        usage: 0,
      }
    })

    // check does user has group invitation
    if (invitationToken) {
      await groupRegisterInvitation(newAuthor.id, invitationToken) //TODO: da li vracati ovo nekako?
    }

    return authorExtractor.newAuthor(newAuthor)

  } catch (err) {
    throw err
    // return err.message
  }
}

/**
 * Accept group invitation, and add group member on signup
 *
 * @param {String} invitedId
 * @param {String} token
 * @returns //TODO: ?
 */
const groupRegisterInvitation = async (invitedId, token) => {
  try {
    // query, update, options for group invite model
    const invite = {
      query: {
        token
      },
      update: {
        $set: {
          accepted: true
        }
      },
      options: {
        new: true
      }
    }
    // get invitation and update accepted
    let groupInvitation = await GroupInvite.findOneAndUpdate(invite.query, invite.update, invite.options)

    // query, update, options for group model
    const query = {
      query: {
        $or: [{
          owner: groupInvitation.author
        },
        {
          members: groupInvitation.author
        }
        ],
        active: true
      },
      update: {
        $push: {
          members: invitedId
        }
      },
      options: {
        new: true
      }
    }
    // get group and push new member
    const group = await Group.findOneAndUpdate(query.query, query.update, query.options)

    return {
      groupInvitation,
      group
    }

  } catch (err) {
    throw err
  }
}

/**
 * Forgot password
 *
 * @param {String} email Author's email for recovery link in email
 */
const forgotPassword = async (email) => {
  try {
    let author = await Author.findActiveByEmail(email, 'throw_err_if_not_found')

    // generate access code
    const code = utils.emailValidationCode(email)
    // save forgot password
    const insertValues = {
      author: author.id,
      code: code,
      active: true,
    }
    let forgot = await ForgotPassword.create(insertValues)

    return {
      author: authorExtractor.basic(author),
      code: forgot.code
    }
  } catch (err) {
    return err
  }
}

/**
 * Helper function for reducing code
 *
 * @param {*} prop
 * @returns
 */
const notifPropHelper = (prop) => {
  return prop !== undefined ? Boolean(prop) : null
}
/**
 * Save settings for notifications
 *
 * @param {Object} user
 * @param {Object} collaboration
 * @param {Object} social
 * @returns {Object} user //TODO: ?
 */
const saveSettingsNotifications = async (userId, collaboration, social) => {

  try {

    let author = await Author.findOneActiveById(userId, 'throw_err_if_not_found')

    // assign valid input data for collaboration notifications, if not prop = null
    const newCollaboration = {
      userLeavesStory: notifPropHelper(collaboration.userLeavesStory),
      removedFromStory: notifPropHelper(collaboration.removedFromStory),
      storyUpdates: notifPropHelper(collaboration.storyUpdates),
      newCollaborator: notifPropHelper(collaboration.newCollaborator),
      invitations: notifPropHelper(collaboration.invitations)
    }

    // assign valid input data for social notifications, if not prop = null
    const newSocial = {
      newFollower: notifPropHelper(social.newFollower),
      comments: notifPropHelper(social.comments),
      favoritedYourStory: notifPropHelper(social.favoritedYourStory),
      sharedStory: notifPropHelper(social.sharedStory),
      friendStoryUpdates: notifPropHelper(social.friendStoryUpdates),
      friendNewStory: notifPropHelper(social.friendNewStory),
      newFriend: notifPropHelper(social.newFriend)
    }

    // assign/filter valid properties to collaboration obj
    for (let prop in newCollaboration) {
      let key = newCollaboration[prop]
      if (key !== null) {
        author.notif.collaboration[prop] = key
      }
    }

    // assign/filter valid properties to social obj
    for (let prop in newSocial) {
      let key = newSocial[prop]
      if (key !== null) {
        author.notif.social[prop] = key
      }
    }

    await author.save()
    return authorExtractor.notifAuthor(author)

  } catch (err) {
    return err
  }
}

/**
 * Save settings for notifications
 *
 * @param {Object} user
 * @param {Object} notifications
 * @returns {Object} user //TODO: ?
 */
const saveSettingsPushNotifications = async (userId, notifications) => {

  try {

    let author = await Author.findOneActiveById(userId)

    if (!author) {{
      throw new UnprocessableEntity(translate.__('Author not found'))
    }}
    // assign valid input data for collaboration notifications, if not prop = null
    const newNotifications = {
      newStoryShare: notifPropHelper(notifications.newStoryShare),
      newStoryPublic: notifPropHelper(notifications.newStoryPublic),
      newFollower: notifPropHelper(notifications.newFollower),
      newComment: notifPropHelper(notifications.newComment),
    }

    // assign/filter valid properties to collaboration obj
    for (let prop in newNotifications) {
      let key = newNotifications[prop]
      if (key !== null) {
        author.pushNotif[prop] = key
      }
    }

    await author.save()
    return authorExtractor.pushNotifAuthor(author)

  } catch (err) {
    return err
  }
}

/**
 * change password
 *
 * @param {Object} user
 * @param {String} oldPassword
 * @param {String} newPassword
 * @returns {Object}
 */
const changePassword = async (userId, oldPassword, newPassword) => {
  try {

    let hashPassword = utils.generatePassword(oldPassword)
    let author = await Author.findOneActiveById(userId, 'throw_err_if_not_found')

    if (hashPassword !== author.password) {
      throw new UnprocessableEntity(translate.__('Failed to match your current password')) //TODO: translate
    }

    author.password = utils.generatePassword(newPassword)
    await author.save()

    return author

  } catch (err) {
    return err
  }
}

/**
 * Update profile
 *
 * @param {String} name Author's full name
 * @param {String} username Author's username
 * @param {String} bio Author's bio
 * @param {Object} location Author's location TODO: finish this...
 * @param {Object} user Author object / from token
 * @returns {Object} user TODO:?
 */
const updateProfile = async (name, username, bio, location, avatar, user) => {
  try {
    let author = await Author.findById(user._id)

    let key
    if (avatar) {
      let file = avatar
      let type = file.type.split('/')
      let extension = type[1]
      key = 'images/' + user.id + '/' + uuid.v1() + '.' + extension

      await uploadMediaS3(file, key)
    }

    author.name = name ? name.toLowerCase() : author.name
    author.username = username ? username.toLowerCase() : author.username
    author.bio = bio ? bio : author.bio
    author.location = location ? location : author.location
    author.avatar = avatar ? key : author.avatar

    await author.save()

    return authorExtractor.profileAuthor(author)

  } catch (err) {
    return err
  }
}

/**
 * Check does username exists
 *
 * @param {String} username Username to find in database
 * @returns {Promise}
 */
const usernameExists = async (username) => {
  try {
    let author = await Author.findByUsername(username)

    if (author) {
      return true
    } else {
      return false
    }
  } catch (err) {
    return err
  }
}

/**
 * Check does email exists
 *
 * @param {String} email Email to find in database
 * @returns {Promise}
 */
const emailExists = async (email) => {
  try {
    let author = await Author.findActiveByEmail(email)

    if (author) {
      return true
    } else {
      return false
    }
  } catch (err) {
    return err
  }
}

/**
 * Search authors by term and page
 *
 * @param {string} term Term for searching by username and name
 * @returns {Promise} Return array of authors as search results
 */
const search = async (term) => {
  try {
    let searchQuery = {}

    if (term) {
      searchQuery = {
        $and: [
          {
            $or: [
              {name: {$regex: term, $options: 'i'}},
              {username: {$regex: term, $options: 'i'}}
            ]
          },
          {deleted: false}
        ]
      }
    } else {
      searchQuery = {deleted: false}
    }

    // get authors by page
    let authors = await Author.find(searchQuery)
    // .skip((page.number - 1) * page.size)
    // .limit(page.size)

    let results = []
    authors.map(author => {
      results.push(authorExtractor.list(author))
    })

    return results
  } catch (err) {
    return err
  }
}

/**
 * Refresh author's access token
 *
 * @param {string} email
 * @param {string} token
 * @returns {Promise<void>}
 */
const refreshToken = async (email, token) => {
  try {
    const author = await Author.findOne({email: email, 'token.refresh': token})

    if (!author) {
      throw new UnprocessableEntity(translate.__('User not found'))
    }
    // update author with new token
    // set refresh token
    const refreshToken = randtoken.generate(64)
    author.token.refresh = refreshToken
    // set expired date
    const now = new Date()
    const expireDate = now.setDate(now.getDate() + TOKEN.EXPIRE_DAYS)
    author.token.expired = new Date(expireDate)
    // set access token
    author.token.access = generateToken(email)
    await author.save()

    return author
  } catch (err) {
    throw err
  }
}

/**
 * Storage usage
 *
 * @param {String} authorId
 * @returns {Object}
 */
const storageUsage = async (authorId) => {
  try {
    // let pages = await Page.findAuthorsPages(authorId)
    let pages = await Page.find({
      author: authorId
    }).lean() // TODO: da li deleted: true active: false

    // template obj for returning data
    let final = {
      usageTable: {},
      sum: null,
      sumBytes: null
    }
    pages.forEach(page => {
      // get sum  for every page
      let sumTable = page.content.filter(c => c.type !== 'text').reduce((acc, curr) => {
        // for all content that is not type gallery / SUM
        if (curr.type !== 'gallery') {
          return acc + (curr.size ? curr.size : 0) // This ternary operator handles if some of content types doesn't have size
        }

        // gallery sum
        let sectionSum = 0
        curr.sections.forEach(section => { //TODO: mozda ovaj deo staviti u posebnu funkciju?
          // sum images sizes in section
          let imagesSizes = section.images.reduce((acc2, curr2) => {
            return acc2 + curr2.size
          }, 0)
          sectionSum += imagesSizes
        })

        return acc + sectionSum

      }, 0)

      // assign to object separate sum
      final.usageTable[page._id] = sumTable
    })
    // sum all pages contents size
    let sum = 0
    for (let key in final.usageTable) {
      let prop = final.usageTable[key]
      sum += prop
    }

    final.sum = utils.formatBytes(sum)
    final.sumBytes = sum

    return final
  } catch (err) {
    throw err
  }
}

/**
 * Delete account
 *
 * @param {string} authorId
 * @returns {object}
 */
const deleteAccount = async (authorId) => {
  try {
    let author = await Author.findOneActiveById(authorId, 'throw_err_if_not_found')

    let deletePageStories = []

    // find all authors stories that are not deleted
    let allCurrentStories = await Story.find({author: author._id, deleted: false})

    // find all authors pages
    let allPages = await Page.find({author: authorId})

    // map to page ids only
    let allPagesIds = allPages.map(p => p['_id'].toString())

    // find authors collaborations
    let collaboratedStories = await Story.findAuthorsCollaborations(authorId)

    // all user pages from other authors story (collaborated)
    let collaboratedStoriesCoAuthorPages = collaboratedStories
      .map(r => { // map to pages[] and storyId only
        return {
          storyId: r._id,
          pages: r.pages.filter(p => allPagesIds.includes(p.toString())) // return only co-authors pages
        }
      })
      .reduce((prev, curr) => prev.concat(curr), []) // flatten two-dimensional arrays

    // push all deleteStory promises
    allCurrentStories.forEach(story => deletePageStories.push(storyHndl.deleteStory(authorId, story._id)))

    // push all removePage promises
    collaboratedStoriesCoAuthorPages.forEach(story => {
      story.pages.forEach(pageId => deletePageStories.push(pageHndl.removePage(pageId, story.storyId)))
    })

    // resolve all promises (delete story, remove collaborated pages)
    await Promise.all(deletePageStories) //TODO: mozda ipak da promenim ovo u for of loop ...  (forEach deleteStory, forEach removePage)
    // remove author from collaborations
    await Story.deleteAuthorFromCollaborations(authorId)
    // delete followings, followers
    await Following.deleteAllFollowingAndFollowers(authorId)
    // delete all authors pages
    await Page.deleteAllAuthorPages(authorId)
    // delete all comments on authors pages
    for (let pageId of allPagesIds) {
      await Comments.deleteAllPageComments(pageId)
    }

    // activites notice users about authors deletation //TODO:

    // soft delete author
    author.deletedAt = new Date()
    author.deleted = true
    author.active = false
    await author.save()

    return authorExtractor.deleteAccountAuthor(author)

  } catch (err) {
    throw err
  }
}

/**
 * Calculate storage limit and plan storage for author and group that author belongs
 *
 * @param {Object} author
 * @param {Array} members
 * @returns {Object}
 */
const calcStorageLimitGroup = (author, members) => {

  // total storage for author
  let authorTotal = planLimits[author.plan.level]
  //  how much storage author used
  let authorUsed = author.storage.usage
  //  how much storage is left for author
  let authorLeft = authorTotal - authorUsed

  let finalObj = {
    author: {
      total: {
        bytes: authorTotal,
        format: utils.formatBytes(authorTotal)
      },
      used: {
        bytes: authorUsed,
        format: utils.formatBytes(authorUsed)
      },
      left: {
        bytes: authorLeft,
        format: utils.formatBytes(authorLeft)
      }
    },
    members: null
  }

  if (members && Array.isArray(members)) {
    // total storage for all members
    let total = 0
    //  number of used storage for all members
    let used = 0
    // sum of all members storage and plan data
    members.forEach(author => {
      total += planLimits[author.plan.level]
      used += author.storage.usage
    })

    // how much storage left for all members
    let left = total - used

    let memberObj = {
      you: {
        bytes: authorUsed,
        format: utils.formatBytes(authorUsed)
      },
      others: {
        bytes: used,
        format: utils.formatBytes(used)
      },
      left: {
        bytes: left + authorLeft,
        format: utils.formatBytes(left + authorLeft)
      },
      total: {
        bytes: total + authorTotal,
        format: utils.formatBytes(total + authorTotal)
      }
    }

    finalObj.members = memberObj

  }

  return finalObj
}

/**
 * Calculate storage limit for author
 *
 * @param {String} authorId
 * @returns {Object}
 */
const storageLimit = async (authorId) => {
  try {
    const author = await Author.findOneActiveById(authorId, 'throw_err_if_not_found') //TODO: mozda nema potrebe za ovim kad celog authora vec dobijam u gql req.user,

    let group = await Group.findForAuthor(authorId)
    let members

    if (group) {
      // find all users besides author from group and calculate storage and limit
      let membersIds = [...group.members, group.owner].filter(user => user != authorId)

      members = await Author.find({
        _id: membersIds,
        active: true,
        deleted: false
      })
    }

    let final = calcStorageLimitGroup(author, members)
    return final

  } catch (err) {
    throw err
  }
}

/**
 * Check does user overrun his plan storage limit
 *
 * @param {String} userLevel
 * @param {Number} userStorageUsage
 * @returns {Boolean}
 */
const isPlanOverrun = (userLevel, userStorageUsage) => {
  try {
    if (planLimits[userLevel] <= userStorageUsage) {
      return true
    }
    return false
  } catch (err) {
    throw err
  }
}

/**
 * Set a new password for the author
 *
 * @param {String} code Code from forgot password
 * @param {String} password A new password
 */
const setNewPassword = async (code, password) => {
  try {
    if (!code) {
      throw new BadRequest(translate.__('Code is required'))
    }
    if (!password) {
      throw new BadRequest(translate.__('Password is required'))
    }

    const forgotPassword = await ForgotPassword.findOne({ code: code, active: true})
    if (!forgotPassword) {
      throw new UnprocessableEntity(translate.__('Code has expired or doesn\'t exist'))
    }

    const author = await Author.findOneActiveById(forgotPassword.author)
    if (!author) {
      throw new UnprocessableEntity(translate.__('User not found'))
    }

    // set the new password
    author.password = utils.generatePassword(password)
    await author.save()

    // deactivate code for reset password
    forgotPassword.active = false
    await forgotPassword.save()

    return authorExtractor.basic(author)
  } catch (err) {
    throw err
  }
}

/**
 * Find author by username
 * @param {String} username - Author's username
 */
const getByUsername = async (username, user) => {
  try {
    const author = await Author.findOne({ username, active: true, deleted: false })

    if (!author) {
      throw new UnprocessableEntity(translate.__('Author not found'))
    }
    const id = author.id
    const query = { $or: [{author: id}, {follows: id}] }
    // find all followers and followings
    const allFollows = await Following.find(query)
    // filter and extract only followings ID
    const following = allFollows
      .filter(f => String(f.author) === String(id))
      .map(f => f.follows)
    // filter and extract only followers ID
    const followers = allFollows
      .filter(f => String(f.follows) === String(id))
      .map(f => f.author)
    // find author's stories
    const stories = await Story.find({
      author: id,
      active: true,
      deleted: false
    })
    // is following
    let isFollowed = false
    if (user) {
      if (followers.find(follwer => follwer.id.equals(user.id))) {
        isFollowed = true
      }
    }

    author.following = following.length
    author.followers = followers.length
    author.stories = stories.length
    author.isFollowed = isFollowed

    return author
  } catch (err) {
    throw err
  }
}

export default {
  authorize,
  calcStorageLimitGroup,
  changePassword,
  create,
  deleteAccount,
  emailExists,
  groupRegisterInvitation,
  forgotPassword,
  getById,
  getByUsername,
  getToken,
  isPlanOverrun: isPlanOverrun,
  login,
  register,
  saveSettingsNotifications,
  saveSettingsPushNotifications,
  search,
  setNewPassword,
  storageLimit,
  storageUsage,
  refreshToken,
  tokenHasExpired,
  updateProfile,
  usernameExists
}
