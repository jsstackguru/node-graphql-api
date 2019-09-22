import config from '../../config'
import gq from '../graphQueriesVars'


export const storyQueries = {
  // My stories
  '/v1/stories/my': (_params, {
    deleted = false,
    search = '',
    sort = config.paginate.sort,
    page = config.paginate.page,
    limit = config.paginate.limit
  }) => {
    return `
      query {
        myStories(deleted: "${deleted}" search:"${search}", sort: "${sort}", page: ${page}, limit: ${limit}) {
          docs {
            ${gq.story.basic}
          }
          total
          limit
          page
          pages
        }
      }`
  },
  // My collaboration
  '/v1/stories/collaboration': (_params, {
    search = '',
    sort = config.paginate.sort,
    page = config.paginate.page,
    limit = config.paginate.limit
  }) => {
    return `
      query {
        myCollaboration(search:"${search}", sort: "${sort}", page: ${page}, limit: ${limit}) {
          docs {
            ${gq.story.basic}
          }
          total
          limit
          page
          pages
        }
      }`
  },
  // My feed
  '/v1/stories/feed': (_params, {
    search = '',
    sort = config.paginate.sort,
    page = config.paginate.page,
    limit = config.paginate.limit
  }) => {
    return `
      query {
        myFeed(search:"${search}", sort: "${sort}", page: ${page}, limit: ${limit}) {
          docs {
            ${gq.story.basic}
          }
          total
          limit
          page
          pages
        }
      }`
  },
  // Story by ID
  '/v1/stories/:id': ({id}) => {
    return `
      query {
        story(id: "${id}") {
          ${gq.story.details}
        }
      }`
  },
  '/v1/stories/:id/pages': ({id}) => {
    return `
      query {
        story(id: "${id}") {
          pages {
            ${gq.page.storyPages}
          }
        }
      }`
  },
  // Favorites
  '/v1/stories/favorites': (_params, {
    sort = config.paginate.sort,
    page = config.paginate.page,
    limit = config.paginate.limit
  }) => {
    return `
      query {
        favorites(sort: "${sort}", page: ${page}, limit: ${limit}) {
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
  '/v1/stories/:id/collaborators': (_params, {
    search = '',
    sort = config.paginate.sort,
    page = config.paginate.page,
    limit = config.paginate.limit
  }) => {
    return `
      query {
        searchCollaborators(id: "${_params.id}", search: "${search}", sort: "${sort}", page: ${page}, limit: ${limit}) {
          docs {
            _id
            edit
            name
            username
            email
            avatar
            canInvite
          }
          total
          limit
          page
          pages
        }
      }
    `
  },

  '/v1/stories/:id/pending-collaborators': (_params, {
    search = '',
    sort = config.paginate.sort,
    page = config.paginate.page,
    limit = config.paginate.limit
  }) => {
    return `
      query {
        pendingCollaborators(id: "${_params.id}", search: "${search}", sort: "${sort}", page: ${page}, limit: ${limit}) {
          docs {
            _id
            edit
            name
            username
            email
            avatar
            canInvite
          }
          total
          limit
          page
          pages
        }
      }
    `
  }
}
