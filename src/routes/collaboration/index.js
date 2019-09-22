/* eslint-disable no-undef */
/**
 * @file Collaboration model
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */


import express from 'express'
import { add, cancel, leave, remove, update } from './collaboration.routes'
/*  Middlewares   */
import { authentication } from '../../middleware/auth'
import responseMiddleware from '../../middleware/response'

const router = express.Router()

/**
 * @api {patch} /collaboration/cancel Cancel invitation
 * @apiVersion 1.0.0
 * @apiName collaborationCancel
 * @apiGroup Collaboration
 * @apiDescription Cancel invitation for a collaboration by emails
 * @apiParam (Body params) {String} storyId Story ID for collaboration
 * @apiParam (Body params) {Array} emails List of an emails to invitation cancel for
 * @apiUse authorization
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "message": "The 2 invitation(s) has been cancelled successfully",
 *        "status": true
 *     }
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse forbidden
 * @apiUse unprocessableEntity
 */
router.post('/collaboration/cancel', authentication, cancel)

/**
 * @api {post} /collaboration/:id Invite collaborator
 * @apiVersion 1.0.0
 * @apiName collaborationInvite
 * @apiGroup Collaboration
 * @apiDescription Invite author who is following user to join Story
 * @apiParam (Path params) {String} id Story ID (ObjectID type)
 * @apiParam (Body params) {Object} collaborators
 * @apiParam (Body params) {Object[]} collaborators.userIds List of user ids and edit privileges
 * @apiParam (Body params) {String} collaborators.userIds.id ID of potential collaborator (ObjectID type)
 * @apiParam (Body params) {String} collaborators.userIds.edit Edit privileges for potential collaborator
 * @apiParam (Body params) {Object[]} collaborators.emailAddresses List of user emails and edit privileges
 * @apiParam (Body params) {String} collaborators.emailAddresses.email Email of potential collaborator (ObjectID type)
 * @apiParam (Body params) {String} collaborators.emailAddresses.edit Edit privileges for potential collaborator
 * @apiUse authorization
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {[
 *          "_id": "123456",
 *          "name": "sample name",
 *          "avatar": "sample avatar",
 *          "username": "sample username",
 *          "email": "sample email"
 *       ]}
 *     }
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 */
router.post('/collaboration/:id', authentication, responseMiddleware.sendV3, add)

/**
 * @api {post} /collaboration/:id/remove Remove from collaboration
 * @apiVersion 1.0.0
 * @apiName collaborationRemoce
 * @apiGroup Collaboration
 * @apiDescription Remove author from collaboration. In that case copy author's pages in new Story {story's title}-copy
 * @apiParam (Body params) {String} id Story ID for collaboration
 * @apiParam (Body params) {Array} userId User ID od array of IDs
 * @apiUse authorization
 * @apiUse collaborationRemoveResponse
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 */
router.post('/collaboration/:id/remove', authentication, responseMiddleware.sendV3, remove)

/**
 * @api {put} /collaboration/:id Leave invitation
 * @apiVersion 1.0.0
 * @apiName collaborationLeave
 * @apiGroup Collaboration
 * @apiDescription User leaves collaboration
 * @apiParam (Path params) {String} id Story ID for collaboration
 * @apiParam (Body params) {Boolean} deletePages delete pages from story
 * @apiUse authorization
 * @apiUse collaborationLeaveResponse
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 */
router.put('/collaboration/:id', authentication, responseMiddleware.sendV3, leave)

/**
 * @api {patch} /collaboration/:id Update collaborator
 * @apiVersion 1.0.0
 * @apiName collaborationUpdate
 * @apiGroup Collaboration
 * @apiDescription Update collaboration
 * @apiParam (Path params) {String} id Story ID for collaboration
 * @apiParam (Body params) {String} userId Author ID to whom whats to change story permission
 * @apiUse authorization
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "You have successfully updated collaborator",
 *       "data": {
 *         "edit": true,
 *         "author": {
 *            "_id": "5cbdca350cda18158e4bfc99",
 *            "name": "sample name",
 *            "avatar": "sample avatar",
 *            "username": "sample username",
 *            "email": "sample email"
 *         }
 *       }
 *     }
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse forbidden
 * @apiUse unprocessableEntity
 */
router.patch('/collaboration/:id', authentication, responseMiddleware.sendV3, update)

export default router
