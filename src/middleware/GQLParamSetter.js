
import { authorQueries } from '../routes/author/author.gql.query'
import { storyQueries } from '../routes/story/story.gql.query'
import { pageQueries } from '../routes/page/page.gql.query'
import { commentQueries } from '../routes/comment/comment.gql.query'
import { activityQueries } from '../routes/activity/activities.gql.query'

const queryObj = {}
Object.assign(
  queryObj,
  authorQueries,
  storyQueries,
  pageQueries,
  commentQueries,
  activityQueries
)

/**
 * GraphQL url query component setter middleware
 *
 * @param {function} req
 * @param {function} res
 * @param {function} next
 */
export const GQLParamSetter = (req, res, next) => {
  try {
    // replace params queryObjectID to ':id' and remove query string from url
    const ep = req.originalUrl.replace(/[0-9a-fA-F]{24}/, ':id')
      .replace(/\?.*$/, '')
    if (queryObj[ep]) {
      let urlParams = req.params
      let urlQueries = req.query
      // call dynamically choosen function from queryObj with params nad query args
      let query = queryObj[ep](urlParams, urlQueries)
      // assign query string to req object locals prop
      req.locals = { query }
    }

    next()
  } catch (err) {
    console.log('err', err)
    next()
  }
}
