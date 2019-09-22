import _ from 'underscore'
// models
import Author from '../../models/author/author.model'
import Comments from '../../models/comment/comment.model'
import Story from '../../models/story/story.model'

// GQL types
import { AuthorType } from './authorType'
import { CommentType, CommentTypePaginate } from './commentType'
import GraphQLJSON from 'graphql-type-json'

// utils
import utils from '../../lib/utils'

// GQL objects types
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLInt,
} from 'graphql'

// handlers
import commentHndl from '../../handles/comment.handles'

// extractors
import { authorExtractor } from '../../models/author'

import config from '../../config'

export const PageType = new GraphQLObjectType({
  name: 'Page',
  fields: () => ({
    _id: { type: GraphQLID },
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    slug: { type: GraphQLString },
    created: { type: GraphQLString },
    updated: { type: GraphQLString },
    dateFrom: { type: GraphQLString },
    dateTo: { type: GraphQLString },
    status: { type: GraphQLString },
    deleted: { type: GraphQLString },
    active: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(page) {
        return Author.findById(page.author)
      }
    },
    matchId: { type: GraphQLID },
    theme: { type: PageThemeType },
    place: {
      type: PagePlaceType
    },
    content: { type: GraphQLJSON },
    comments: {
      type: CommentContainerTypePaginate,
      args: {
        page: { type: GraphQLInt },
        limit: { type: GraphQLInt },
        sort: { type: GraphQLString }
      },
      async resolve(pages, {page, limit, sort}) {
        try {
          // find all comments
          let comments = await Comments.find({page: pages._id})
          // search for comments that are not replies
          let rootComments = comments.filter(comment => !comment.reply)
          let final = []
          // factory
          rootComments.forEach(item => {
            // create template object
            let obj = {
              comment: item,
              replies: []
            }
            // filter replies
            let replies = comments.filter(comment => String(comment.reply) === String(item._id))
            // if there are replies then assign it to obj
            if (replies.length > 0) obj.replies = replies
            final.push(obj)
          })

          let order = sort ? sort.split(':')[1] : undefined
          let prop = sort ? sort.split(':')[0] : undefined

          const paginatedResult = utils.paginate(final, page, limit, order, 'comment', prop)
          return paginatedResult

        } catch (err) {
          return err
        }
      }
    },
    pageNumber: {
      description: 'Page number in the Story',
      type: GraphQLInt,
      // eslint-disable-next-line no-empty-pattern
      resolve: async page => {
        const story = await Story.findOne({
          pages: { $in: [page.id] },
          active: true,
          deleted: false
        })
        if (story) {
          return story.pages.indexOf(page.id) + 1
        }
        return null
      }
    },
    commentsNumber: {
      description: 'Number of comments for the page',
      type: GraphQLInt,
      resolve: async page => {
        const comments = await commentHndl.getCommentsByPage(page.id)
        return comments.length
      }
    },
    shareLink: {
      description: 'Generated link to the page by website',
      type: GraphQLString,
      resolve: async (page) => {
        const story = await Story.findOne({
          pages: { $in: [page.id] },
          active: true,
          deleted: false
        })
          .populate('author', authorExtractor.basicProperties)

        const shareLink = `${config.website.baseUrl}/${story.author.username}/story/${story.slug}/page/${page.slug}`
        return shareLink
      }
    }
  })
})

export const CommentContainerType = new GraphQLObjectType({
  description: 'Comment container, contains all comments and their replies',
  name: 'CommentContainerType',
  fields: () => ({
    comment: {
      description: 'Query users comments',
      type: CommentType
    },
    replies: {
      description: 'Query users comments replies, pagination included',
      type: CommentTypePaginate,
      args: {
        page: { type: GraphQLInt },
        limit: { type: GraphQLInt },
        sort: { type: GraphQLString }
      },
      resolve: (comment, {page, limit, sort}) => {

        let replies = comment.replies
        let order = sort ? sort.split(':')[1] : undefined
        let prop = sort ? sort.split(':')[0] : undefined

        const paginatedResult = utils.paginate(replies, page, limit, order, prop)
        return paginatedResult

      }
    }
  })
})

export const PageShareType = new GraphQLObjectType({
  name: 'PageShareType',
  fields: () => ({
    googlep: { type: GraphQLInt },
    twitter: { type: GraphQLInt },
    facebook: { type: GraphQLInt },
  })
})

export const PageThemeType = new GraphQLObjectType({
  name: 'PageThemeType',
  fields: () => ({
    cover: { type: GraphQLString }
  })
})

export const PagePlaceType = new GraphQLObjectType({
  name: 'PagePlaceType',
  fields: () => ({
    name: { type: GraphQLString },
    lon: { type: GraphQLString },
    lat: { type: GraphQLString }
  })
})

// CommentContainerType with pagination
export const CommentContainerTypePaginate = new GraphQLObjectType({
  name: 'CommentContainerTypePaginate',
  fields: () => ({
    docs: { type: new GraphQLList(CommentContainerType) },
    total: { type: GraphQLInt },
    limit: { type: GraphQLInt },
    page: { type: GraphQLInt },
    pages: { type: GraphQLInt },
  })
})

