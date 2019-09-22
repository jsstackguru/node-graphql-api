// models
import { Story } from '../../../../src/models/story'
// faker
import faker from 'faker'
// libs
import { ObjectId } from 'mongodb'

const storyFaker = async ({
  n = 1,
  id,
  author,
  active = true,
  deleted = false,
  deletedAt,
  status = 'public',
  views = 0,
  collaborators = [],
  updated,
  created,
  title,
  collaboratorsShare = false,
  followersShare = false,
  linkShare = false,
  searchShare = false,
  pages = [ObjectId()],
  single = false
}) => {
  const fakeTitle = faker.lorem.words(2)
  const slug = fakeTitle.replace(' ', '-')
  const now = new Date()

  const stories = [...Array(n)].map(_item => {
    const modelId = id ? id : ObjectId()
    return Story.create({
      _id: modelId,
      id: modelId,
      author: author || ObjectId(),
      title: title || fakeTitle,
      slug,
      status,
      active,
      deleted,
      deletedAt: deletedAt || null,
      views,
      theme: {
        cover: faker.image.nature()
      },
      banInPublic: false,
      featured: false,
      shareLink: false,
      share: {
        collaborators: collaboratorsShare,
        followers: followersShare,
        link: linkShare,
        search: searchShare
      },
      collaborators,
      pages,
      updated: updated ? updated : now,
      created: created ? created : now
    })
  })
  if (single) {
    return await stories[0]
  }
  return await Promise.all(stories)
  // let result = await Promise.all(stories)
  // return result.length === 1 ? result[0] : result
}

export default storyFaker
