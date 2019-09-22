/**
 * @file Group Share routes
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import express from 'express'
const router = express.Router()
import groupRtr from './group.routes'
import authMiddleware from '../../middleware/auth'
// import responseMiddleware from '../../middleware/response'

// ! invite user for group
/**
 * @api {post} /group/invite Invite user to group
 * @apiVersion 1.0.0
 * @apiName group/invite
 * @apiGroup Group
 * @apiDescription User must provide email address for another user whom want to invite
 * @apiParam (Body params) {String} email User's email
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "You successfully send invitation",
 *       "data": {
 *         "email": "group4@istoryapp.com",
 *         "invited": {
 *           "_id": "5a538361ea64260e00eb7550",
 *           "name": "Group Member 4",
 *           "username": "group4",
 *           "avatar": null,
 *           "email": "group4@istoryapp.com"
 *         },
 *         "token": "d3c5b5f625d911e7e416c6bf751db07e10f9ae4f87332bba6ffce860f9"
 *       }
 *     }
 * @apiUse authorization
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unprocessableEntity
 */
router.post('/group/invite', authMiddleware.authentication, groupRtr.invite)

// ! accept invitation for group
/**
 * @api {post} /group/accept Accept invitation for group
 * @apiVersion 1.0.0
 * @apiName group/accept
 * @apiGroup Group
 * @apiDescription User must provide token and response to accept or decline invitation for group
 * @apiParam (Body params) {String} accept User's respone on invitation
 * @apiParam (Body params) {String} token Invitation token
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "You successfully send response on invitation"
 *       "data": {
 *          "accepted": true,
 *          "group": "5349b4ddd2781d08c09890f4"
 *        }
 *     }
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unprocessableEntity
 */
router.post('/group/accept', groupRtr.accept)

// ! Leave from group //TODO: finish this! revision @nikson
/**
 * @api {post} /group/leave Leave group
 * @apiVersion 1.0.0
 * @apiName group/leave
 * @apiGroup Group
 * @apiDescription User must provide ID to leave group
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "You successfully left the group"
 *       "data": {
 *          "group": "5349b4ddd2781d08c09890f3"
 *        }
 *     }
 * @apiUse authorization
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unprocessableEntity
 */
router.post('/group/leave', authMiddleware.authentication, groupRtr.leave)

// ! Remove from group //TODO: finish this! revision @nikson
/**
 * @api {post} /group/remove Remove group
 * @apiVersion 1.0.0
 * @apiName group/remove
 * @apiGroup Group
 * @apiDescription User need to provide Id to remove someone from group and must be an owner of a group
 * @apiParam (Body params) {String} groupUser User that's going to be removed
 * @apiParam (Body params) {String} group ID of a targeted group
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "You successfully removed user from group"
 *       "data": {
 *          "group": "5349b4ddd2781d08c09890f3"
 *        }
 *     }
 * @apiUse authorization
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unprocessableEntity
 */
router.post('/group/remove', authMiddleware.authentication, groupRtr.remove)

// ! Cancel invitation for group
/**
 * @api {post} /group/cancel/:id Cancel group invitation
 * @apiVersion 1.0.0
 * @apiName group/cancel
 * @apiGroup Group
 * @apiDescription User need to provide invitation id to cancel invitation. Only author of invitation can cancel invitation.
 * @apiParam (Path params) {String} id group invitation ID
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": true,
 *       "message": "You successfully canceled group invitation"
 *     }
 * @apiUse authorization
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unprocessableEntity
 */
router.post('/group/cancel/:id', authMiddleware.authentication, groupRtr.cancel)

export default router
