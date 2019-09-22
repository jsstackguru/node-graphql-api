// models
import Author from '../../models/author/author.model'
import Comment from '../../models/comment/comment.model'
// GQL types
import { AuthorType } from './authorType'
// GQL objects types
import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLID,
  GraphQLInt
} from 'graphql'

import GraphQLDateTime from './GraphQLDateTimeType'

export const CommentType = new GraphQLObjectType({
  description: 'Comment type, includes all properties from model with resolved Author added',
  name: 'Comment',
  fields: () => ({
    _id: { type: GraphQLID },
    id: { type: GraphQLID },
    page: { type: GraphQLID },
    text: { type: GraphQLString },
    created: { type: GraphQLDateTime },
    updated: { type: GraphQLDateTime },
    deleted: { type: GraphQLString },
    active: { type: GraphQLString },
    spam: { type: GraphQLInt },
    reply: {
      type: CommentType,
      resolve(comment) {
        return Comment.findById(comment.reply)
      }
    },
    author: {
      type: AuthorType,
      resolve(comment) {
        return Author.findById(comment.author)
      }
    }
  })
})

// CommentType with pagination
export const CommentTypePaginate = new GraphQLObjectType({
  name: 'CommentTypePaginate',
  fields: () => ({
    docs: { type: new GraphQLList(CommentType) },
    total: { type: GraphQLInt },
    limit: { type: GraphQLInt },
    page: { type: GraphQLInt },
    pages: { type: GraphQLInt },
  })
})
