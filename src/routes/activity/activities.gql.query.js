import config from '../../config'
import gq from '../graphQueriesVars'

export const activityQueries = {
  // check new activities
  '/v1/activities/check': () => {
    return `
      query {
        checkNewActivities {
          timeline
          social
          collaboration
        }
      }
      `
  },
  // check new followers
  '/v1/activities/followers': (_params, {
    days = config.daysCheck,
    sort = config.paginate.sort,
    page = config.paginate.page,
    limit = config.paginate.limit
  }) => {
    return `
      query {
        newFollowers(days: ${days} page: ${page} sort: "${sort}" limit: ${limit} ) {
          docs {
            ${gq.author.basic}
          }
          total
          limit
          page
          pages
        }
      }
    `
  },
  // check new invites
  '/v1/activities/invites': (_params, {
    days = config.daysCheck,
    sort = config.paginate.sort,
    page = config.paginate.page,
    limit = config.paginate.limit
  }) => {
    return `
      query {
        collaborationInvites(days: ${days}, sort: "${sort}", page: ${page}, limit: ${limit}) {
          docs {
            author {
              ${gq.author.basic}
            }
            invited {
              ${gq.author.basic}
            }
            story {
              ${gq.story.mini}
            }
            created
            _id
          }
          total
          limit
          page
          pages
        }
      }
    `
  },
  // check new comments
  '/v1/activities/comments': () => {
    return `
      query {
        timelineComments {
          total
        }
        newSocialComments {
          total
        }
        newCollaborationComments {
          total
        }
      }
    `
  },
  // check new timeline activities
  '/v1/activities/timeline': (_params, {
    sort = config.paginate.sort,
    page = config.paginate.page,
    limit = config.paginate.limit,
    filter = '["audios", "images", "videos"]'
  }) => {
    return `
      query {
        activityTimeline(filters: ["stories", "contents"], limit: ${limit}, page: ${page} sort: "${sort}") {
          docs {
            author {
              ${gq.author.basic}
            }
            story {
              ${gq.story.mini}
            }
            contents(filters: ${filter})
            type
            created
          }
          total
          limit
          page
          pages
        }
      }
    `
  },
  // check new collaboration activities
  '/v1/activities/collaboration': (_params, {
    sort = config.paginate.sort,
    page = config.paginate.page,
    limit = config.paginate.limit,
  }) => {
    return `
      query {
        activityCollaboration(filters: ["invitations", "stories"], limit: ${limit}, page: ${page}, sort: "${sort}") {
          docs {
            author {
              ${gq.author.basic}
            }
            story {
              ${gq.story.mini}
            }
            collaborator {
              ${gq.author.basic}
            }
            message
            type
            created
          }
          total
          limit
          page
          pages
        }
      }
    `
  },
  // check new social activities
  '/v1/activities/social': (_params, {
    sort = config.paginate.sort,
    page = config.paginate.page,
    limit = config.paginate.limit,
  }) => {
    return `
      query {
        activitySocial(filters: ["stories", "system_message"], limit: ${limit}, sort: "${sort}", page: ${page}) {
          docs {
            author {
              ${gq.author.basic}
            }
            story {
              ${gq.story.mini}
            }
            message
            type
            created
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
