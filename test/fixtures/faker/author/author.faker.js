import { ObjectId } from 'mongodb'
import randtoken from 'rand-token'
import faker from 'faker'

// models
import { Author } from '../../../../src/models/author'

// utils
import { generatePassword } from '../../../../src/lib/utils'

// services
import { generateToken } from '../../../../src/services/auth'

const authorFaker = async ({
  active = true,
  deleted = false,
  lastActivityCheck = {
    collaboration: new Date(),
    social: new Date(),
    timeline: new Date()
  },
  email,
  id,
  n = 1,
  name,
  notif = {
    collaboration: {
      userLeavesStory: true,
      removedFromStory: true,
      storyUpdates: true,
      newCollaborator: true,
      invitations: true
    },
    social: {
      newFollower: true,
      comments: true,
      favoritedYourStory: true,
      sharedStory: true,
      friendStoryUpdates: true,
      friendNewStory: true,
      newFriend: true
    }
  },
  password = generatePassword('istoryapp'),
  planLevel = 'BASIC',
  planExpires,
  pushNotif = {
    newStoryShare: true,
    newStoryPublic: true,
    newFollower: true,
    newComment: true
  },
  storageUsage = 0,
  single = false,
  token = {
    refresh: randtoken.generate(64),
    expired: new Date().setDate(
      new Date().getDate() + 30
    ),
    access: generateToken(email),
    auth: randtoken.generate(64)
  },
  username
}) => {
  const nextYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1))
  const authors = [...Array(n)].map(_item => {
    return Author.create({
      _id: id ? id : ObjectId(),
      name: name ? name : `${faker.name.firstName()} ${faker.name.lastName()}`,
      username: username ? username : faker.internet.userName(),
      email: email || faker.internet.email(),
      avatar: faker.internet.avatar(),
      bio: faker.lorem.sentence(),
      active,
      location: {
        name: faker.address.city(),
        lon: faker.address.longitude(),
        lat: faker.address.latitude()
      },
      deleted,
      lastActivityCheck,
      plan: {
        level: planLevel,
        expires: planExpires ? planExpires : nextYear
      },
      storage: {
        usage: storageUsage
      },
      notif,
      token,
      pushNotif,
      password
    })
  })
  if (single) {
    return await authors[0]
  }
  return await Promise.all(authors)
}

export default authorFaker
