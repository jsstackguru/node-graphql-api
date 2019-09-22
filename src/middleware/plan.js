/**
 * @file Plan middleware
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

// Handles
import authorHndl from '../handles/author.handles'

// Libs
import { UnprocessableEntity } from '../lib/errors'
import translate from '../lib/translate'

/**
 * Plan middleware
 * 
 * @param {Function} req Request
 * @param {Function} res Response
 * @param {Function} next Middleware
 */
export const plan = (req, res, next) => {
  try {
    const user = req.effectiveUser
    const { plan, storage } = user
    const { level } = plan
    const { usage } = storage
    
    if (authorHndl.isPlanOverrun(level, usage)) {
      throw new UnprocessableEntity(translate.__('You are overrun plan storage'))
    }
    
    next()
  } catch (err) {
    return next(err)
  }
}
