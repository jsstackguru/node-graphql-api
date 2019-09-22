/**
 * @file Common functions
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import { ObjectId } from 'mongodb'
import crypto from 'crypto'
import validator from 'validator'

// Constants
import {
  PASSWORD_MAX,
  PASSWORD_MIN,
  USERNAME_MAX,
  USERNAME_MIN
} from '../constants/app'

/**
 * generate password
 *
 * @param {String}  password
 * @return {String} generated password
 */
const generatePassword = (password) => {
  // @TODO insert salt for password
  let sha1sum = crypto.createHash('sha1')
  sha1sum.update(password)
  return sha1sum.digest('hex')
}

/**
 * Validate email address
 * @param {string} email Email address for validation
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  return validator.isEmail(email)
}

/**
 * Validate username
 *
 * @param {string} username Username for validation
 * @returns {null | string}
 */
const validateUsername = (username) => {
  let error = null
  let illegalChars = /\W/ // allow letters, numbers, and underscores

  if (username === '') {
    error = 'You didn\'t enter a username'
  } else if (username.length < USERNAME_MIN) {
    error = `Username can not be less then ${USERNAME_MIN} characters`
  } else if (username.length > USERNAME_MAX) {
    error = `Username is longer then ${USERNAME_MAX} characters`
  } else if (illegalChars.test(username)) {
    error = 'The username contains illegal characters'
  }
  return error
}

/**
 * Validate password
 *
 * @param {String} password Password for validation
 * @returns {null | String}
 */
const validatePassword = (password) => {
  let error = null

  if (password === '') {
    error = 'You didn\'t enter a password'
  } else if (password.length > PASSWORD_MAX) {
    error = `Password is longer then ${PASSWORD_MAX} characters`
  } else if (password.length < PASSWORD_MIN) {
    error = `Password must be ${PASSWORD_MIN} characters at least`
  }
  return error
}

/**
 * generate validation code
 *
 * @param {string} email    email for validation
 * @returns {string}
 */
const emailValidationCode = (email) => {
  let md5sum = crypto.createHash('md5')
  md5sum.update(email)
  return md5sum.digest('hex')
}

/**
 * Validate ObjectId
 *
 * @param {string} id
 * @returns {Boolean}
 */
const isObjectID = (id) => {
  id = id || ''
  return Boolean( id.match(/^[0-9a-fA-F]{24}$/) )
}

/**
 * Is Object empty
 *
 * @param {*} obj
 * @returns {Boolean}
 */
const isObjEmpty = obj => {
  if (typeof obj === 'object' && !Array.isArray(obj) && obj !== null) {
    return Object.keys(obj).length === 0 && obj.constructor === Object
  }
  return true
}

/**
 * Is Valid Date Object
 *
 * @param {*} date
 * @returns {boolean}
 */
const isValidDateObj = (date) => {
  if (!date) return false
  return typeof date.getMonth === 'function'
}

/**
 * if prop or subProp is not date returns upper case string, otherwise return parsed date number
 *
 * @param {object} obj
 * @param {string} prop
 * @param {string} subProp
 * @returns {number | string}
 */
const evaluatePropToUpperCaseOrDate = (obj, prop, subProp) => {
  if (subProp) {
    // If subProp is valid Date, then parse it for comparison, if not convert string to upper case
    return isValidDateObj(obj[prop][subProp]) ? Date.parse(obj[prop][subProp]) : String(obj[prop][subProp]).toUpperCase()
  }
  // If prop is valid Date, then parse it for comparison, if not convert string to upper case
  return isValidDateObj(obj[prop]) ? Date.parse(obj[prop]) : String(obj[prop]).toUpperCase()
}

/**
 * Paginate array function
 *
 * @param {Array} arr
 * @param {String} page
 * @param {String} limit
 * @param {String} prop
 * @returns {Object}
 */
const paginate = (arr, page, limit, order, prop, subProp) => {
  // default values if not provided
  limit ? limit : limit = 4
  page ? page : page = 1
  const total = arr.length
  const pages = Math.ceil(total / limit)
  let start = page * limit - limit
  let end = start + limit

  let rules = {'asc': 'ASC', 'desc': 'DESC', 'ascending': 'ASC', 'descending': 'DESC', '1': 'ASC', '-1': 'DESC'}
  // if order is "falsy" than default sort is ascending
  rules[order] ? order : order = 'ascending'

  // compare function for sorting
  const compare = (a, b) => {

    let nameA = evaluatePropToUpperCaseOrDate(a, prop, subProp)
    let nameB = evaluatePropToUpperCaseOrDate(b, prop, subProp)

    if (nameA < nameB) {
      // switch ascending & descending
      return rules[order] === 'ASC' ? -1 : 1
    }
    if (nameA > nameB) {
      // switch ascending & descending
      return rules[order] === 'ASC' ? 1 : -1
    }
    return 0
  }
  // if prop is given as a parameter and true in first item of an array than sort, otherwise don't
  let finalArr = !arr[0] || !arr[0][prop] ? arr : arr.sort(compare)
  // filter sorted (or not sorted) array for pagination
  let result = finalArr.filter((item) => {
    return arr.indexOf(item) >= start && arr.indexOf(item) < end
  })

  return {
    docs: result,
    limit,
    page,
    pages,
    total
  }
}


/**
 * format bytes
 * source: https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
 *
 * @param {Number} a
 * @param {Number} b
 * @returns {String}
 */
const formatBytes = (a, b) => {
  if (0 == a) return '0 Bytes'
  var c = 1024,
    d = b || 2,
    e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    f = Math.floor(Math.log(a) / Math.log(c))
  return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f]
}

/**
 * Generate token
 *
 * @param {Number} length
 */
const generateToken = (length = 50) => {
  const token = crypto.randomBytes(length)
  return token.toString('hex')
}

/**
 * convert param to boolean
 *
 * @param {*} item
 * @returns {Boolean}
 */
const paramBoolean = (item) => {
  if (item == 'false' || !item) return false
  return true
}

/**
 * split string sentence into array of words
 *
 * @param {string} str
 * @returns {array}
 */
const strToArr = (str) => {
  return (
    typeof str === 'string'
      ?
      str
        .split(' ')
        .filter(s => s !== '' && s !== '\n')
        .map(s => s.replace(/\n/, ''))
      :
      []
  )
}

/**
 *  Replace Object props with new obj props that match
 *
 * @param {object} obj old object
 * @param {object} [objWithNewProps={}] object with new props
 * @returns {object} cloned updated object
 */
const replaceObjProps = (obj, objWithNewProps = {}) => {
  // assign to empty object if falsy value
  if (!objWithNewProps) objWithNewProps = {}

  const newObj = Object.assign({}, obj)
  const keys = Object.keys(objWithNewProps)
  // replace old props with provided new props
  keys.forEach(key => newObj[key] = objWithNewProps[key])
  return newObj
}

/**
 * Calculate gallery sections (images) sizes
 *
 * @param {array}
 * @returns {number}
 */
const calculateGallerySectionsSize = (sections) => {
  if (Array.isArray(sections)) {
    return sections.reduce((sectionPrev, sectionCurr) => {
      // sum contents image sizes
      return sectionPrev + sectionCurr['images'].reduce((imagesPrev, imagesCurr) => {
        // sum image sizes
        return imagesCurr.size + imagesPrev
      }, 0)
    }, 0)
  }
  return
}

/**
 * calculate date based on inputed string eg. "2 minutes", "4 hours" "-34 days"
 *
 * @param {string} [input='']
 * @param {date} [date=new Date()]
 * @returns {date}
 */
const calculateDate = (input = '', inputDate = new Date()) => {
  input = String(input)
  let date = new Date(inputDate)
  // number value, can be positive or negative number
  const num = Number(input.split(' ')[0])
  // only three values allowed: minute(s), hour(s), day(s)
  const period = input.split(' ')[1] ? input.split(' ')[1].replace('s', '') : ''

  // lookup table for evaluating right function based on period value
  const evaluateFunction = {
    minute() { return new Date(date.setMinutes(date.getMinutes() + num)) },
    hour() { return new Date(date.setHours(date.getHours() + num)) },
    day() { return new Date(date.setDate(date.getDate() + num)) }
  }
  // validation
  const periodValues = ['minute', 'hour', 'day']
  if (typeof num !== 'number' || isNaN(num) || !periodValues.includes(period)) {
    return date
  }

  return evaluateFunction[period]()

}

/**
 * create multiple Object ID's
 *
 * @param {number} n
 * @returns {array}
 */
// eslint-disable-next-line no-unused-vars
const createOIDs = (n) => { return  [...Array(n)].map(_id => ObjectId()) }

/**
 *  Filter certain users from story
 *
 * @param {object} story
 * @param {array} [usersToRemove=[]]
 * @returns {array}
 */
const filterUsersFromStory = (story, usersToRemove = []) => {
  return [story.author.toString(), ...story.collaborators.map(c => c.author.toString())]
    .filter(c => !usersToRemove.map(u => u.toString()).includes(c))
}

module.exports = {
  generatePassword,
  isValidEmail,
  validateUsername,
  validatePassword,
  emailValidationCode,
  isObjectID,
  isObjEmpty,
  isValidDateObj,
  evaluatePropToUpperCaseOrDate,
  paginate,
  formatBytes,
  generateToken,
  paramBoolean,
  strToArr,
  replaceObjProps,
  calculateGallerySectionsSize,
  calculateDate,
  createOIDs,
  filterUsersFromStory
}
