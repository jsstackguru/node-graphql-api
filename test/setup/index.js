/**
 * @file Init before tests
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import {fixtures, drop} from '../setup/database'
import server from './server'

/**
 * Init before tests function
 */
export const initBefore = async () => {
  try {
    // import fixtures
    await fixtures()
  } catch (err) {
    throw err
  }
}

/**
 * Init after tests function
 */
export const initAfter = async () => {
  try {
    // empty database
    await drop()
  } catch (e) {
    throw e
  }
}

export { server }
