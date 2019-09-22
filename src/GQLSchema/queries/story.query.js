// GQL object types
import {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLError
} from 'graphql'
// services
import { ObjectId } from 'mongodb'

import config from '../../config'

// models
import Story from '../../models/story/story.model'
import Following from '../../models/following/following.model'
import Favorite from '../../models/favorite/favorite.model'
import Author from '../../models/author/author.model'

// GQL types
import {
  StoryCollaboratorsListTypePaginate,
  StoryType,
  StoryTypePaginate
} from '../GQLTypes/storyType'

// GQL handles
import { paginateOptions, sortConverter } from '../GQLHandles'

// Handlers
import storyHndl from '../../handles/story.handles'
import collaborationInviteHndl from '../../handles/collaboration.handles'

// errors
import { Forbidden, UnprocessableEntity } from '../../lib/errors'
import translate from '../../lib/translate'
import { authorExtractor } from '../../models/author';

const story = {
  description: 'Search for story by story ID',
  type: StoryType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: async (_parent, {id}, req) => {
    try {
      const user = req.user
      const story = await Story.findOne({_id: id, active: true, deleted: false})
        .populate('author', authorExtractor.basicProperties)

      // throw an error if Story doesn't exist
      if (!story) {
        throw new UnprocessableEntity(translate.__('Story doesn\'t exist'))
      }

      const validation = await storyHndl.canAccessStory(story, user._id)

      if (!validation) {
        throw new Forbidden(translate.__('You don\'t have permission for this action'))
      }

      // check does Story is favorite one
      const favorite = await Favorite.findOne({ story: id, author: user._id })

      const shareLink = `${config.website.baseUrl}/${story.author.username}/story/${story._id}`

      Object.assign(story, {
        isFavorite: favorite ? true : false,
        shareLink
      })

      return story

    } catch (err) {
      return err
    }
  }
}

const deletedStories = {//TODO: samo iz tokena ID, search se brise. Ovaj query sad ne treba deleted stories mogu da se uzmu iz myStories?
  // TODO: ja bih ovo izbrisao. u my stories ima opcija za deleted.
  description: 'Get all deleted stories for user, with pagination',
  type: StoryTypePaginate,
  args: {
    id: { type: GraphQLID },
    search: { type: GraphQLString },
    page: { type: GraphQLInt },
    limit: { type: GraphQLInt },
    sort: { type: GraphQLString }
  },
  resolve: async (_parent, {id, search = '', page, limit, sort}, req) => {
    try {

      let query = {
        author: id ? id : req.user._id,
        deleted: true,
        title: {
          $regex: search,
          $options: 'i'
        }
      }

      return await Story.paginate(
        query,
        paginateOptions(page, limit, sortConverter(sort))
      )

    } catch (err) {
      return err
    }
  }
}

const myStories = {
  description:
    `Search for all stories based on author's ID,
    including deleted stories (in that case argument deleted must be true).`,
  type: StoryTypePaginate,
  args: {
    search: {
      description: 'Search by title',
      type: GraphQLString
    },
    deleted: {
      description:
        `Option for querying deleted stories,
        if any value is present for this argument, then user's deleted stories will be shown.`,
      type: GraphQLString
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
        e.g. "title:ascending", "created:desc", "updated:-1", "slug:1"`,
      type: GraphQLString
    },
  },
  resolve: async (_parent, {search = '', deleted = false,  page, limit, sort}, req) => {
    try {
      let id = req.user._id
      let query = {
        author: id,
        deleted,
        title: {
          $regex: search,
          $options: 'i'
        }
      }
      return await Story.paginate(query, paginateOptions(page, limit, sortConverter(sort)))
    } catch(err) {
      return err
    }
  }
}

const myCollaboration = {
  description: 'Get all stories where user is collaborator',
  type: StoryTypePaginate,
  args: {
    search: {
      description: 'Search by title',
      type: GraphQLString
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
        e.g. "title:ascending", "created:desc", "updated:-1", "slug:1"`,
      type: GraphQLString
    }
  },
  resolve: async (_parent, { search = '', page, limit, sort}, req) => {
    try {
      let id = req.user._id
      let query = {
        collaborators: {
          $elemMatch: {
            author: id,
            edit: true
          }
        },
        title: {
          $regex: search,
          $options: 'i'
        }
      }
      return await Story.paginate(query, paginateOptions(page, limit, sortConverter(sort)))
    } catch (err) {
      return err
    }
  }
}

const myFeed = {
  description:
    `Get Stories by one of selected filters:
    "shared" - shared with me (stories which author internally shared with user) and
    "followed" (public stories created by authors followed by user)`,
  type: StoryTypePaginate,
  args: {
    search: {
      description: 'Search by title',
      type: GraphQLString
    },
    page: {
      description:
      'Page number',
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
        e.g. "title:ascending", "created:desc", "updated:-1", "slug:1"`,
      type: GraphQLString
    }
  },
  resolve: async (_parent, {search = '', page, limit, sort}, req) => {
    try {
      const id = req.user._id

      // find all followings
      let following = await Following.find({author: ObjectId(id)})
      // map it to array of ID's
      let followedIds = following.map(f => f.follows)

      const query = {
        // get shared stories for user
        $or: [
          {
            collaborators: {
              $elemMatch: {
                author: ObjectId(id),
                edit: false
              }
            },
          },
          {
            author: followedIds
          }
        ],
        title: {
          $regex: search,
          $options: 'i'
        }
      }

      return await Story.paginate(query, paginateOptions(page, limit, sortConverter(sort)))

    } catch(err) {
      return err
    }
  }
}

const authorsStories = {
  description:
    `Get profile data by author ID.
    By default show unlocked stories by author (created and collaborator).
    If user is trying to get their profile then show all user's stories.`,
  type: StoryTypePaginate,
  args: {
    id: {
      description: 'Author ID',
      type: new GraphQLNonNull(GraphQLID)
    },
    selection: {
      description:
        `Values: "author" - get stories where user is author;
        "collaborator" - get stories where user is collaborator with edit rights`,
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
        e.g. "title:ascending", "created:desc", "updated:-1", "slug:1"`,
      type: GraphQLString
    }
  },
  resolve: async (_parent, {id, selection, page, limit, sort}, req) => {
    try {
      // queries obj for choosing which query will be picked based on selection filter
      let queries = {
        author: {
          author: id
        },
        collaborator: {
          collaborators: {
            $elemMatch: {
              author: id,
              edit: 'true'
            }
          }
        }
      }
      // if arg selection is not author or collaborator, return err
      if (selection !== 'author' && selection !== 'collaborator') {
        return new GraphQLError('Allowed parameter names for selection are "author" and "collaborator"')
      }
      // if id !== id from token then public props are added to queries
      else if (req.user._id.toString() !== id) {
        queries.author.status = 'public'
        queries.collaborator.status = 'public'
      }
      // dynamically choose which query is used based on selection filter
      return await Story.paginate(queries[selection], paginateOptions(page, limit, sortConverter(sort)))

    } catch(err) {
      return err
    }
  }
}

const favorites = {
  description:
    'Get user\'s favorite Stories.',
  type: StoryTypePaginate,
  args: {
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
        e.g. "title:ascending", "created:desc", "updated:-1", "slug:1"`,
      type: GraphQLString
    }
  },
  resolve: async (_parent, {page, limit, sort}, req) => {
    try {
      const user = req.user
      const favoriteStories = await storyHndl.getFavoritesByAuthor(user.id)
      const favoriteIds = favoriteStories.map(story => story.id)
      const queries = {
        _id: {
          $in: favoriteIds
        }
      }
      // dynamically choose which query is used based on selection filter
      return await Story.paginate(queries, paginateOptions(page, limit, sortConverter(sort)))

    } catch(err) {
      return err
    }
  }
}

const searchCollaborators = {
  description: 'Search collaborators on story with pagination.',
  type: StoryCollaboratorsListTypePaginate,
  args: {
    id: {
      description: 'Story ID',
      type: GraphQLString
    },
    search: {
      description: 'Search term for collaborators',
      type: GraphQLString
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
        e.g. "title:ascending", "created:desc", "updated:-1", "slug:1"`,
      type: GraphQLString
    }
  },
  resolve: async (_parent, {id, search, sort, page, limit}, req) => {
    const user = req.user
    const storyQuery = {
      _id: id,
      active: true,
      deleted: false,
      $or: [
        { author: user._id },
        {
          $and: [
            { 'collaborators.author': user._id },
            { 'collaborators.edit': true }
          ]
        }
      ]
    }
    const story = await Story.findOne(storyQuery)

    if (!story) {
      throw new UnprocessableEntity(translate.__('Story not found'))
    }

    const collaboratorIds = []
    story.collaborators.forEach(coll => {
      if (coll.edit) {
        collaboratorIds.push(coll.author)
      }
    })
    const collaboratorQuery = {
      _id: {
        $in: collaboratorIds
      },
      $or: [
        { name: new RegExp(search, 'i') },
        { username: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ]
    }
    const select = authorExtractor.basicProperties
    const authors = await Author.paginate(
      collaboratorQuery,
      paginateOptions(
        page,
        limit,
        sortConverter(sort),
        select
      )
    )

    if (authors && authors.docs) {
      authors.docs.map(author => {
        const collaborator = story.collaborators.find(coll => {
          return coll.author.equals(author.id) && coll.edit
        })
        author.canInvite = true
        author.edit = collaborator ? true : false
      })
    }

    return authors
  }
}

const pendingCollaborators = {
  description: 'Pending collaborators on story with pagination.',
  type: StoryCollaboratorsListTypePaginate,
  args: {
    id: {
      description: 'Story ID',
      type: GraphQLString
    },
    search: {
      description: 'Search term for collaborators',
      type: GraphQLString
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
        e.g. "title:ascending", "created:desc", "updated:-1", "slug:1"`,
      type: GraphQLString
    }
  },
  resolve: async (_parent, {id, search, sort, page, limit}, req) => {
    const user = req.user
    const storyQuery = {
      _id: id,
      active: true,
      deleted: false,
      $or: [
        { author: user._id },
        {
          $and: [
            { 'collaborators.author': user._id },
            { 'collaborators.edit': true }
          ]
        }
      ]
    }
    const story = await Story.findOne(storyQuery)

    if (!story) {
      throw new UnprocessableEntity(translate.__('Story not found'))
    }

    const collaboratorIds = await collaborationInviteHndl.getPadingCollaboratorIds(id)
    const select = authorExtractor.basicProperties
    const authorQuery = {
      _id: { $in: collaboratorIds },
      active: true,
      deleted: false
    }
    if (search) {
      Object.assign(authorQuery, {
        $or: [
          { name: new RegExp(search, 'i') },
          { username: new RegExp(search, 'i') }
        ]
      })
    }
    const authors = await Author.paginate(
      authorQuery,
      paginateOptions(
        page,
        limit,
        sortConverter(sort),
        select
      )
    )

    if (authors && authors.docs) {
      authors.docs.map(author => {
        const collaborator = story.collaborators.find(coll => {
          return coll.author.equals(author.id) && coll.edit
        })
        author.canInvite = true
        author.edit = collaborator ? true : false
      })
    }

    return authors
  }
}

module.exports = {
  authorsStories,
  deletedStories,
  favorites,
  myStories,
  myCollaboration,
  myFeed,
  pendingCollaborators,
  searchCollaborators,
  story
}
