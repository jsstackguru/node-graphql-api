// Root query
import RootQuery from './queries/root.query'
// Mutation
import Mutation from './mutations/root.mutation'
// GQL objects
import { GraphQLSchema } from 'graphql'

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
