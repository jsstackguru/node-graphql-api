/* eslint-disable camelcase */
// models
import Author from '../../models/author/author.model'
import Story from '../../models/story/story.model'
import Page from '../../models/page/page.model'
// GQL types
import { StoryType } from './storyType'
import { AuthorType } from './authorType'
import { PageType } from './pageType'
import GraphQLJSON from 'graphql-type-json'
// services
import { filterContent } from '../GQLHandles'
// GQL objects types
import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt
} from 'graphql'

export const ActivityType = new GraphQLObjectType({
  description:
    `Activity Type, includes all activity props from model,
    Resolve props are: author, story, Collaborator (AuthorType),
    page, contents. You can't query contents props`,
  name: 'Activity',
  fields: () => ({
    author: {
      description: 'activity author',
      type: AuthorType,
      async resolve(activity) {
        try {
          return await Author.findOneActiveById(activity.author)
        } catch (err) {
          return err
        }
      }
    },
    story: {
      description: 'activity story',
      type: StoryType,
      async resolve(activity) {
        try {
          if (activity.data) {
            return await Story.findOneActiveById(activity.data.storyId)
          }
        } catch (err) {
          return err
        }
      }
    },
    collaborator: {
      description: 'activity collaborator',
      type: AuthorType,
      async resolve(activity) {
        try {
          return await Author.findOneActiveById(activity.data.collaboratorId)
        } catch (err) {
          return err
        }
      }
    },
    page: {
      description: 'activity page',
      type: PageType,
      async resolve(activity) {
        try {
          return await Page.findActivePage(activity.data.pageId)
        } catch (err) {
          return err
        }
      }
    },
    contents: {
      description:
        `Page contents, you can't query props on contents.
        Possible filters argument are: "audios, images, videos"`,
      type: new GraphQLList(GraphQLJSON),
      args: {
        filters: { type: new GraphQLList(GraphQLString) }
      },
      async resolve(activity, {filters}) { //TODO: tests
        try {
          const pageId = activity.data.pageId
          const contentsIds = activity.data.contents

          if (!activity.data.contents) {
            return null
          }

          let page = await Page.findActivePage(pageId)

          // filter only content that are included in contentsIds array
          let contents = page['content'].filter(pageContent => {
            // filter content with specific contentID
            return contentsIds.includes(String(pageContent.contentId))
              // filter content type based on input filters
              && filterContent(filters).includes(pageContent.type)
          })

          return contents

        } catch (err) {
          return err
        }
      }
    },
    message: {
      type: GraphQLString,
      resolve(activity) {
        return activity.data.message
      }
    },
    id: { type: GraphQLID },
    _id: { type: GraphQLID },
    created: { type: GraphQLString },
    type: { type: GraphQLString }
  })
})

export const ActivityTabType = new GraphQLObjectType({
  description: 'Activity tab type, refers to three main tabs for activity',
  name: 'ActivityTabType',
  fields: () => ({
    timeline: { type: GraphQLInt },
    social: { type: GraphQLInt },
    collaboration: { type: GraphQLInt }
  })
})

// ActivityType with pagination
export const ActivityTypePaginate = new GraphQLObjectType({
  name: 'ActivityTypePaginate',
  fields: () => ({
    docs: { type: new GraphQLList(ActivityType) },
    total: { type: GraphQLInt },
    limit: { type: GraphQLInt },
    page: { type: GraphQLInt },
    pages: { type: GraphQLInt },
  })
})
