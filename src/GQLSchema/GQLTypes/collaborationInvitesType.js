// models
import Author from '../../models/author/author.model'
import Story from '../../models/story/story.model'
// GQL types
import { StoryType } from './storyType'
import { AuthorType } from './authorType'
// GQL objects types
import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
} from 'graphql'


export const CollaborationInvitesType = new GraphQLObjectType({
  description: 'Collaboration invites type, includes all properties from model, with added resolved Author, Story and Invited (Author props)',
  name: 'CollaborationInvitesType',
  fields: () => ({
    _id: { type: GraphQLID },
    id: { type: GraphQLID },
    author: {
      type: AuthorType,
      async resolve(invites) {
        try {
          return await Author.findOneActiveById(invites.author)
        } catch (err) {
          return err
        }
      }
    },
    story: {
      type: StoryType,
      async resolve(invites) {
        try {
          return await Story.findOneActiveById(invites.story)
        } catch (err) {
          return err
        }
      }
    },
    invited: {
      type: AuthorType,
      async resolve(invites) {
        try {
          return await Author.findOneActiveById(invites.invited)
        } catch (err) {
          return err
        }
      }
    },
    active: { type: GraphQLString },
    created: { type: GraphQLString },
    edit: { type: GraphQLString },
    accepted: { type: GraphQLString },
    email: { type: GraphQLString },
    name: { type: GraphQLString }
  })
})

// CollaborationInvitesType with pagination
export const CollaborationInvitesTypePaginate = new GraphQLObjectType({
  name: 'CollaborationInvitesTypePaginate',
  fields: () => ({
    docs: { type: new GraphQLList(CollaborationInvitesType) },
    total: { type: GraphQLInt },
    limit: { type: GraphQLInt },
    page: { type: GraphQLInt },
    pages: { type: GraphQLInt },
  })
})
