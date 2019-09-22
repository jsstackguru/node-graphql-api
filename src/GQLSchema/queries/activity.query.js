/* eslint-disable camelcase */
// models
import { authorExtractor, Author } from '../../models/author'
// GQL types
import { AuthorTypePaginate } from '../GQLTypes/authorType'
import { ActivityTabType, ActivityTypePaginate } from '../GQLTypes/activityType'
import { CollaborationInvitesTypePaginate } from '../GQLTypes/collaborationInvitesType'
import { CommentTypePaginate } from '../GQLTypes/commentType'
import { GroupInvitationTypePaginate } from '../GQLTypes/groupType'
// GQL handles
import { paginateOptions, sortConverter } from '../GQLHandles'
// handles
import activityHndl from '../../handles/activities.handles'
// utils
import utils from '../../lib/utils'
// GQL object types
import {
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLError
} from 'graphql'

const checkNewActivities = {
  description: 'Check for new activities',
  type: ActivityTabType,
  async resolve (_parent, args, req) {
    try {
      let user = req.user

      let timelineActivities = await activityHndl.getNewTimelineActivities(user)
      let socialActivities = await activityHndl.getNewSocialActivities(user)
      let collaborationActivities = await activityHndl.getNewCollaborationActivities(user)

      return {
        timeline: timelineActivities.length,
        social: socialActivities.length,
        collaboration: collaborationActivities.length
      }

    } catch (err) {
      return err
    }
  }
}

const newFollowers = {
  description: 'get followers based on number of days you entered',
  type: AuthorTypePaginate,
  args: {
    days: { type: GraphQLInt },
    page: { type: GraphQLInt },
    limit: { type: GraphQLInt },
    sort: { type: GraphQLString }
  },
  async resolve (_parent, { days, page, limit, sort }, req) {
    try {
      //default days value is 30
      days ? days : days = 30
      let userId = req.user._id

      let followersIds = await activityHndl.getNewFollowers(userId, days)

      let query = {
        _id: {
          $in: followersIds
        },
        active: true
      }
      let followers = await Author.paginate(
        query, paginateOptions(page, limit, sortConverter(sort))
      )

      return followers

    } catch (err) {
      console.log(err.stack)
      return err
    }
  }
}

const timelineComments = {
  description: 'Get timeline comments',
  type: CommentTypePaginate,
  args: {
    days: { type: GraphQLInt },
    page: { type: GraphQLInt },
    limit: { type: GraphQLInt },
    sort: { type: GraphQLString }
  },
  async resolve(_parent, {days, page, limit, sort}, req) {
    try {
      let user = req.user
      let order = sort ? sort.split(':')[1] : undefined
      let prop = sort ? sort.split(':')[0] : undefined

      const comments = await activityHndl.getTimelineComments(user._id, days)

      return utils.paginate(comments, page, limit, order, prop)

    } catch (err) {
      return err
    }

  }
}

const newSocialComments = {
  description: 'Get new social comments',
  type: CommentTypePaginate,
  args: {
    days: { type: GraphQLInt },
    page: { type: GraphQLInt },
    limit: { type: GraphQLInt },
    sort: { type: GraphQLString }
  },
  async resolve(_parent, {days, page, limit, sort}, req) {
    try {
      let user = req.user

      let order = sort ? sort.split(':')[1] : undefined
      let prop = sort ? sort.split(':')[0] : undefined

      const comments = await activityHndl.getNewSocialComments(user, days)

      return utils.paginate(comments, page, limit, order, prop)

    } catch (err) {
      return err
    }

  }
}

const newCollaborationComments = {
  description: 'Get new collaboration comments',
  type: CommentTypePaginate,
  args: {
    days: { type: GraphQLInt },
    page: { type: GraphQLInt },
    limit: { type: GraphQLInt },
    sort: { type: GraphQLString }
  },
  async resolve(_parent, {days, page, limit, sort}, req) {
    try {
      let user = req.user

      let order = sort ? sort.split(':')[1] : undefined
      let prop = sort ? sort.split(':')[0] : undefined

      const comments = await activityHndl.getNewCollaborationComments(user, days)

      return utils.paginate(comments, page, limit, order, prop)

    } catch (err) {
      return err
    }

  }
}

const collaborationInvites = {
  description: 'Get new collaboration invites',
  type: CollaborationInvitesTypePaginate,
  args: {
    days: { type: GraphQLInt },
    page: { type: GraphQLInt },
    limit: { type: GraphQLInt },
    sort: { type: GraphQLString }
  },
  async resolve(_parent, {days, page, limit, sort}, req) {
    try {
      let user = req.user

      let order = sort ? sort.split(':')[1] : undefined
      let prop = sort ? sort.split(':')[0] : undefined

      const invites = await activityHndl.getCollaborationInvites(user._id, user.email, days)

      return utils.paginate(invites, page, limit, order, prop)
    } catch (err) {
      return err
    }
  }
}

const groupInvites = {
  description: 'Get new group invites',
  type: GroupInvitationTypePaginate,
  args: {
    email: { type: GraphQLString },
    days: { type: GraphQLInt },
    page: { type: GraphQLInt },
    limit: { type: GraphQLInt },
    sort: { type: GraphQLString }
  },
  async resolve(_parent, {email, days, page, limit, sort}, req) {
    try {
      let user = req.user

      let order = sort ? sort.split(':')[1] : undefined
      let prop = sort ? sort.split(':')[0] : undefined

      const invites = await activityHndl.getGroupInvitations(user.id, email, days)

      return utils.paginate(invites, page, limit, order, prop)
    } catch (err) {
      return err
    }
  }
}

const activityTimeline = {
  description: 'Get new timeline activities',
  type: ActivityTypePaginate,
  args: {
    filters: { type: new GraphQLList(GraphQLString) },
    page: { type: GraphQLInt },
    limit: { type: GraphQLInt },
    sort: { type: GraphQLString }
  },
  async resolve(_parent, {filters, page, limit, sort}, req) {
    try {
      const user = req.user

      const activities = await activityHndl.getNewTimelineActivities(user, filters)

      const order = sort ? sort.split(':')[1] : undefined
      const prop = sort ? sort.split(':')[0] : undefined
      
      const final = utils.paginate(activities, page, limit, order, prop)
      return final

    } catch (err) {
      return err
    }
  }
}

const activitySocial = {
  description: 'Get new social activities',
  type: ActivityTypePaginate,
  args: {
    filters: { type: new GraphQLList(GraphQLString) },
    page: { type: GraphQLInt },
    limit: { type: GraphQLInt },
    sort: { type: GraphQLString }
  },
  async resolve(_parent, {filters, page, limit, sort}, req) {
    try {
      let user = req.user

      let activities = await activityHndl.getNewSocialActivities(user, filters)

      let order = sort ? sort.split(':')[1] : undefined
      let prop = sort ? sort.split(':')[0] : undefined

      let final = utils.paginate(activities, page, limit, order, prop)
      return final

    } catch (err) {
      return err
    }
  }
}

const activityCollaboration = {
  description: 'Get new collaboration activities',
  type: ActivityTypePaginate,
  args: {
    filters: { type: new GraphQLList(GraphQLString) },
    page: { type: GraphQLInt },
    limit: { type: GraphQLInt },
    sort: { type: GraphQLString }
  },
  async resolve(_parent, {filters, page, limit, sort}, req) {
    let user = req.user

    let activities = await activityHndl.getNewCollaborationActivities(user, filters)
    // TODO: add message in activity type that resolve who invited who

    let order = sort ? sort.split(':')[1] : undefined
    let prop = sort ? sort.split(':')[0] : undefined

    let final = utils.paginate(activities, page, limit, order, prop)

    return final
  }
}

const activity = { //TODO: system messages
  description: 'Get new activities',
  type: ActivityTypePaginate,
  args: {
    tab: { type: new GraphQLNonNull(GraphQLString) },
    page: { type: GraphQLInt },
    limit: { type: GraphQLInt },
    sort: { type: GraphQLString }
  },
  async resolve(_parent, {tab, page, limit, sort}, req) {
    try {
      let user = req.user
      let rules = ['timeline', 'social', 'collaboration']

      if (!rules.includes(tab)) {
        return new GraphQLError('Allowed parameter names are "timeline", "social" and "collaboration"')
      }

      // activities object keys coresponds with proper value handler function
      const activitiesFunc = {
        timeline: activityHndl.getNewTimelineActivities,
        social: activityHndl.getNewSocialActivities,
        collaboration: activityHndl.getNewCollaborationActivities
      }

      // call proper function from activities
      let activities = await activitiesFunc[tab](user)

      let order = sort ? sort.split(':')[1] : undefined
      let prop = sort ? sort.split(':')[0] : undefined

      let final =  utils.paginate(activities, page, limit, order, prop)
      return final

    } catch (err) {
      return err
    }
  }
}

export default {
  checkNewActivities,
  newFollowers,
  timelineComments,
  newSocialComments,
  newCollaborationComments,
  collaborationInvites,
  groupInvites,
  activityTimeline,
  activitySocial,
  activityCollaboration,
  activity
}
