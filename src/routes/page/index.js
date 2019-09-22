
import express from 'express'
const router = express.Router()
import pageRtr from './page.routes'
// middleware
import authMiddleware from '../../middleware/auth'
import responseMiddleware from '../../middleware/response'
import { GQLParamSetter } from '../../middleware/GQLParamSetter'
import graphQLRouter from '../graph-rest.gateway'
import { plan } from '../../middleware/plan'

// ! Create page
/*
  METHOD: POST
  PATH: /pages
  REQUIRED PARAMETERS IN PATH: none
  OPTIONAL PARAMETERS IN PATH: none
  REQUIRED PARAMETERS: none
  OPTIONAL PARAMETERS: none
  RESPONSE: return array
  */

/**
 * @api {post} /pages  Create page
 * @apiVersion 1.1.0
 * @apiName createPage
 * @apiGroup Page
 * @apiDescription Create page by user
 * @apiParam (Body params) {String} storyId Story ID
 * @apiParam (Body params) {String} [title] Page title
 * @apiParam (Body params) {String} [pageNumber] Page number in order
 * @apiParam (Body params) {String} [matchId] Match ID
 * @apiParam (Body params) {String} [cover] Page cover
 * @apiParam (Body params) {String} [dateFrom] Date from
 * @apiParam (Body params) {String} [dateTo] Date to
 * @apiParam (Body params) {Object} [place] place
 * @apiParam (Body params) {String} [place.name] Place name
 * @apiParam (Body params) {String} [place.lat] Place latitude
 * @apiParam (Body params) {String} [place.lon] place longitude
 * @apiParam (Body params) {Object[]} content Page content
 * @apiParam (Body params) {String} content.type Page content type (text, audio, recording, image, gallery, gif, video)
 * @apiParam (Body params) {Binary} content.file Page content file
 * @apiParam (Body params) {Binary} cover Page cover
 * @apiUse authorization
 * @apiUse createNewPageResponse
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 */
router.post('/pages', authMiddleware.authentication, plan, pageRtr.create)

// ! Update page
/*
  METHOD: PUT
  PATH: /pages
  REQUIRED PARAMETERS IN PATH: none
  OPTIONAL PARAMETERS IN PATH: none
  REQUIRED PARAMETERS: none
  OPTIONAL PARAMETERS: none
  RESPONSE: return array
  */

/** //TODO: content
 * @api {put} /pages  Update page
 * @apiVersion 1.0.0
 * @apiName updatePage
 * @apiGroup Page
 * @apiDescription Update page by user
 * @apiParam (body params) {String} pageId Page ID
 * @apiParam (body params) {String} [title] Page title
 * @apiParam (body params) {String} [matchId] Match ID
 * @apiParam (body params) {String} [cover] Page cover
 * @apiParam (body params) {String} [dateFrom] Date from
 * @apiParam (body params) {String} [dateTo] Date to
 * @apiParam (body params) {Object} [place] place
 * @apiParam (body params) {String} [place.name] Place name
 * @apiParam (body params) {String} [place.lat] Place latitude
 * @apiParam (body params) {String} [place.lon] place longitude
 * @apiParam (body params) {Object[]} [content] Page content
 * @apiParam (body params) {String} [content.type] Page content type (text, audio, recording, image, gallery, gif, video)
 * @apiParam (body params) {Binary} [content.file] Page content file
 * @apiParam (body params) {Binary} [cover] Page cover
 * @apiUse authorization
 * @apiUse insertContentResponse
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 */
router.put('/pages', authMiddleware.authentication, plan, pageRtr.update)

/**
 * @api {post} /pages/copy  Copy page
 * @apiVersion 1.0.0
 * @apiName copyPage
 * @apiGroup Page
 * @apiDescription Copy page to another story
 * @apiParam (Body params) {String} pageId Page ID
 * @apiParam (Body params) {String} storyId Story ID
 * @apiUse authorization
 * @apiUse pageCopyResponse
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 */
router.post('/pages/copy', authMiddleware.authentication, plan, responseMiddleware.sendV3, pageRtr.copy)

// ! Move page
/*
  METHOD: POST
  PATH: /pages/move
  REQUIRED PARAMETERS IN PATH: none
  OPTIONAL PARAMETERS IN PATH: none
  REQUIRED PARAMETERS: page_id
  REQUIRED PARAMETERS: story_id
  OPTIONAL PARAMETERS: none
  RESPONSE: return Object
  */

/**
 * @api {post} /pages/move  Move page
 * @apiVersion 1.0.0
 * @apiName movePage
 * @apiGroup Page
 * @apiDescription Move page to another story
 * @apiParam (Body params) {String} pageId Page ID
 * @apiParam (Body params) {String} storyId Story ID
 * @apiUse authorization
 * @apiUse pageCopyResponse
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 */
router.post('/pages/move', authMiddleware.authentication, responseMiddleware.sendV3, pageRtr.move)

// ! insert content element
/*
  METHOD: POST
  PATH: /pages/:id/contents
  REQUIRED PARAMETERS IN PATH: id
  OPTIONAL PARAMETERS IN PATH: none
  REQUIRED PARAMETERS: id
  RESPONSE: return array
  */

/**
 * @api {post} /pages/:id/contents Insert content
 * @apiVersion 1.0.0
 * @apiName insertContent
 * @apiGroup Page
 * @apiDescription Insert single content element in page
 * @apiParam (Path params) {string} id Page ID
 * @apiParam (Body params) {String} storyId Story ID
 * @apiParam (Body params) {String} order Page order
 * @apiParam (Body params) {Object} content Page content
 * @apiParam (Body params) {String} content.type Content type
 * @apiParam (Body params) {Binary} files Page files
 * @apiUse authorization
 * @apiUse insertContentResponse
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 */
router.post('/pages/:id/contents', authMiddleware.authentication, plan, pageRtr.insertContentElement) //TODO: apidoc sta za files kako to da se predstavi u dokumentaciji

// ! remove single content element
/*
  METHOD: POST
  PATH: /pages/:id/contents
  REQUIRED PARAMETERS IN PATH: id
  OPTIONAL PARAMETERS IN PATH: none
  REQUIRED PARAMETERS: id
  RESPONSE: return array
  */

/**
 * @api {put} /pages/:id/contents Remove content
 * @apiVersion 1.0.0
 * @apiName removeContent
 * @apiGroup Page
 * @apiDescription Remove single content element
 * @apiParam (Path params) {string} id Page ID
 * @apiParam (body params) {String} contentId content ID
 * @apiUse authorization
 * @apiUse insertContentResponse
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 */
router.put('/pages/:id/contents', authMiddleware.authentication, pageRtr.removeContentElement)

// ! delete page
/*
  METHOD: POST
  PATH: /pages/:id
  REQUIRED PARAMETERS IN PATH: id
  OPTIONAL PARAMETERS IN PATH: none
  REQUIRED PARAMETERS: id
  RESPONSE: return array
  */

/**
 * @api {post} /pages/:id/delete Delete page
 * @apiVersion 1.0.0
 * @apiName deletePage
 * @apiGroup Page
 * @apiDescription Delete page
 * @apiParam (Body params) {String} id Page ID
 * @apiParam (Body params) {String} storyId Story ID
 * @apiUse authorization
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": true,
 *       "message": "You successfully deleted page",
 *       "data": "5cbdd052e5c56318868e0713"
 *     }
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 */
router.post('/pages/:id/delete', authMiddleware.authentication, pageRtr.deletePage)

/*************************************************/
/******************** | GET | ********************/
/*************************************************/

// ! Page by id
/**
 * @api {get} /pages/:id  Page by ID
 * @apiVersion 1.0.0
 * @apiName pageById
 * @apiGroup Page
 * @apiDescription Get page details by page ID
 * @apiParam (Path params) {String} id Page ID
 * @apiUse authorization
 * @apiUse pageBasic
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 */
router.get('/pages/:id', authMiddleware.authentication, GQLParamSetter, graphQLRouter)

export default router
