// GQL objects
import { GraphQLObjectType } from 'graphql'
// GQL mutations
import pageMutation from './page.mutation'

const Mutation = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    createComment: pageMutation.createComment,
    createCommentReply: pageMutation.createCommentReply,
  }
})

export default Mutation
