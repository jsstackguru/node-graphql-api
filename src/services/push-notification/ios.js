import apn from 'apn'
import config from '../../config'
import log from '../../services/log'

const options = {
  token: {
    key: __dirname + '/../../..' + config.apn.key,
    teamId: config.apn.teamId,
    keyId: config.apn.keyId
  },
  production: config.apn.production
}

const apnProvider = new apn.Provider(options)

/**
 * Send push notification to iOS device(s)
 *
 * @param {String|Array} deviceTokens   Device's token, can be string or array of strings
 * @param {String} message
 * @returns {Promise.<*>}
 */
exports.sendPushNotification = async (deviceTokens, message) => {
  try {
    let note = new apn.Notification()

    note.expiry = Math.floor(Date.now() / 1000) + 3600 // Expires 1 hour from now.
    // note.badge = 3;
    note.sound = 'ping.aiff'
    note.alert = message
    note.payload = {'messageFrom': 'iStory'}
    note.topic = config.apn.bundleId

    let result = await apnProvider.send(note, deviceTokens)

    apnProvider.shutdown()

    return result
  } catch (err) {
    log.error(err)
    return err
  }
}
