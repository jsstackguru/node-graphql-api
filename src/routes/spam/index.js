
import express from 'express'
const router = express.Router()
import spamRtr from './spam.routes'
import authMiddleware from '../../middleware/auth'

/**
 * @api {post} /spam/story/:id  Story spam
 * @apiVersion 1.0.0
 * @apiName spamStory
 * @apiGroup Spam
 * @apiDescription Report Story as spam if content is inappropriate
 * @apiParam (Path params) {String} id story ID
 * @apiUse authorization
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": true,
 *       "message": "You successfully report story"
 *     }
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 */
router.post('/spam/story/:id', authMiddleware.authentication, spamRtr.reportStory)

/**
 * @api {post} /spam/pages/:id  Page spam
 * @apiVersion 1.0.0
 * @apiName spamPage
 * @apiGroup Spam
 * @apiDescription Report Page as spam if content is inappropriate
 * @apiParam (Path params) {String} id page ID
 * @apiUse authorization
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": true,
 *       "message": "You successfully report page"
 *     }
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 */
router.post('/spam/pages/:id', authMiddleware.authentication, spamRtr.reportPage)

/**
 * @api {post} /comments/:id/spam  Comment spam
 * @apiVersion 1.0.0
 * @apiName spamComment
 * @apiGroup Spam
 * @apiDescription Report Comment as spam if content is inappropriate
 * @apiParam (Body params) {String} message Message for spam
 * @apiParam (Body params) {Number} reason Reason as an option from the spam form
 * @apiParam (Path params) {String} id comment ID
 * @apiUse authorization
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": true,
 *       "message": "You successfully report comment"
 *     }
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 */
router.post('/comments/:id/spam', authMiddleware.authentication, spamRtr.reportComment)

export default router
