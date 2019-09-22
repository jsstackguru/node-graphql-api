
import express from 'express'
const router = express.Router()
import * as storyRtr from './story.routes'
import { authentication } from '../../middleware/auth'
import responseMiddleware from '../../middleware/response'
import { GQLParamSetter } from '../../middleware/GQLParamSetter'
import graphQLRouter from '../graph-rest.gateway'
import { plan } from '../../middleware/plan'

/**
 * @api {post} /stories  Create story
 * @apiName createStory
 * @apiVersion 1.1.0
 * @apiGroup Story
 * @apiDescription Create story by user
 * @apiParam (Body params) {String} title  Story title
 * @apiParam (Body params) {String} privacy_type Story privacy type
 * @apiParam (Body params) {Object} files files
 * @apiParam (Body params) {Binary} [files.cover] Story cover
 * @apiParam (Body params) {Binary} [files.pageCover] Page cover
 * @apiParam (Body params) {Object[]} [collaborators] Story collaborators
 * @apiParam (Body params) {String} collaborators.author Collaborator ID
 * @apiParam (Body params) {String} collaborators.edit Collaborator edit privileges
 * @apiParam (Body params) {Object} page Page on Story
 * @apiParam (Body params) {String} page.title Page title
 * @apiParam (Body params) {String} [page.dateFrom] Start date
 * @apiParam (Body params) {String} [page.dateTo]  End date
 * @apiParam (Body params) {Object} [page.place] Page location
 * @apiParam (Body params) {String} [page.place.id] Location ID from Google Maps
 * @apiParam (Body params) {String} [page.place.name] Location name
 * @apiParam (Body params) {String} [page.place.lat] Location latitude coordinates
 * @apiParam (Body params) {String} [page.place.log] Location longitude coordinates
 * @apiParam (Body params) {String} matchId Unique ID for the page
 * @apiParam (Body params) {Object} content Page content
 * @apiUse authorization
 * @apiUse storyCreateResponse
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 */
router.post('/stories', authentication, plan, responseMiddleware.sendV3, storyRtr.create)

/**
 * @api {put} /stories  Update story
 * @apiVersion 1.2.0
 * @apiName updateStory
 * @apiGroup Story
 * @apiDescription Update story by user
 * @apiParam (Body params) {String} id  Story ID
 * @apiParam (Body params) {String} title  Story title
 * @apiParam (Body params) {Object} files files
 * @apiParam (Body params) {Binary} [files.cover] Story cover
 * @apiParam (Body params) {Array} pageIds List of page IDs
 * @apiUse authorization
 * @apiUse storyUpdateResponse
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 */
router.put('/stories', authentication, plan, responseMiddleware.sendV3, storyRtr.update)

// export content as backup
/*
  METHOD: POST
  PATH: /export/preview
  REQUIRED PARAMETERS IN PATH: none
  OPTIONAL PARAMETERS IN PATH: none
  REQUIRED PARAMETERS: preview
  OPTIONAL PARAMETERS: none
  RESPONSE: return array
 */
router.post('/export/preview', authentication, storyRtr.exportPreview)

// export and download content as backup
/*
  METHOD: POST
  PATH: /export/preview
  REQUIRED PARAMETERS IN PATH: none
  OPTIONAL PARAMETERS IN PATH: none
  REQUIRED PARAMETERS: preview
  OPTIONAL PARAMETERS: none
  RESPONSE: return array
  */
router.post('/export/download', authentication, storyRtr.exportDownload)

// set share settings for the story
/**
 * @api {post} /stories/set-privacy  Set privacy
 * @apiVersion 1.0.0
 * @apiName deleteStory
 * @apiGroup Story
 * @apiDescription Set privacy and share settings for the Story
 * @apiUse authorization
 * @apiUse setShareResponse
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 */
router.post('/stories/set-privacy', authentication, storyRtr.setShare)

// set story as a favorite //TODO: check this!!!
/**
 * @api {post} /stories/:id/favorite  Set story as a favorite
 * @apiVersion 1.0.0
 * @apiName favoriteStory
 * @apiGroup Story
 * @apiDescription Set the Story as a favorite for user
 * @apiUse authorization
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *      status: true,
 *      message: "The Story has been set as a favorite"
 *    }
 */
router.post('/stories/:id/favorite', authentication, storyRtr.setFavorite)

// remove Story from favorite
/**
 * @api {delete} /stories/:id/favorite  Remove Story from favorites
 * @apiVersion 1.0.0
 * @apiName noFavoriteStory
 * @apiGroup Story
 * @apiDescription Remove the Story from user's favorite Stories
 * @apiUse authorization
 * @apiParam (Body params) {String} id story ID
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *      data: true,
 *      message: "The Story has been removed from favorites",
 *      story: 1234567890
 *    }
 */
router.delete('/stories/:id/favorite', authentication, storyRtr.unsetFavorite)

/*************************************************/
/******************** | GET | ********************/
/*************************************************/

// ! My stories

/**
 * @api {get} /stories/my  My stories
 * @apiVersion 1.0.0
 * @apiName MyStories
 * @apiGroup Story
 * @apiDescription Fetch all stories where user is the author.
 * @apiParam (Query params) {Boolean} [deleted=false] Get deleted stories using this filter
 * @apiParam (Query params) {Boolean} [search=""] Search stories by title
 * @apiUse paginationParams
 * @apiUse authorization
 * @apiUse storiesBasicPagination
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 */
router.get('/stories/my', authentication, GQLParamSetter, graphQLRouter)

// ! My collaboration

/**
 * @api {get} /stories/collaboration  My collaboration
 * @apiVersion 1.0.0
 * @apiName MyCollaboration
 * @apiGroup Story
 * @apiDescription Fetch all stories where user is the coauthor.
 * @apiParam (Query params) {Boolean} [search=""] Search stories by title
 * @apiUse paginationParams
 * @apiUse authorization
 * @apiUse storiesBasicPagination
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 */
router.get('/stories/collaboration', authentication, GQLParamSetter, graphQLRouter)

// ! My feed

/**
 * @api {get} /stories/feed  My feed
 * @apiVersion 1.0.0
 * @apiName MyFeed
 * @apiGroup Story
 * @apiDescription Get Stories shared with me (Stories which author internally shared with user) and
 *                 public Stories created by authors followed by user
 * @apiParam (Query params) {Boolean} [search=""] Search stories by title
 * @apiUse paginationParams
 * @apiUse authorization
 * @apiUse storiesBasicPagination
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 */
router.get('/stories/feed', authentication, GQLParamSetter, graphQLRouter)

// ! Story by id

/**
 * @api {get} /stories/:id  Story by ID
 * @apiName storyById
 * @apiVersion 1.2.0
 * @apiGroup Story
 * @apiDescription Get story by ID
 * @apiParam (Path params) {String} id Story ID
 * @apiUse authorization
 * @apiUse storyDetails
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 */
router.get('/stories/:id', authentication, GQLParamSetter, graphQLRouter)

// ! Pages from story

/**
 * @api {get} /stories/:id/pages  Pages from Story by ID
 * @apiName storyPagesById
 * @apiVersion 1.2.0
 * @apiGroup Story
 * @apiDescription Get a pages from story by ID
 * @apiParam (Path params) {String} id Story ID
 * @apiUse authorization
 * @apiUse storyPagesList
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 */
router.get('/stories/:id/pages', authentication, GQLParamSetter, graphQLRouter)

// ! Get favorites

/**
 * @api {get} /stories/favorites  Get favorite Stories
 * @apiVersion 1.0.0
 * @apiName favorites
 * @apiGroup Story
 * @apiDescription Get a of favorite stories by author
 * @apiUse authorization
 * @apiUse storiesBasicPagination
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 */
router.get('/stories/favorites', authentication, GQLParamSetter, graphQLRouter)

// ! Get and search collaborators

/**
 * @api {get} /stories/:id/collaborators  Get and search collaborators on the story
 * @apiVersion 1.2.0
 * @apiName storyCollaborators
 * @apiGroup Story
 * @apiDescription Get and search collaborators on the story
 * @apiUse authorization
 * @apiUse storyCollaboratorsResponse
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 */
router.get('/stories/:id/collaborators', authentication, GQLParamSetter, graphQLRouter)

/**
 * @api {get} /stories/:id/pending-collaborators  Get and search peding collaborators on the story
 * @apiVersion 1.2.0
 * @apiName storyCollaborators
 * @apiGroup Story
 * @apiDescription Get and search pending collaborators on the story
 * @apiUse authorization
 * @apiUse storyCollaboratorsResponse
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 */
router.get('/stories/:id/pending-collaborators', authentication, GQLParamSetter, graphQLRouter)

/****************************************************/
/******************** | DELETE | ********************/
/****************************************************/

/**
 * @api {delete} /stories/:id  Delete story
 * @apiVersion 1.2.0
 * @apiName deleteStory
 * @apiGroup Story
 * @apiDescription Delete story
 * @apiUse authorization
 * @apiParam (Body params) {String} id story ID
 * @apiUse authorization
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *      data: "1234567890123",
 *      message: "The Story has been deleted"
 *    }
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 */
router.delete('/stories/:id', authentication, responseMiddleware.sendV3, storyRtr.deleteStory)

export default router
