/**
 * @file Handler for activities collection
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

// Models
import { Activity } from '../models/activity'

/**
 * Save activity
 * @param {Object} input
 * @returns {Object} Activity model
 */
export const saveActivity = async (input) => {
  try {
    let now = new Date()
    let values = {
      author: input.author || null,
      active: input.active || true,
      created: input.created || now,
      updated: input.updated || now,
      timestamp: input.timestamp || now.getTime(),
      data: input.data,
      type: input.type
    }
    let result = await Activity.create(values)

    return result

  } catch (err) {
    return err
  }
}
