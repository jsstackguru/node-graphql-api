/**
 * @file Author routes
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import express from 'express'
const router = express.Router()

// router handlers
import * as authorRtr from './author.routes'

// middlewares
import { authentication } from '../../middleware/auth'
import responseMiddleware from '../../middleware/response'
import { GQLParamSetter } from '../../middleware/GQLParamSetter'
import graphQLRouter from '../graph-rest.gateway'

// ! create user with username, email and password

/**
 * @api {post} /register Register new user
 * @apiVersion 1.0.0
 * @apiName register
 * @apiGroup Author
 * @apiDescription User must provide username and email address, password, password confirmation
 * @apiParam (Body prams) {String} [invitationToken] Token for confirming group invitation
 * @apiParam (Body prams) {Object} user
 * @apiParam (Body prams) {String} user.username User's username
 * @apiParam (Body prams) {String} [user.name] User's name
 * @apiParam (Body prams) {String} user.email User's email
 * @apiParam (Body prams) {String} user.password User's password
 * @apiParam (Body prams) {String} user.passwordConfirmation User's password confirmation
 * @apiUse authorRegistrationResponse
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unprocessableEntity
 */
router.post('/register', authorRtr.singUp)

// ! Login user with credentials

/**
 * @api {post} /login Login user
 * @apiVersion 1.0.0
 * @apiName login
 * @apiGroup Author
 * @apiDescription User must provide email and password
 * @apiParam (Body params) {String} email User's email
 * @apiParam (Body params) {String} password User's password
 * @apiUse authorLoginResponse
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unprocessableEntity
 */
router.post('/login', authorRtr.singIn)

// ! Forgot password
// send reset link on email

/**
 * @api {post} /forgot-password Forgot password
 * @apiVersion 1.0.0
 * @apiName forgotPassword
 * @apiGroup Author
 * @apiDescription Forgot password for user. User must provide email, if exist in database email with link for password reset will be sent on entered email
 * @apiParam (Body params){String} email User's email
 * @apiUse authorization
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "status": true,
 *      "message": "Email link send on email ..."
 *    }
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 */
router.post('/forgot-password', responseMiddleware.sendV3, authorRtr.forgotPassword)

// ! Change password
// send reset link on email
/**
 * @api {post} /change-password Change password
 * @apiVersion 1.0.0
 * @apiName changePassword
 * @apiGroup Author
 * @apiDescription User can change his password by entering old password and new password with password confirmation
 * @apiParam (Body params) {String} oldPassword User's old password
 * @apiParam (Body params) {String} newPassword User's new password
 * @apiParam (Body params) {String} newPasswordConfirmation User's confirmation of new password
 * @apiUse authorization
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": true,
 *       "message": "Password is changed"
 *     }
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 */
router.post('/change-password', authentication, responseMiddleware.sendV3, authorRtr.changePassword)

// ! Refresh token
/**
 * @api {post} /refresh-token Refresh token
 * @apiVersion 1.0.0
 * @apiName refreshToken
 * @apiGroup Author
 * @apiDescription Refresh authorization token when it's expired
 * @apiParam (Body params) {String} email User's email
 * @apiParam (Body params) {String} refreshToken User's refresh token
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *        "token": {
 *        "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
 *          "expired": "2019-05-19T13:54:05.007Z",
 *          "refresh": "dGunTlGJlfQ1RRAQ6sUaox6jmHFDEFeYxtg8ldRGvESmmMWdI727sWz1DFDJ9ET7"
 *        },
 *      }
 *    }
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 */
router.post('/refresh-token', authorRtr.refreshToken)

// ! Update profile
/**
 * @api {post} /authors Update profile
 * @apiVersion 1.0.0
 * @apiName updateProfile
 * @apiGroup Author
 * @apiDescription Update profile by user (name, username, settings)
 * @apiParam (Body params) {String} name User's name
 * @apiParam (Body params) {String} username User's username
 * @apiParam (Body params) {String} bio User's bio
 * @apiParam (Body params) {Binary} avatar User's avatar
 * @apiParam (Body params) {Object} location Location
 * @apiParam (Body params) {String} location.name Location name
 * @apiParam (Body params) {String} location.lat Location latitude
 * @apiParam (Body params) {String} location.lon Location longitude
 * @apiUse authorization
 * @apiUse authorUpdateProfileResponse
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 */
router.post('/authors', authentication, responseMiddleware.sendV3, authorRtr.updateProfile)

// ! Save settings for notifications
/*
  METHOD: POST
  PATH: /authors/notifications
  REQUIRED PARAMETERS IN PATH: none
  OPTIONAL PARAMETERS IN PATH: none
  REQUIRED PARAMETERS: collaboration, social
  OPTIONAL PARAMETERS: none
  RESPONSE: return array
 */

/**
 * @api {post} /authors/notifications Save settings for notifications
 * @apiVersion 1.0.0
 * @apiName saveSettingsNotifications
 * @apiGroup Author
 * @apiDescription Save settings for notifications by user
 * @apiParam (Body params) {Object} collaboration
 * @apiParam (Body params) {String} collaboration.userLeavesStory User leaves story
 * @apiParam (Body params) {String} collaboration.removedFromStory User removed from story
 * @apiParam (Body params) {String} collaboration.storyUpdates Story updates
 * @apiParam (Body params) {String} collaboration.newCollaborator New collaborator
 * @apiParam (Body params) {String} collaboration.invitations Invitations
 * @apiParam (Body params) {Object} social
 * @apiParam (Body params) {String} social.newFollower New follower
 * @apiParam (Body params) {String} social.comments Comments
 * @apiParam (Body params) {String} social.favoritedYourStory Favorited your story
 * @apiParam (Body params) {String} social.sharedStory Shared story
 * @apiParam (Body params) {String} social.friendStoryUpdates Friend story updates
 * @apiParam (Body params) {String} social.friendNewStory Friend new story
 * @apiParam (Body params) {String} social.newFriend New friend
 * @apiUse authorization
 * @apiUse saveSettingNotificationsResponse
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 */
router.post('/authors/notifications', authentication, responseMiddleware.sendV3, authorRtr.saveSettingsNotifications)

// ! Save settings for push notifications
/*
  METHOD: POST
  PATH: /authors/push-notifications
  REQUIRED PARAMETERS IN PATH: none
  OPTIONAL PARAMETERS IN PATH: none
  REQUIRED PARAMETERS: notifications
  OPTIONAL PARAMETERS: none
  RESPONSE: return array
 */

/**
 * @api {post} /authors/push-notifications    Save settings push notifications
 * @apiVersion 1.0.0
 * @apiName saveSettingsPushNotifications
 * @apiGroup Author
 * @apiDescription Save settings for push notifications by user
 * @apiParam (Body params) {String} newStoryShare New story share
 * @apiParam (Body params) {String} newStoryPublic New story public
 * @apiParam (Body params) {String} newFollower New follower
 * @apiParam (Body params) {String} newComment New comment
 * @apiUse authorization
 * @apiUse saveSettingPushNotificationsResponse
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 */
router.post('/authors/push-notifications', authentication, responseMiddleware.sendV3, authorRtr.saveSettingsPushNotifications)

// ! Reset password

/**
 * @api {post} /new-password  Reset password
 * @apiVersion 1.0.0
 * @apiName resetPassword
 * @apiGroup Author
 * @apiDescription Reset password from forgot password email
 * @apiParam (Body params) {String} code Code from the email
 * @apiParam (Body params) {String} password New password
 * @apiParam (Body params) {String} retypedPassword Repeated new password
 * @apiUse authorization
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": true,
 *       "message": "You successfully reset password"
 *     }
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unprocessableEntity
 */
router.post('/new-password', authorRtr.setNewPassword)


/*************************************************/
/******************** | GET | ********************/
/*************************************************/

// Get my profile
/**
 * @api {get} /authors/me  Get my profile
 * @apiVersion 1.2.0
 * @apiName Profile
 * @apiGroup Author
 * @apiDescription Get current author by token
 * @apiUse authorization
 * @apiUse myProfileResponse
 * @apiUse internalServerError
 * @apiUse unauthorized
 */
router.get('/authors/me', authentication, authorRtr.getMyProfile)

// ! Profile by username
/**
 * @api {get} /authors/username/:username  Get a profile by username
 * @apiVersion 1.2.0
 * @apiName Profile
 * @apiGroup Author
 * @apiDescription Get a list of the followings for author by ID
 * @apiUse authorization
 * @apiUse myProfileResponse
 * @apiParam (Path params) {String} username author's username
 * @apiUse internalServerError
 * @apiUse unauthorized
 */
router.get('/authors/username/:username', authorRtr.getProfileByUsername)

// ! Author profile
/**
 * @api {get} /authors/:id  Profile data
 * @apiVersion 1.0.0
 * @apiName AuthorProfile
 * @apiGroup Author
 * @apiDescription Get user's profile data
 * @apiParam (Path params) {String} id author ID
 * @apiUse authorization
 * @apiUse profileResponse
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 */
router.get('/authors/:id', authentication, GQLParamSetter, graphQLRouter)

// ! Authors search
/**
 * @api {get} /authors/search  Author's search
 * @apiVersion 1.2.0
 * @apiName AuthorSearch
 * @apiGroup Author
 * @apiDescription Search authors by name, username and email
 * @apiParam (Query params) {String} search Search for authors name, username and email
 * @apiUse paginationParams
 * @apiUse authorization
 * @apiUse authorsSearchResponse
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 */
router.get('/authors/search', authentication, GQLParamSetter, graphQLRouter)

// ! Author stories
/**
 * @api {get} /authors/:id/stories  Author's stories
 * @apiVersion 1.2.0
 * @apiName AuthorStories
 * @apiGroup Author
 * @apiDescription Get profile data by author ID.
 *                 By default show unlocked Stories by author (created and collaborator).
 *                 If user trying to get own profile then show all Stories by user.
 * @apiParam (Query params) {String=author,collaborator} [filter="author"] Filter response based on author role
 * @apiParam (Path params) {String} id author ID
 * @apiUse paginationParams
 * @apiUse authorization
 * @apiUse storiesBasicPagination
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 */
router.get('/authors/:id/stories', authentication, GQLParamSetter, graphQLRouter)

// ! Storage
/**
 * @api {get} /storage  Author's storage
 * @apiVersion 1.0.0
 * @apiName AuthorsStorage
 * @apiGroup Author
 * @apiDescription Get storage usage for author and family group members.
 * @apiUse authorization
 * @apiUse storageResponse
 * @apiUse internalServerError
 * @apiUse unauthorized
 */
router.get('/storage', authentication, GQLParamSetter, graphQLRouter)

// ! Search
/**
 * @api {get} /search  Search for stories and authors
 * @apiVersion 1.0.0
 * @apiName Search
 * @apiGroup Author
 * @apiDescription Search Stories (only unlocked Stories or Stories user have access for) 
 *                 and Authors (by username, name and email)
 * @apiUse authorization
 * @apiUse searchResponse
 * @apiUse paginationParamsSearch
 * @apiUse internalServerError
 * @apiUse unauthorized
 */
router.get('/search', authentication, GQLParamSetter, graphQLRouter)

// ! Followers
/**
 * @api {get} /authors/:id/followers  Get a list of the followers
 * @apiVersion 1.2.0
 * @apiName Followers
 * @apiGroup Author
 * @apiDescription Get a list of the followers for author by ID
 * @apiUse authorization
 * @apiUse followersResponse
 * @apiParam (Path params) {String} id author ID
 * @apiUse internalServerError
 * @apiUse unauthorized
 */
router.get('/authors/:id/followers', authentication, GQLParamSetter, graphQLRouter)

// ! Followings
/**
 * @api {get} /authors/:id/followings  Get a list of the followings
 * @apiVersion 1.2.0
 * @apiName Followings
 * @apiGroup Author
 * @apiDescription Get a list of the followings for author by ID
 * @apiUse authorization
 * @apiUse followingsResponse
 * @apiParam (Path params) {String} id author ID
 * @apiUse internalServerError
 * @apiUse unauthorized
 */
router.get('/authors/:id/followings', authentication, GQLParamSetter, graphQLRouter)

/****************************************************/
/******************** | DELETE | ********************/
/****************************************************/

// ! Delete author's account
/**
 * @api {delete} /authors/:id  Delete account
 * @apiVersion 1.2.0
 * @apiName deleteAccount
 * @apiGroup Author
 * @apiDescription Delete authors's account
 * @apiParam (Body params) {String} id author ID
 * @apiUse authorization
 * @apiUse deleteAuthorsAccountResponse
 * @apiUse internalServerError
 * @apiUse badRequest
 * @apiUse unauthorized
 * @apiUse unprocessableEntity
 */
router.delete('/authors/:id', authentication, responseMiddleware.sendV3, authorRtr.deleteAccount)

export default router
