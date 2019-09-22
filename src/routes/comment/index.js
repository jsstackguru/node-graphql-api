
import express from 'express'
const router = express.Router()
import commentsRtr from './comment.routes'
// middleware
import { authentication } from '../../middleware/auth'
import { GQLParamSetter } from '../../middleware/GQLParamSetter'
import graphQLRouter from '../graph-rest.gateway'

// ! Post new comment
/**
 * @api {post} /comments Page comment
 * @apiVersion 1.0.0
 * @apiName comment
 * @apiGroup Comment
 * @apiDescription Post comment on page
 * @apiParam (Body params) {String} pageId Page ID
 * @apiParam (Body params) {String} comment Comment text
 * @apiUse authorization
 * @apiUse postNewCommentResponse
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 */
router.post('/comments', authentication, commentsRtr.postNewComment)

// ! Post new reply on comment
/**
 * @api {post} /comments/:id/reply Page comment reply
 * @apiVersion 1.0.0
 * @apiName comment reply
 * @apiGroup Comment
 * @apiDescription Post reply on comment
 * @apiParam (Path params) {String} id comment ID
 * @apiParam (Body params) {String} comment Comment text
 * @apiUse authorization
 * @apiUse postNewCommentReplyResponse
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 */
router.post('/comments/:id/reply', authentication, commentsRtr.postNewCommentReply)

// ! Edit comment
/**
 * @api {put} /comments/:id Edit comment
 * @apiVersion 1.0.0
 * @apiName Edit comment
 * @apiGroup Comment
 * @apiDescription Edit comment on page by ID. Only author can edit a comment
 * @apiParam (Path params) {String} id Comment ID
 * @apiParam (Body params) {String} comment Comment text
 * @apiUse authorization
 * @apiUse postNewCommentReplyResponse
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse forbidden
 * @apiUse unprocessableEntity
 */
router.put('/comments/:id', authentication, commentsRtr.editComment)

// ! Delete a comment
/**
 * @api {delete} /comments/:id Delete a comment
 * @apiVersion 1.0.0
 * @apiName comment delete
 * @apiGroup Comment
 * @apiDescription Delete a comment by ID
 * @apiParam (Body params) {String} id comment ID
 * @apiUse authorization
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": true,
 *       "data": {
 *          "id": "5cbdd052e5c56318868e0713"
 *       }
 *     }
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 */
router.delete('/comments/:id', authentication, commentsRtr.deleteComment)


/*************************************************/
/******************** | GET | ********************/
/*************************************************/


/**
 * @api {get} /pages/:id/comments  Comments by pageId
 * @apiVersion 1.0.0
 * @apiName CommentsById
 * @apiGroup Comment
 * @apiDescription Get all comments on page
 * @apiParam (Path params) {String} id Page ID
 * @apiUse authorization
 * @apiUse paginationParams
 * @apiUse commentsDetailsPaginationResponse
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 */
router.get('/pages/:id/comments', authentication, GQLParamSetter, graphQLRouter)

/**
 * @api {get} /comments/:id/replies  Replies by commentId
 * @apiVersion 1.0.0
 * @apiName RepliesById
 * @apiGroup Comment
 * @apiDescription Get all replies for comment
 * @apiParam (Path params) {String} id comment ID
 * @apiUse authorization
 * @apiUse paginationParams
 * @apiUse commentsDetailsPaginationResponse
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 */
router.get('/comments/:id/replies', authentication, GQLParamSetter, graphQLRouter)

export default router
