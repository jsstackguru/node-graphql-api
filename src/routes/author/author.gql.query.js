import config from '../../config'
import gq from '../graphQueriesVars'

export const authorQueries = {
  // Profile
  '/v1/authors/:id': ({id}) => {
    return `
      query {
        author(id: "${id}") {
          ${gq.author.profile}
        }
      }
      `
  },
  // Profile by username
  '/v1/authors/username/:username': ({username}) => {
    console.log('username', username)
    return `
      query {
        profileUsername(username: "${username}") {
          ${gq.author.profile}
        }
      }
      `
  },
  // Search for authors
  '/v1/authors/search': (_params, {
    search = '',
    sort = config.paginate.sort,
    page = config.paginate.page,
    limit = config.paginate.limit
  }) => {
    return `
      query {
        authorsSearch(search:"${search}", sort: "${sort}", page: ${page}, limit: ${limit}) {
          docs {
            ${gq.author.advanced}
          }
          total
          limit
          page
          pages
        }
      }`
  },
  // Authors stories
  '/v1/authors/:id/stories': ({id}, {
    sort = config.paginate.sort,
    page = config.paginate.page,
    limit = config.paginate.limit,
    filter = 'author'
  }) => {
    return `
      query {
        authorsStories(
          sort: "${sort}", selection: "${filter}", id: "${id}", page: ${page}, limit: ${limit}
          ) {
          docs {
            ${gq.story.basic}
          }
          total
          limit
          page
          pages
        }
      }
    `
  },
  // Storage
  '/v1/storage': () => {
    return `
      query {
        storageJson
      }
    `
  },
  // Search
  '/v1/search': (_params, {
    authorSort = config.paginate.sort,
    authorPage = config.paginate.page,
    authorLimit = config.paginate.limit,
    storySort = config.paginate.sort,
    storyPage = config.paginate.page,
    storyLimit = config.paginate.limit,
    search = ''
  }) => {
    return `
      query {
        search(
          authorSort: "${authorSort}",
          authorPage: ${authorPage},
          authorLimit: ${authorLimit},
          storySort: "${storySort}",
          storyPage: ${storyPage},
          storyLimit: ${storyLimit},
          search: "${search}"
          ) {
            stories {
              docs {
                ${gq.story.search}
              }
              total
              limit
              page
              pages
            }
            authors {
              docs {
                ${gq.author.advanced}
              }
              total
              limit
              page
              pages
            }
          }
      }
    `
  },
  '/v1/authors/:id/followers': ({id}, {
    sort = config.paginate.sort,
    page = config.paginate.page,
    limit = config.paginate.limit,
  }) => {
    return `
      query {
        author(id: "${id}") {
          followers(sort: "${sort}", limit: ${limit}, page: ${page}) {
            docs { ${gq.author.basic} }
            total
            limit
            page
            pages
          }
        }
      }
    `
  },
  '/v1/authors/:id/followings': ({id}, {
    sort = config.paginate.sort,
    page = config.paginate.page,
    limit = config.paginate.limit,
  }) => {
    return `
      query {
        author(id: "${id}") {
          following(sort: "${sort}", limit: ${limit}, page: ${page}) {
            docs { ${gq.author.basic} }
            total
            limit
            page
            pages
          }
        }
      }
    `
  }
}
