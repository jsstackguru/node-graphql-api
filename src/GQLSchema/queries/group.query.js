// models
import { Group } from '../../models/group'
import { GroupInvite } from '../../models/group-invite'
// GQL types
import { GroupAccountType } from '../GQLTypes/groupType'

const groupAccount = {
  description: 'Get group members and pending invitations',
  type: GroupAccountType,
  async resolve(_parent, _args, req) {
    try {
      let user = req.user
      let result = await Group.findForAuthor(user.id)

      // if !result => there is no group with this author
      if (!result) return null

      // combine members and owner in one array, than remove user from members
      let members = [...result.members, result.owner].map(m => String(m)).filter(m => m != user.id )
      // is user owner of group, evaluate Boolean
      let isOwner = result.owner.toString() == user.id.toString() ? true : false
      // get pending invitations for author
      let pendingInvitations = await GroupInvite.findAllPendingInvitations(user.id)
      // if there is invitations, map to invited prop only
      let pending = pendingInvitations.length > 0 ? pendingInvitations.map(p => p['invited']) : []

      // constructing obj data to return
      let final = {
        id: result._id,
        members,
        isOwner,
        active: result.active,
        created: result.created,
        updated: result.updated,
        pending
      }

      return final

    } catch (err) {
      throw err
    }
  }
}

export default {
  groupAccount: groupAccount,
}
