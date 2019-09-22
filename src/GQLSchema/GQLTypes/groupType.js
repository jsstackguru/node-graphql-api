// models
import Author from '../../models/author/author.model'
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


export const GroupType = new GraphQLObjectType({
  description: 'Group type contain fields that are reflecting group collection',
  name: 'GroupType',
  fields: () => ({
    _id: { type: GraphQLID },
    id: { type: GraphQLID },
    owner: {
      description: 'group owner, has right to remove other members',
      type: AuthorType,
      async resolve(group) {
        try {
          return await Author.findOneActiveById(group.owner) //TODO: da li samo active?
        } catch (err) {
          return err
        }
      }
    },
    members: {
      description: 'Group members',
      type: new GraphQLList(AuthorType),
      async resolve(group) {
        try {
          let query = {
            _id: {
              $in: group.members
            }
          }
          let members = await Author.find(query)
          return members

        } catch (err) {
          return err
        }
      }
    },
    active: { type: GraphQLString },
    created: { type: GraphQLString },
    updated: { type: GraphQLString },
  })
})

export const GroupAccountType = new GraphQLObjectType({
  description: 'Group type contain fields that are used in account screen',
  name: 'GroupType',
  fields: () => ({
    id: { type: GraphQLID },
    members: {
      description: 'Group members',
      type: new GraphQLList(AuthorType),
      async resolve(group) {
        try {
          let query = {
            _id: {
              $in: group.members
            }
          }
          let members = await Author.find(query)
          return members

        } catch (err) {
          return err
        }
      }
    },
    isOwner: {
      description: 'Boolean value regarding user ownership of the group',
      type: GraphQLString
    },
    pending: {
      description:
        `Pending users are potentialy group users
         that didn't confirm their inviatation yet`,
      type: new GraphQLList(GroupInvitedType)
    },
    active: { type: GraphQLString },
    created: { type: GraphQLString },
    updated: { type: GraphQLString }
  })
})

export const GroupInvitationType = new GraphQLObjectType({
  description: 'Group invitation type is reflecting invitation collections from DB',
  name: 'GroupInvitationType',
  fields: () => ({
    id: { type: GraphQLID },
    author: {
      description: 'Group invitation author',
      type: AuthorType,
      async resolve(invitation) {
        try {
          return await Author.findOneActiveById(invitation.author) // TODO: da li samo active
        } catch (err) {
          return err
        }
      }
    },
    invited: {
      type: GroupInvitedType
    },
    token: { type: GraphQLString },
    active: { type: GraphQLString },
    accepted: { type: GraphQLString },
    created: { type: GraphQLString },
    updated: { type: GraphQLString }
  })
})

export const GroupInvitationTypePaginate = new GraphQLObjectType({
  name: 'GroupInvitationTypePaginate',
  fields: () => ({
    docs: { type: new GraphQLList(GroupInvitationType) },
    total: { type: GraphQLInt },
    limit: { type: GraphQLInt },
    page: { type: GraphQLInt },
    pages: { type: GraphQLInt },
  })
})


/* SUB TYPES */

export const GroupInvitedType = new GraphQLObjectType({
  description:
    `Invited type has two props, "author" for existing iStory members,
    and "mail" for invited users with no current iStory account`,
  name: 'GroupInvitedType',
  fields: () => ({
    author: {
      description: 'Existing author who is invited in group',
      type: AuthorType,
      async resolve(invited) {
        try {
          return await Author.findOneActiveById(invited.author) // TODO: da li samo active
        } catch (err) {
          return err
        }
      }
    },
    email: {
      description: 'Non existing User\'s mail (user without account) who is invited in group',
      type: GraphQLString
    }
  })
})
