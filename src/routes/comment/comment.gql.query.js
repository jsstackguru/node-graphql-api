import config from '../../config'
import gq from '../graphQueriesVars'


export const commentQueries = {
  // Comments by pageID
  '/v1/pages/:id/comments': ({id}, {
    sort = config.paginate.sort,
    page = config.paginate.page,
    limit = config.paginate.limit
  }) => {
    return `
      query {
        comments(pageId: "${id}" sort: "${sort}", page: ${page}, limit: ${limit}) {
          docs {
            ${gq.comments.details}
          }
          total
          limit
          page
          pages
        }
      }`
  },
  // Comments by pageID
  '/v1/comments/:id/replies': ({id}, {
    sort = config.paginate.sort,
    page = config.paginate.page,
    limit = config.paginate.limit
  }) => {
    return `
      query {
        replies(commentId: "${id}" sort: "${sort}", page: ${page}, limit: ${limit}) {
          docs {
            ${gq.comments.details}
          }
          total
          limit
          page
          pages
        }
      }`
  }
}
