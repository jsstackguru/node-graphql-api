// GQL object types
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} from 'graphql'

export const StorageType = new GraphQLObjectType({
  name: 'StorageType',
  description: 'Storage type is used to show storage limit for author and group members',
  fields: () => ({
    author: { type: StorageTypeAuthor },
    members: { type: StorageTypeMembers }
  })
})

/* STORAGE SUB TYPES */

export const StorageTypeAuthor = new GraphQLObjectType({
  name: 'StorageTypeAuthor',
  description: 'This type reflects only authors storage usage',
  fields: () => ({
    total: {
      description: 'Total amount of storage for author',
      type: FormatBytesType,
    },
    used: {
      description: 'Used amount of storage for author',
      type: FormatBytesType
    },
    left: {
      description: 'Storage amount that\'s left for author',
      type: FormatBytesType
    }
  })
})

export const StorageTypeMembers = new GraphQLObjectType({
  name: 'StorageTypeMembers',
  fields: () => ({
    you: {
      description: 'Storage usage for perticular author in group',
      type: FormatBytesType
    },
    others: {
      description: 'Storage usage for other members of group',
      type: FormatBytesType
    },
    left: {
      description: 'Amount that\'s left for all members in group',
      type: FormatBytesType
    },
    total: {
      description: 'Total storage amount for all members in group',
      type: FormatBytesType
    }
  })
})

export const FormatBytesType = new GraphQLObjectType({
  name: 'FormatBytesType',
  fields: () => ({
    bytes: {
      description: 'Number of bytes',
      type: GraphQLInt
    },
    format: {
      description: 'Number of bytes formated to equivalent bigger unit, eg. "KB", "MB", "GB"',
      type: GraphQLString
    },
  })
})
