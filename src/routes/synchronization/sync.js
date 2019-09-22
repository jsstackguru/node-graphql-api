/**
 * @file Synchronization routes
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

// Handlers
import syncHndl from '../../handles/synchronize.handles'

/**
 * Synchronization
 *
 * @param {Function} req - Request
 * @param {Function} res - Response
 * @param {Function} next - Middleware
 */
export const sync = async (req, res, next) => {
  try {
    const lastSync = req.body.lastSync
    const storyIds = req.body.storyIds
    const user = req.effectiveUser
    const syncDate = lastSync ? new Date(lastSync).toISOString() : user.created

    const response = await syncHndl.synchronize(user, syncDate, storyIds)

    res.send({data: response})

  } catch (err) {
    return next(err)
  }
}

/**
 * Synchronize user's storage and plan
 *
 * @param {Function} req - Request
 * @param {Function} res - Response
 * @param {Function} next - Middleware
 */
export const syncPlan = async (req, res, next) => {
  try {
    const user = req.effectiveUser
    const plan = req.body.plan
    const storage = req.body.storage

    const result = await syncHndl.syncPlan(user.id, plan, storage)

    res.send(result)
  } catch (err) {
    return next(err)
  }
}
