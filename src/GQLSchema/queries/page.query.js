// models
import Page from '../../models/page/page.model'
import Comments from '../../models/comment/comment.model'
// GQL types
import { PageType } from '../GQLTypes/pageType'
import { CommentTypePaginate } from '../GQLTypes/commentType'
// GQL handles
import { paginateOptions, sortConverter } from '../GQLHandles'
// GQL object types
import {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql'


const page = {
  description: 'Search for page by ID',
  type: PageType,
  args: {
    id: { type: new GraphQLNonNull( GraphQLID) }
  },
  async resolve (_parent, {id}) {
    try {
      return await Page.findActivePage(id)
    } catch (err) {
      return err
    }
  }
}

const comments = {
  description: 'Get page comments entering pageId',
  // type: GQLPaginateType('CommentsQueryType', CommentType),
  type: CommentTypePaginate,
  args: {
    pageId: { type: new GraphQLNonNull(GraphQLID) },
    page: { type: GraphQLInt },
    limit: { type: GraphQLInt },
    sort: { type: GraphQLString }
  },
  async resolve(_parent, {pageId, page, limit, sort}) {
    try {
      let query = { page: pageId }
      let result = await Comments.paginate(query, paginateOptions(page, limit, sortConverter(sort)))
      return result
    } catch(err) {
      return err
    }
  }
}

const replies = {
  description: 'Get comment replies entering commentId',
  // type: GQLPaginateType('RepliesQueryType', CommentType),
  type: CommentTypePaginate,
  args: {
    commentId: { type: new GraphQLNonNull(GraphQLID) },
    page: { type: GraphQLInt },
    limit: { type: GraphQLInt },
    sort: { type: GraphQLString }
  },
  async resolve(_parent, {commentId, page, limit, sort}) {
    try {
      let query = { reply: commentId }
      return await Comments.paginate(query, paginateOptions(page, limit, sortConverter(sort)))
    } catch(err) {
      return err
    }
  }
}

export default {
  page,
  comments,
  replies
}
