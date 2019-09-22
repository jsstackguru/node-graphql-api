// models
import { Activity } from '../../../../src/models/activity'
// faker
import faker from 'faker'
// utils
import { ObjectId } from 'mongodb'


const activityFaker = async ({
  n = 1,
  author,
  active = true,
  type = 'system_message',
  data = {
    message: faker.lorem.sentence(6)
  },
  created = new Date(),
  updated = new Date()
}) => {
  const activities = [...Array(n)].map(_item => {
    return Activity.create({
      author: author ? author : ObjectId(),
      timestamp: new Date().getTime(),
      active,
      type,
      data,
      created,
      updated
    })
  })
  return await Promise.all(activities)
}

export default activityFaker
