// models
import { Group } from '../../../../src/models/group'
// faker
import faker from 'faker'
// utils
import { ObjectId } from 'mongodb'


const familyGroupFaker = async ({
  n = 1,
  owner,
  members,
  active = true,
  single = false
}) => {
  let groups = []
  for (let i = 0; i < n; i++) {
    let group = Group.create({
      owner: owner ? owner : ObjectId(),
      active,
      members: members ? members : [ObjectId(), ObjectId()],
    })
    groups.push(group)
  }
  if (single) {
    return await groups[0]
  }
  return await Promise.all(groups)
}

export default familyGroupFaker
