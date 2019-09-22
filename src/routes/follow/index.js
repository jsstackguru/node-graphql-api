
import express from 'express'
const router = express.Router()
import followingRtr from './following.routes'
import authMiddleware from '../../middleware/auth'
import responseMiddleware from '../../middleware/response'

// ! start to follow author
/*
  METHOD: POST
  PATH: /authors/follow
  REQUIRED PARAMETERS IN PATH: none
  OPTIONAL PARAMETERS IN PATH: none
  REQUIRED PARAMETERS: author_id
  OPTIONAL PARAMETERS: none
  RESPONSE: return array
 */

/**
 * @api {post} /authors/follow Follow author
 * @apiName followAuthor
 * @apiVersion 1.0.0
 * @apiGroup Following
 * @apiDescription Follow author
 * @apiParam (Body params) {String} authorId author ID
 * @apiUse authorization
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "You successfully followed author",
 *       "data": {
 *         "_id": "58eb78b94b432a21008c2348",
 *         "name": "Test Author2",
 *         "username": "testauthor2",
 *         "avatar": "",
 *         "email": "testauthor2@istoryapp.com"
 *       }
 *     }
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 */
router.post('/authors/follow', authMiddleware.authentication, responseMiddleware.sendV3, followingRtr.follow)

// ! stop to follow author
/*
  METHOD: POST
  PATH: /authors/unfollow
  REQUIRED PARAMETERS IN PATH: none
  OPTIONAL PARAMETERS IN PATH: none
  REQUIRED PARAMETERS: author_id
  OPTIONAL PARAMETERS: none
  RESPONSE: return array
 */

/**
 * @api {post} /authors/unfollow  Unfollow author
 * @apiName unfollowAuthor
 * @apiVersion 1.0.0
 * @apiGroup Following
 * @apiDescription Unfollow author
 * @apiParam (Body params) {String} authorId author ID
 * @apiUse authorization
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "You successfully followed author",
 *       "data": {
 *         "_id": "58eb78b94b432a21008c2348",
 *         "name": "Test Author2",
 *         "username": "testauthor2",
 *         "avatar": "",
 *         "email": "testauthor2@istoryapp.com"
 *       }
 *     }
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 */
router.post('/authors/unfollow', authMiddleware.authentication, responseMiddleware.sendV3, followingRtr.unfollow)

export default router
