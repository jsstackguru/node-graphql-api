
import express from 'express'
const router = express.Router()
import * as devicesRtr from './device.routes'
import authMiddleware from '../../middleware/auth'

// ! Register device
/*
  METHOD: POST
  PATH: /devices
  REQUIRED PARAMETERS IN PATH: none
  OPTIONAL PARAMETERS IN PATH: none
  REQUIRED PARAMETERS: none
  OPTIONAL PARAMETERS: none
  RESPONSE: return array
  */

/**
 * @api {post} /devices Register device
 * @apiName registerDevice
 * @apiVersion 1.0.0
 * @apiGroup Devices
 * @apiDescription Register device for user. One user may have more then one device.
 * @apiParam (Body params) {String} appVersion
 * @apiParam (Body params) {String} locale
 * @apiParam (Body params) {String} osVersion
 * @apiParam (Body params) {String} pushToken
 * @apiParam (Body params) {String} timezone
 * @apiParam (Body params) {String} platform
 * @apiUse authorization
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "message": "Device successfully added",
 *      "data": {
 *        "_id": "58eb78b94b432a21008c2348",
 *        "platform": "ios",
 *        "appVersion": "12",
 *        "pushToken": "c643b5bcd844a829b424a08681d16d6b33afe48e4f1c5c86247b33ad6d55ec42",
 *        "osVersion": "11.2.6",
 *        "timezone": "America/New_York",
 *        "locale": "en-US",
 *        "author": "58eb78b94b432a21008c2347",
 *        "created": "2019-04-22T16:06:01.606Z",
 *        "updated": "2019-04-22T16:06:01.815Z",
 *        "__v": 0
 *      }
 *    }
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 */
router.post('/devices', authMiddleware.authentication, devicesRtr.registerDevice)

export default router
