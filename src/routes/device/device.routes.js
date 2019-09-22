/* eslint-disable camelcase */
/**
 * @file Routes for author
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

// Handles
// import authorHndl from '../handles/author.handles'
import deviceHndl from '../../handles/device.handles'
// Services
import translate from '../../lib/translate'
import { BadRequest } from '../../lib/errors'

/**
 * Register device
 *
 * @param {function} req
 * @param {function} res
 * @param {function} next
 */
const registerDevice = async (req, res, next) => {
  try {

    let user = req.effectiveUser

    let data = {
      appVersion: req.body.appVersion,
      locale: req.body.locale,
      osVersion: req.body.osVersion,
      pushToken: req.body.pushToken,
      timezone: req.body.timezone,
      platform: req.body.platform,
    }

    for (let key in data) {
      let prop = data[key]
      if (!prop) return next(new BadRequest(translate.__('Fields not found'))) //TODO: message
    }

    // TODO: sta da vratim ovde? mozda samo message?
    let result = await deviceHndl.registerDevice(user._id, data)

    res.send({
      // status: true,
      message: translate.__('Device successfully added'),
      data: result
    })

  } catch (err) {
    next(err)
  }
}

module.exports = {
  registerDevice
}
