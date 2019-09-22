// models
import { Following } from '../../../../src/models/following'
// faker
import faker from 'faker'
// utils
import { ObjectId } from 'mongodb'


const followingFaker = async ({
  n = 1,
  author,
  follows,
  active = true,
}) => {
  let followings = []
  for (let i = 0; i < n; i++) {
    let following = Following.create({
      author: author ? author : ObjectId(),
      follows: follows ? follows : ObjectId(),
      active,
    })
    followings.push(following)
  }
  return await Promise.all(followings)
}

export default followingFaker
