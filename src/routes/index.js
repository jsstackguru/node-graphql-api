/**
 * @file Routes - list of all routes
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import express from 'express'
let router = express.Router()

// import './apiDocsDefine/errors'
import authorRoutes from './author'
import storyRoutes from './story'
import pageRoutes from './page'
import deviceRoutes from './device'
import activityRoutes from './activity'
import commentRoutes from './comment'
import spamRoutes from './spam'
import followingRoutes from './follow'
import collaboratioRoutes from './collaboration'
import groupRoutes from './group'
import sync from './synchronization'

router.use(authorRoutes)
router.use(storyRoutes)
router.use(pageRoutes)
router.use(deviceRoutes)
router.use(activityRoutes)
router.use(commentRoutes)
router.use(spamRoutes)
router.use(followingRoutes)
router.use(collaboratioRoutes)
router.use(groupRoutes)
router.use(sync)

export default router
