// models
import CollaborationInvite from '../../../../src/models/collaboration-invite'
// faker
import faker from 'faker'
// utils
import { ObjectId } from 'mongodb'


const collaborationInviteFaker = async ({
  n = 1,
  author,
  story,
  invited,
  active = true,
  edit = true,
  accepted = false,
  email,
  single = false
}) => {
  let invitations = []
  for (let i = 0; i < n; i++) {
    let invite = CollaborationInvite.create({
      author: author ? author : ObjectId(),
      story: story ? story : ObjectId(),
      invited: invited ? invited : ObjectId(),
      active,
      edit,
      accepted,
      email: email ? email : faker.internet.email()
    })
    invitations.push(invite)
  }
  if (single) {
    return await invitations[0]
  }
  return await Promise.all(invitations)
}

export default collaborationInviteFaker
