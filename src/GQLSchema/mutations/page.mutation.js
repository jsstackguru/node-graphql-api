// GQL types
import { CommentType } from '../GQLTypes/commentType'
// Handles
import commentHndl from '../../handles/comment.handles'
// GQL object types
import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLError
} from 'graphql'

const createComment = {
  description: 'Create page comment',
  type: CommentType,
  args: {
    pageId: { type: new GraphQLNonNull(GraphQLID) },
    text: { type: new GraphQLNonNull(GraphQLString) }
  },
  async resolve(parent, {pageId, text}, req) {
    try {
      // creaet authorId from token
      let authorId = req.user._id
      //  create and return comment
      return await commentHndl.createComment(authorId, pageId, text)

    } catch(err) {
      return new GraphQLError(err)
    }
  }
}

const createCommentReply = {
  description: 'Create page comment reply',
  type: CommentType,
  args: {
    commentId: { type: new GraphQLNonNull(GraphQLID) },
    text: { type: new GraphQLNonNull(GraphQLString) }
  },
  async resolve(parent, {commentId, text}, req) {
    try {
      // creaet authorId from token
      let authorId = req.user._id
      //  create and return comment
      return await commentHndl.createCommentReply(authorId, commentId, text)

    } catch(err) {
      return new GraphQLError(err)
    }
  }
}

module.exports = {
  createComment,
  createCommentReply
}
