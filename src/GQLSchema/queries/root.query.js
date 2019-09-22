// GQL objects
import { GraphQLObjectType } from 'graphql'

// GQL queries
import authorQuery from './author.query'
import storyQuery from './story.query'
import pageQuery from './page.query'
import activityQuery from './activity.query'
import accountQuery from './group.query'

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    accountStatus: accountQuery.groupAccount,
    activity: activityQuery.activity,
    activityTimeline: activityQuery.activityTimeline,
    activitySocial: activityQuery.activitySocial,
    activityCollaboration: activityQuery.activityCollaboration,
    author: authorQuery.author,
    authors: authorQuery.authors,
    authorsSearch: authorQuery.authorsSearch,
    authorsStories: storyQuery.authorsStories,
    checkNewActivities: activityQuery.checkNewActivities,
    collaborationInvites: activityQuery.collaborationInvites,
    comments: pageQuery.comments,
    deletedStories: storyQuery.deletedStories,
    favorites: storyQuery.favorites,
    groupInvites: activityQuery.groupInvites,
    myStories: storyQuery.myStories,
    myCollaboration: storyQuery.myCollaboration,
    myFeed: storyQuery.myFeed,
    newCollaborationComments: activityQuery.newCollaborationComments,
    newFollowers: activityQuery.newFollowers, //TODO: maybe change the name of this root query to getFollowersByDays, everywhere
    newSocialComments: activityQuery.newSocialComments,
    page: pageQuery.page,
    pendingCollaborators: storyQuery.pendingCollaborators,
    profile: authorQuery.profile,
    profileUsername: authorQuery.profileUsername,
    replies: pageQuery.replies,
    search: authorQuery.search,
    searchCollaborators: storyQuery.searchCollaborators,
    storage: authorQuery.storage,
    storageJson: authorQuery.storageJson,
    story: storyQuery.story,
    timelineComments: activityQuery.timelineComments
  }
})

export default RootQuery
