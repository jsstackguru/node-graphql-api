// Services
import translate from '../lib/translate'
// errors
import { BadRequest } from '../lib/errors/index'
// utils
import {isObjEmpty} from '../lib/utils'
// graphql
import { graphql } from 'graphql'
import schema from '../GQLSchema/schema'

/**
 * Repack GraphQL response
 * This function repack graphql response in a way that it remove name of the GQL query in object
 * and immediately shorten response by one nesting (GQL) prop
 *
 * @param {Array} response
 * @returns {Array}
 */
export const repackGQLresponse = (response) => {
  if (response && response.data && !isObjEmpty(response.data)) {
    let numberOfKeys = Object.keys(response.data).length
    let key = Object.keys(response.data)[0]
    // if more then one query return all, otherwise repack
    return { data: numberOfKeys === 1 ? response.data[key] : response.data}
  }
  return null
}

/**
 * Wrapper function for graphql Object
 * Used only for convinience and multiple args
 */
const graphQLWrap = (q, context, vars) => {
  return graphql(schema, q, null, context, vars)
}

/**
 * graphQLRouter middleware function
 *
 * @param {function} req
 * @param {function} res
 * @param {function} next
 * @returns {Promise}
 */
const graphQLRouter = async (req, res, next) => {
  try {

    const query = req.locals.query
    const response = await graphQLWrap(query, { user: req.effectiveUser })
    const newResponse = repackGQLresponse(response)

    if (response.errors) { //TODO: dynamicly choose error!!!
      throw new BadRequest(translate.__(response.errors[0]['message']))
    }
    res.send(newResponse)

  } catch (err) {
    return next(err)
  }
}

export default graphQLRouter
