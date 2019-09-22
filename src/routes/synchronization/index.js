/**
 * @file Synchronization routes
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import express from 'express'
const router = express.Router()

// Middleware
import { authentication } from '../../middleware/auth'

// Router
import { sync, syncPlan } from './sync'

// ! Synchronize data

/**
 * @api {post} /sync  Data synchronization
 * @apiVersion 1.2.0
 * @apiName sync
 * @apiGroup Sync
 * @apiDescription Synchronize data
 * @apiParam {Date} lastSync Last synchronization date
 * @apiParam {String[]} storyIds List of story IDs for synchronization
 * @apiParam {String} plan Subscription plan
 * @apiUse authorization
 * @apiUse syncResponse
 * @apiUse internalServerError
 * @apiUse unprocessableEntity
 * @apiUse unauthorized
 */
router.post('/sync', authentication, sync)

// ! Synchronize plan
/**
 * @api {post} /sync/plan Subscription and data usage
 * @apiVersion 1.0.0
 * @apiName syncPlan
 * @apiGroup Sync
 * @apiDescription Synchronize users subscription and data usage
 * @apiParam {Number} storage Data usage
 * @apiParam {String} plan Subscription plan
 * @apiUse authorization
 * @apiUse syncPlanResponse
 * @apiUse internalServerError
 * @apiUse unprocessableEntity
 * @apiUse badRequest
 * @apiUse unauthorized
 */
router.post('/sync/plan', authentication, syncPlan)

export default router
