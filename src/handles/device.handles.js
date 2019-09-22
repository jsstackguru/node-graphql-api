/**
 * @file Handler for author collection
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

// Models
import Device from '../models/device/device.model'

/**
 * Register divace
 *
 * @param {String} userId
 * @param {Data} data
 * @returns
 */
const registerDevice = async (userId, data) => {
  try {

    let device = await Device.findOne({pushToken: data.pushToken})

    if (!device) {
      // data.author = userId //TODO: proveriti?
      let newDevice = await Device.create(data)
      return newDevice

    } else {

      if (String(device.author) !== userId) { //TODO: proveriti, nisam siguran!
        device.author = userId
        await device.save()
        return device
      }
      return device // TODO: da li da vratim error umesto da mu vracam isti objekat?  :()
    }

  } catch (err){
    return err
  }
}

/**
 * get users devices
 *
 * @param {String, Array} usersId
 * @returns
 */
const getUsersDevices = async (usersIds) => {
  try {
    let devices = await Device.find({author: usersIds})
    return devices
  } catch (err) {
    return err
  }
}

/**
 * Get user's device tokens
 * @param {String} id 
 * @returns {Array} - List of tokens
 */
const getDeviceTokensByUserIds = async id => {
  try {
    const devices = await getUsersDevices(id)
    const tokens = devices.map(device => device.token)
    return tokens
  } catch (err) {
    throw err
  }
}

module.exports = {
  registerDevice,
  getUsersDevices,
  getDeviceTokensByUserId: getDeviceTokensByUserIds
}
