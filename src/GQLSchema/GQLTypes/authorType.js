/* eslint-disable camelcase */
// GQL objects types
import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString
} from 'graphql'
// models
import Author from '../../models/author/author.model'
import Story from '../../models/story/story.model'
import Following from '../../models/following/following.model'
// GQL types
import { StoryTypePaginate } from './storyType'
// services
import { paginateOptions, sortConverter } from '../GQLHandles'
import config from '../../config'

export const AuthorType = new GraphQLObjectType({
  name: 'AuthorType',
  description: 'AuthorType includes all author properties with added records, followers and authors that user follows',
  fields: () => ({
    _id: { type: GraphQLID },
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    avatar: { type: GraphQLString },
    bio: { type: GraphQLString },
    admin: { type: GraphQLString },
    active: { type: GraphQLString },
    location: { type: AuthorLocationType },
    notif: { type: AuthorNotifType },
    firstTime: { type: GraphQLString },
    deleted: { type: GraphQLString },
    created: { type: GraphQLString },
    pushNotif: { type: AuthorPushNotifType },
    lastActivityCheck: { type: AuthorLastActivityCheckType },
    storage: { type: AuthorStorageType },
    plan: { type: AuthorPlanType },
    stories: {
      description: 'Get all stories and its properties for current author with pagination',
      type: StoryTypePaginate,
      args: {
        page: { type: GraphQLInt },
        limit: { type: GraphQLInt },
        sort: { type: GraphQLString }
      },
      async resolve(author, {page, limit, sort}, req) {
        try {
          const userId = req.user._id
          const authorId = author._id
          const query = {
            $and: [
              { author: authorId },
              {
                $or: [
                  { collaborators: {author: userId} },
                  { status: 'public' },
                ]
              }
            ]
          }
          return await Story.paginate(query, paginateOptions(page, limit, sortConverter(sort)))
        } catch(err) {
          return err
        }
      }
    },
    shareLink: {
      description: 'Generated link to the Author by website',
      type: GraphQLString,
      resolve: author => {
        const shareLink = `${config.website.baseUrl}/${author.username}`
        return shareLink
      }
    },
    follow: {
      type: GraphQLString,
      args: {},
      // eslint-disable-next-line no-empty-pattern
      async resolve(author, {}, req) {
        const user = req.user
        // find does story's author is followed
        const following = await Following.findOne({
          author: user._id,
          follows: author.id,
          active: true
        })
        return following ? true : false
      }
    }, // This property is used only with AuthorSearch root query
    following: {
      type: AuthorTypePaginate,
      args: {
        page: { type: GraphQLInt },
        limit: { type: GraphQLInt },
        sort: { type: GraphQLString }
      },
      async resolve(author, {page, limit, sort} ) {
        try {
          // find all following
          let allFollowing = await Following.find({ author: author._id })
          // extract only ID's
          let followingIds = allFollowing.map(f => f['follows'])
          let query = { _id: followingIds }
          let authors = await Author.paginate(
            query,
            paginateOptions(page, limit, sortConverter(sort))
          )

          return authors

        } catch(err) {
          return err
        }
      }
    },
    followers: {
      type: AuthorTypePaginate,
      args: {
        page: { type: GraphQLInt },
        limit: { type: GraphQLInt },
        sort: { type: GraphQLString }
      },
      async resolve(author, {page, limit, sort}) {
        try {
          // find all followers
          let allFollowers = await Following.find({ follows: author._id })
          // Extract only ID's
          let followers = allFollowers.map(f => f['author'])
          let query = { _id: followers }
          let authors = await Author.paginate(
            query,
            paginateOptions(page, limit, sortConverter(sort))
          )

          return authors

        } catch (err) {
          return err
        }
      }
    },
    isFollowed: {
      type: GraphQLBoolean,
      args: {},
      // eslint-disable-next-line no-empty-pattern
      async resolve(author, {}, req) {
        const user = req.user
        if (user) {
          // find does story's author is followed
          const following = await Following.findOne({
            author: user._id,
            follows: author.id,
            active: true
          })
          return following ? true : false
        }
        return false
      }
    }, // This property is used only with AuthorSearch root query
    isFollowing: {
      type: GraphQLString,
      args: {},
      // eslint-disable-next-line no-empty-pattern
      async resolve(author, {}, req) {
        const user = req.user
        // find does story's author is followed
        if (user) {
          const following = await Following.findOne({
            author: author.id,
            follows: user._id,
            active: true
          })
          return following ? true : false
        }
        return false
      }
    } // This property is used only with AuthorSearch root query
  })
})

/* SUB TYPES */

export const AuthorLastActivityCheckType = new GraphQLObjectType({
  name: 'AuthorLastActivityCheckType',
  fields: () => ({
    collaboration: { type: GraphQLString },
    social: { type: GraphQLString },
    timeline: { type: GraphQLString }
  })
})

export const AuthorStorageType= new GraphQLObjectType({
  name: 'AuthorStorageType',
  fields: () => ({
    usage: { type: GraphQLInt },
  })
})

export const AuthorPlanType = new GraphQLObjectType({
  name: 'AuthorPlanType',
  fields: () => ({
    level: { type: GraphQLString },
    expires: { type: GraphQLInt },
  })
})

export const AuthorLocationType = new GraphQLObjectType({
  name: 'AuthorLocationType',
  fields: () => ({
    name: { type: GraphQLString },
    lon: { type: GraphQLString },
    lat: { type: GraphQLString },
  })
})

export const AuthorPushNotifType = new GraphQLObjectType({
  name: 'AuthorPushNotifType',
  fields: () => ({
    newStoryShare: { type: GraphQLString },
    newStoryPublic: { type: GraphQLString },
    newFollower: { type: GraphQLString },
    newComment: { type: GraphQLString },
  })
})

export const AuthorNotifType = new GraphQLObjectType({
  name: 'AuthorNotifType',
  fields: () => ({
    collaboration: {
      type: new GraphQLObjectType({
        name: 'AutorNotifCollaborationType',
        fields: {
          userLeavesStory: { type: GraphQLString },
          removedFromStory: { type: GraphQLString },
          storyUpdates: { type: GraphQLString },
          newCollaborator: { type: GraphQLString },
          invitations: { type: GraphQLString },
        }
      })
    },
    social: {
      type: new GraphQLObjectType({
        name: 'AuthorNotifSocialType',
        fields: {
          newFollower: { type: GraphQLString },
          comments: { type: GraphQLString },
          favoriteYourStory: { type: GraphQLString },
          sharedStory: { type: GraphQLString },
          friendStoryUpdates: { type: GraphQLString },
          friendNewStory: { type: GraphQLString },
          newFriend: { type: GraphQLString }
        }
      })
    }
  })
})

/* OTHER AUTHOR TYPES */

// TODO: difference between authorprofile type and author type is followed and followings props, maybe to to include in author type followed and followings props that have type INT
// TODO: update ... it can be deleted author has pagination on followers and following...
export const AuthorProfileType = new GraphQLObjectType({
  name: 'AuthorProfile',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    avatar: { type: GraphQLString },
    bio: { type: GraphQLString },
    username: { type: GraphQLString },
    stories: {
      type: StoryTypePaginate,
      args: {
        page: { type: GraphQLInt },
        limit: { type: GraphQLInt },
        sort: { type: GraphQLString }
      },
      async resolve(author, {page, limit, sort}) {
        try {

          let query = {
            author: author._id,
            deleted: false,
            active: true
          }

          return await Story.paginate(query, paginateOptions(page, limit, sortConverter(sort)))

        } catch(err) {
          return err
        }
      }
    },//TODO: stories field se ponavlja, rešiti!
    followers: { type: GraphQLInt },
    following: { type: GraphQLInt },
    shareLink: { type: GraphQLString, resolve(author) {
      return `${config.website.baseUrl}/${author.username}`
    } }
  })

})

// AuthorType with pagination
export const AuthorTypePaginate = new GraphQLObjectType({
  name: 'AuthorTypePaginate',
  fields: () => ({
    docs: { type: new GraphQLList(AuthorType) },
    total: { type: GraphQLInt },
    limit: { type: GraphQLInt },
    page: { type: GraphQLInt },
    pages: { type: GraphQLInt },
  })
})

export const AuthorStorySearchType = new GraphQLObjectType({
  name: 'AuthorStorySearchType',
  fields: () => ({
    stories: { type: StoryTypePaginate },
    authors: { type: AuthorTypePaginate }
  })
})
