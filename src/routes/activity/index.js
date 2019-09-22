
import express from 'express'
const router = express.Router()
import activitiesRtr from './activities.routes'
// middleware
import authMiddleware from '../../middleware/auth'
import { GQLParamSetter } from '../../middleware/GQLParamSetter'
import graphQLRouter from '../graph-rest.gateway'

// ! Save last activity check
/*
  METHOD: POST
  PATH: /authors/:id/activities
  REQUIRED PARAMETERS IN PATH: authors Id
  OPTIONAL PARAMETERS IN PATH: none
  REQUIRED PARAMETERS: newActivityCheck
  OPTIONAL PARAMETERS: none
  RESPONSE: return object
  */

/**
 * @api {post} /authors/:id/activities Save activities check
 * @apiName SaveActivitiesCheck
 * @apiGroup Activities
 * @apiDescription Save last time activities are checked by user
 * @apiParam (Body params) {String} timeline  new activity Date for timeline
 * @apiParam (Body params) {String} social  new activity Date for social
 * @apiParam (Body params) {String} collaboration new activity Date for collaboration
 * @apiParam (Query params) {String} id Author ID
 * @apiUse authorization
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      status: true,
 *      message: "You successfully update activites"
 *    }
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 */
router.post('/authors/:id/activities', authMiddleware.authentication, activitiesRtr.saveLastActivitiesCheck)

/*************************************************/
/******************** | GET | ********************/
/*************************************************/

// ! Check new activities
/**
 * @api {get} /activities/check  Check new activites
 * @apiVersion 1.0.0
 * @apiName CheckNewActivities
 * @apiGroup Activities
 * @apiDescription Check for new Activities.
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *        "timeline": 4,
 *        "social": 2,
 *        "collaboration": 4
 *      }
 *    }
 * @apiUse authorization
 * @apiUse internalServerError
 * @apiUse unauthorized
 */
router.get('/activities/check', authMiddleware.authentication, GQLParamSetter, graphQLRouter)

// ! Check new comments
/**
 * @api {get} /activities/comments  Check new comments
 * @apiVersion 1.2.0
 * @apiName CheckNewComments
 * @apiGroup Activities
 * @apiDescription Check for new Comments
 * @apiUse checkNewCommentsResponse
 * @apiUse authorization
 * @apiUse internalServerError
 * @apiUse unauthorized
 */
router.get('/activities/comments', authMiddleware.authentication, GQLParamSetter, graphQLRouter)

// ! Check new followers
/**
 * @api {get} /activities/followers  Check new followers
 * @apiVersion 1.2.0
 * @apiName CheckNewFollowers
 * @apiGroup Activities
 * @apiDescription Check for new Followers
 * @apiUse paginationParams
 * @apiUse checkNewFollowersResponse
 * @apiUse authorization
 * @apiUse internalServerError
 * @apiUse unauthorized
 */
router.get('/activities/followers', authMiddleware.authentication, GQLParamSetter, graphQLRouter)

// ! Check new collaboration invites
/**
 * @api {get} /activities/invites  Check new invites
 * @apiVersion 1.2.0
 * @apiName CheckNewInvites
 * @apiGroup Activities
 * @apiDescription Check for new collaboration invites
 * @apiUse paginationParams
 * @apiUse checkNewInvitesResponse
 * @apiUse authorization
 * @apiUse internalServerError
 * @apiUse unauthorized
 */
router.get('/activities/invites', authMiddleware.authentication, GQLParamSetter, graphQLRouter)

// ! Check new timeline activities
/**
 * @api {get} /activities/timeline Check new timeline activities
 * @apiVersion 1.2.0
 * @apiName CheckNewTimeline
 * @apiGroup Activities
 * @apiDescription Check for new timeline activities
 * @apiUse paginationParams
 * @apiUse ContentsFiltersParams
 * @apiUse activitiesTimelineResponse
 * @apiUse authorization
 * @apiUse internalServerError
 * @apiUse unauthorized
 */
router.get('/activities/timeline', authMiddleware.authentication, GQLParamSetter, graphQLRouter)

// ! Check new collaboration activities
/**
 * @api {get} /activities/collaboration Check new collaboration activities
 * @apiVersion 1.2.0
 * @apiName CheckNewCollaboration
 * @apiGroup Activities
 * @apiDescription Check for new collaboration activities
 * @apiUse paginationParams
 * @apiUse activitiesCollaborationResponse
 * @apiUse authorization
 * @apiUse internalServerError
 * @apiUse unauthorized
 */
router.get('/activities/collaboration', authMiddleware.authentication, GQLParamSetter, graphQLRouter)

// ! Check new social activities //TODO: finish this
/**
 * @api {get} /activities/social Check new social activities
 * @apiVersion 1.2.0
 * @apiName CheckNewSocial
 * @apiGroup Activities
 * @apiDescription Check for new social activities
 * @apiUse paginationParams
 * @apiUse activitiesSocialResponse
 * @apiUse authorization
 * @apiUse internalServerError
 * @apiUse unauthorized
 */
router.get('/activities/social', authMiddleware.authentication, GQLParamSetter, graphQLRouter)

export default router
