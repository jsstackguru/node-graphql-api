// GQL object types
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
import Comment from '../../models/comment/comment.model'
import Page from '../../models/page/page.model'

// GQL types
import { AuthorType } from './authorType'
import { PageType } from './pageType'

// extractors
import { authorExtractor } from '../../models/author'

import config from '../../config'

export const StoryType = new GraphQLObjectType({
  name: 'StoryType',
  fields: () => ({
    _id: { type: GraphQLID },
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    status: { type: GraphQLString },
    deleted: { type: GraphQLString },
    active: { type: GraphQLString },
    created: { type: GraphQLString },
    updated: { type: GraphQLString },
    slug: { type: GraphQLString },
    views: { type: GraphQLInt },
    spam: { type: GraphQLInt },
    shareLink: { type: GraphQLString },
    matchId: { type: GraphQLID }, //TODO: tests
    share: { type: StoryShareType }, //TODO: tests
    author: {
      type: AuthorType,
      resolve(story) {
        return Author.findById(story.author)
      }
    },
    collaborators: {
      description: 'Queries all collaborators properties on current story',
      type: new GraphQLList(StoryCollaboratorsType),
      resolve: (story) => {
        try {
          return story.collaborators

        } catch (err) {
          return err
        }
      }
    },
    pages: {
      type: new GraphQLList(PageType),
      resolve: async (story) => {
        try {
          const pages = story.pages
          const results = await Page.find({_id: pages})
            .populate('author', authorExtractor.basicProperties)
          const storyPages = []
          pages.forEach(pageId => {
            const storyPage = results.find(page => page._id.equals(pageId))
            if (storyPage) {
              storyPages.push(storyPage)
            }
          })
          return storyPages
        } catch (err) {
          return err
        }
      }
    },
    isFavorite: { type: GraphQLBoolean },
    commentsCount: {
      description: 'Queries all comments from pages on Story',
      type: GraphQLInt,
      resolve: async story => {
        const comments = await Comment.find({
          page: { $in: story.pages },
          active: true,
          deleted: false
        })
        return comments.length
      }
    },
    shareLink: {
      description: 'Generated link to the Story by website',
      type: GraphQLString,
      resolve: (story) => {
        const shareLink = `${config.website.baseUrl}/${story.author.username}/story/${story.slug}`
        return shareLink
      }
    },
    edit: {
      description: 'Flag whether is edit enabled for user or not',
      type: GraphQLBoolean,
      // eslint-disable-next-line no-empty-pattern
      resolve: (story, {}, req) => {
        const user = req.user
        return story.author.equals(user._id)
      }
    },
    pagesNumber: {
      description: 'Number of the pages in Story',
      type: GraphQLInt,
      resolve: (story) => {
        return story.pages.length
      }
    },
    theme: { type: StoryThemeType },
  })
})

export const StoryCollaboratorsType = new GraphQLObjectType({
  name: 'Collaborators',
  fields: () => ({
    _id: { type: GraphQLID },
    id: { type: GraphQLID },
    edit: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent) {
        return Author.findOneActiveById(parent.author)
      }
    }
  })
})

export const StoryShareType = new GraphQLObjectType({
  name: 'StoryShareType',
  fields: () => ({
    followers: { type: GraphQLString },
    link: { type: GraphQLString },
    search: { type: GraphQLString }
  })
})

// StoryType with pagination
export const StoryTypePaginate = new GraphQLObjectType({
  name: 'StoryTypePaginate',
  fields: () => ({
    docs: {
      description: 'Docs container',
      type: new GraphQLList(StoryType)
    },
    total: {
      description: 'Total number of documents',
      type: GraphQLInt
    },
    limit: {
      description: 'Number of documents per page',
      type: GraphQLInt
    },
    page: {
      description: 'Current page number',
      type: GraphQLInt },
    pages: {
      description: 'Total number of pages',
      type: GraphQLInt
    },
  })
})

// StoryCollaboratorsType with pagination
export const StoryCollaboratorsTypePaginate = new GraphQLObjectType({
  name: 'StoryCollaboratorsTypePaginate',
  fields: () => ({
    docs: {
      description: 'Docs container',
      type: new GraphQLList(StoryCollaboratorsType)
    },
    total: {
      description: 'Total number of documents',
      type: GraphQLInt
    },
    limit: {
      description: 'Number of documents per page',
      type: GraphQLInt
    },
    page: {
      description: 'Current page number',
      type: GraphQLInt },
    pages: {
      description: 'Total number of pages',
      type: GraphQLInt
    },
  })
})

// StoryCollaboratorsListTypePaginate with pagination
export const StoryCollaboratorsListTypePaginate = new GraphQLObjectType({
  name: 'StoryCollaboratorsListTypePaginate',
  fields: () => ({
    docs: {
      description: 'Docs container',
      type: new GraphQLList(CollaboratorAuthorType)
    },
    total: {
      description: 'Total number of documents',
      type: GraphQLInt
    },
    limit: {
      description: 'Number of documents per page',
      type: GraphQLInt
    },
    page: {
      description: 'Current page number',
      type: GraphQLInt },
    pages: {
      description: 'Total number of pages',
      type: GraphQLInt
    },
  })
})

// CollaboratorAuthorType
export const CollaboratorAuthorType = new GraphQLObjectType({
  name: 'CollaboratorAuthor',
  fields: () => ({
    _id: { type: GraphQLID },
    id: { type: GraphQLID },
    edit: { type: GraphQLBoolean },
    name: { type: GraphQLString },
    username: { type: GraphQLString },
    avatar: { type: GraphQLString },
    email: { type: GraphQLString },
    canInvite: {
      type: GraphQLBoolean,
      resolve(parent) {
        return parent.canInvite
      }
    }
  })
})

/**
 * Story theme type
 */
export const StoryThemeType = new GraphQLObjectType({
  name: 'StoryThemeType',
  fields: () => ({
    cover: { type: GraphQLString }
  })
})
