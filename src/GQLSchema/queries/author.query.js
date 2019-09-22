/* eslint-disable camelcase */
// GQL object types
import GraphQLJSON from 'graphql-type-json'
import {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql'

// models
import Author from '../../models/author/author.model'
import Following from '../../models/following/following.model'
import Story from '../../models/story/story.model'

// GQL types
import {
  AuthorType,
  AuthorProfileType,
  AuthorTypePaginate,
  AuthorStorySearchType
} from '../GQLTypes/authorType'
import { StorageType } from '../GQLTypes/StorageType'

// GQL handles
import { paginateOptions, sortConverter } from '../GQLHandles'
import authorHndl from '../../handles/author.handles'

import config from '../../config'

const author = {
  description: 'Queries for AuthorType based on author ID',
  type: AuthorType,
  args: { id: { type: new GraphQLNonNull(GraphQLID) } },
  async resolve (_parent, {id}) {
    try {
      return await Author.findOneActiveById(id)
    } catch (err) {
      throw err
    }
  }
}

const authors = { //TODO: briše se?
  description: 'Get all authors with pagination',
  type: AuthorTypePaginate,
  args: {
    search: { type: GraphQLString },
    page: { type: GraphQLInt },
    limit: { type: GraphQLInt },
    sort: { type: GraphQLString }
  },
  async resolve(_parent, {search = '', page, limit, sort}) {
    try {
      let query = {
        $and: [{
          $or: [{
            name: {
              $regex: search,
              $options: 'i'
            }
          }, {
            username: {
              $regex: search,
              $options: 'i'
            }
          }, {
            email: {
              $regex: search,
              $options: 'i'
            }
          }]
        }, {
          deleted: false
        }, {
          active: true
        }]
      }
      return await Author.paginate(query, paginateOptions(page, limit, sortConverter(sort)))
    } catch (err) {
      return err
    }
  }
}

const authorsSearch = {
  description:
    `Search for authors by name, username or email, based on every letter input.
    If author argument is not provided, then author will be used from token.`,
  type: AuthorTypePaginate,
  args: {
    author: { type: GraphQLID },
    search: {
      description: 'Search for name, username and email based on every letter input',
      type: new GraphQLNonNull(GraphQLString)
    },
    page: {
      description: 'Page number',
      type: GraphQLInt
    },
    limit: {
      description: 'Limit number of items per page',
      type: GraphQLInt
    },
    sort: {
      description:
        `Sort items, use string divided with colon, where first word is parameter and second is order.
        Possible order values are: ascending, descending, asc, desc, 1, -1.
        e.g. "name:ascending", "created:desc", "updated:-1", "email:1"`,
      type: GraphQLString
    }
  },
  async resolve(_parent, { author, search = '', page, limit, sort}, req) {
    try {
      // if id is not entered, then assign id to logged user (from token)
      if (!author) author = req.user._id
      let query = {
        $and: [{
          $or: [{
            name: {
              $regex: search,
              $options: 'i'
            }
          }, {
            username: {
              $regex: search,
              $options: 'i'
            }
          }, {
            email: {
              $regex: search,
              $options: 'i'
            }
          }]
        }, {
          deleted: false
        }, {
          active: true
        }]
      }

      let authors = await Author.paginate(query, paginateOptions(page, limit, sortConverter(sort)))
      let following = await Following.find({author: author})
      // loop authors array
      authors.docs.forEach((author) => {
        let x = 0
        // loop following array to check for followings
        following.forEach(follower => {
          if (follower.follows.toString() === author._id.toString()) {
            // if following add 1
            x += 1
          }
        })
        // if x is gte 0 follows are true, otherwise false, author.follow proparty is changed
        x > 0 ? author.follow = true : author.follow = false
      })
      return authors

    } catch (err) {
      return err
    }
  }
}

const profile = { // TODO: da li i ovde iz tokena da uzimam ID?
  description:
    `Get user profile information with following, followers and stories.
    If ID argument is not provided, then ID will be used from token.`,
  type: AuthorProfileType,
  args: {
    id: {
      description: 'Author ID',
      type: GraphQLID
    },
  },
  async resolve(_parent, { id }, req) {
    try {
      // if id is not entered, then assign id to logged user (from token)
      if (!id) id = req.user._id

      let query = { $or: [{author: id}, {follows: id}] }
      // find all followers and followings
      let allFollows = await Following.find(query)
      // filter and extract only followings ID
      let following = allFollows
        .filter(f => String(f.author) === String(id))
        .map(f => f.follows)
      // filter and extract only followers ID
      let followers = allFollows
        .filter(f => String(f.follows) === String(id))
        .map(f => f.author)

      let author = await Author.findById(id)
      author.following = following.length
      author.followers = followers.length

      return author

    } catch (err) {
      return err
    }
  }
}

const profileUsername = {
  description:
    'Get user profile information by username with following, followers and stories.',
  type: AuthorProfileType,
  args: {
    username: {
      description: 'Author\'s username',
      type: GraphQLString
    },
  },
  async resolve(_parent, { username }) {
    try {
      const author = await Author.findOne({username: username, active: true, deleted: false})
      if (!author) {
        throw Error('Author not found')
      }
      const id = author._id
      const query = { $or: [{author: id}, {follows: id}] }
      // find all followers and followings
      let allFollows = await Following.find(query)

      // filter and extract only followings ID
      let following = allFollows
        .filter(f => String(f.author) === String(id))
        .map(f => f.follows)

      // filter and extract only followers ID
      let followers = allFollows
        .filter(f => String(f.follows) === String(id))
        .map(f => f.author)

      author.following = following.length
      author.followers = followers.length
      author.shareLink = `${config.website.baseUrl}/${author.username}`

      return author

    } catch (err) {
      return err
    }
  }
}

const storage = {
  description: 'Queries for Storage limit for author and group',
  type: StorageType,
  async resolve(_parent, _args, req) {
    try {
      let user = req.user
      let res = await authorHndl.storageLimit(user.id)
      return res
    } catch (err) {
      throw err
    }
  }
}

const storageJson = {
  description: 'Get all storage data for author and group members, without querying',
  type: GraphQLJSON,
  async resolve(_parent, _args, req) {
    try {
      let user = req.user
      let res = await authorHndl.storageLimit(user.id)
      return res
    } catch (err) {
      throw err
    }
  }
}

const search = {
  description:
    `Search Stories (only unlocked Stories or Stories user have access for)
    and Authors (by username, name and email)`,
  type: AuthorStorySearchType,
  args: {
    search: {
      description: 'Search for name, username and email on author and title on stories based on every letter input',
      type: new GraphQLNonNull(GraphQLString)
    },
    page: {
      description: 'Page number',
      type: GraphQLInt
    },
    limit: {
      description: 'Limit number of items per page',
      type: GraphQLInt
    },
    sort: {
      description: `Sort items, use string divided with colon, where first word is parameter and second is order.
      Possible order values are: ascending, descending, asc, desc, 1, -1.
      e.g. "name:ascending", "created:desc", "updated:-1", "email:1"`,
      type: GraphQLString
    },
    authorPage: { type: GraphQLInt },
    authorLimit: { type: GraphQLInt },
    authorSort: { type: GraphQLString },
    storyPage: { type: GraphQLInt },
    storyLimit: { type: GraphQLInt },
    storySort: { type: GraphQLString },
  },
  async resolve(_parent, { search = '', authorPage, authorLimit, authorSort, storyLimit, storyPage, storySort }, req) {
    try {
      let author = req.user._id

      // find followings
      let followings = await Following.find({author})
      let followingsIds = followings.map(f => f.follows)

      let authorQuery = {
        $and: [{
          $or: [{
            name: {
              $regex: search,
              $options: 'i'
            }
          }, {
            username: {
              $regex: search,
              $options: 'i'
            }
          }, {
            email: {
              $regex: search,
              $options: 'i'
            }
          }]
        }, {
          deleted: false
        }, {
          active: true
        }]
      }
      let storyQuery = {
        $and: [{
          $or: [
            { author },
            { collaborators: { author } },
            { status: 'public' },
            {
              $and: [
                { author: { $in: followingsIds } },
                {'share.followers': true}
              ]
            }
          ]
        }, {
          title: {
            $regex: search,
            $options: 'i'
          }
        }]
      }

      let authors = await Author.paginate(authorQuery, paginateOptions(authorPage, authorLimit, sortConverter(authorSort)))

      let stories = await Story.paginate(storyQuery, paginateOptions(storyPage, storyLimit, sortConverter(storySort)))

      return { authors, stories }

    } catch (err) {
      return err
    }
  }
}

export default {
  author,
  authors,
  authorsSearch,
  profile,
  profileUsername,
  storage,
  storageJson,
  search
}
