/**
 * @file Extractor for author collection
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

/**
 * Return basic author's data (id, name, username, avatar)
 *
 * @param {Object} user Author object
 * @returns {Object} Basic author's data
 */
exports.basic = (user) => {
  let result = {}
  if (user) {
    Object.assign(result, {
      _id: user.id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      email: user.email
    })
  }

  return result
}

/**
 * Return author's data after login
 *
 * @param {Object} user Author's object from database
 * @returns {Object}
 */
exports.login = (user) => {
  let result = {}
  if (user) {
    Object.assign(result, {
      _id: user._id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      location: user.location,
      token: {
        access: user.token.access,
        refresh: user.token.refresh,
        expired: user.token.expired
      },
      email: user.email,
      plan: {
        level: user.plan.level,
      },
      storage: {
        usage: user.storage.usage,
      },
      notif: user.notif,
      pushNotif: user.pushNotif,
      sync: user.sync,
      firstTime: user.firstTime
    })
  }
  return result
}

/**
 * Return author's data for new author
 *
 * @param {Object} user Author object
 * @returns {Object} Basic author's data
 */
exports.newAuthor = (user) => {
  let result = {}
  if (user) {
    Object.assign(result, {
      _id: user.id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      token: {
        access: user.token.access,
        refresh: user.token.refresh
      },
      email: user.email,
      bio: user.bio,
      plan: {
        level: user.plan.level,
        expires: user.plan.expires
      },
      storage: {
        usage: user.storage.usage,
      }
    })
  }

  return result
}

/**
 * Return author's data for update profile
 *
 * @param {Object} user Author object
 * @returns {Object} Profile author's data
 */
exports.profileAuthor = (user) => {
  let result = {}
  if (user) {
    Object.assign(result, {
      _id: user.id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      token: {
        access: user.token.access,
      },
      email: user.email,
      bio: user.bio,
      location: user.location
    })
  }

  return result
}

/**
 * Return author's data for notifications
 *
 * @param {Object} user Author object
 * @returns {Object} Notifications author's data
 */
exports.notifAuthor = (user) => {
  let result = {}
  if (user) {
    Object.assign(result, {
      _id: user.id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      token: {
        access: user.token.access,
      },
      email: user.email,
      bio: user.bio,
      notif: user.notif
    })
  }

  return result
}

/**
 * Return author's data for push notifications
 *
 * @param {Object} user Author object
 * @returns {Object} Push notifications author's data
 */
exports.pushNotifAuthor = (user) => {
  let result = {}
  if (user) {
    Object.assign(result, {
      _id: user.id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      token: {
        access: user.token.access,
      },
      email: user.email,
      bio: user.bio,
      pushNotif: user.pushNotif
    })
  }

  return result
}
/**
 * Return author's data for delete account
 *
 * @param {Object} user Author object
 * @returns {Object} delete account author's data
 */
exports.deleteAccountAuthor = (user) => {
  let result = {}
  if (user) {
    Object.assign(result, {
      _id: user.id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      email: user.email,
      bio: user.bio,
      active: user.active,
      deleted: user.deleted,
      deletedAt: user.deletedAt,
    })
  }

  return result
}

/**
 * Return author's data for list (i.e. search authors, followers...)
 *
 * @param {Object} user Author object
 * @returns {Object} Returns array of authors
 */
exports.list = (author) => {
  let result = {}
  if (author) {
    Object.assign(result, {
      _id: author.id,
      name: author.name,
      username: author.username,
      avatar: author.avatar,
      email: author.email
    })
  }

  return result
}

/**
 * Return my data as an author
 *
 * @param {Object} user Author object
 * @returns {Object} Basic author's data
 */
exports.myProfile = (user) => {
  let result = {}
  if (user) {
    Object.assign(result, {
      _id: user.id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      token: {
        access: user.token.access,
        refresh: user.token.refresh,
        expired: user.token.expired
      },
      email: user.email,
      bio: user.bio,
      plan: {
        level: user.plan.level,
        expires: user.plan.expires
      },
      storage: {
        usage: user.storage.usage,
      }
    })
  }

  return result
}

/**
 * Return author's data for profile
 *
 * @param {Object} user Author object
 * @returns {Object} Profile author's data
 */
exports.getProfile = (user) => {
  let result = {}
  if (user) {
    Object.assign(result, {
      _id: user.id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      email: user.email,
      bio: user.bio,
      location: user.location
    })
  }

  return result
}

// Models properties
// (for populate function)
exports.basicProperties = 'id name username email avatar'
exports.storyProperties = 'id name username email avatar follow'

// GQL string extractor
