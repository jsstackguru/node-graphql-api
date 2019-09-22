import { Favorite } from '../../../../src/models/favorite'

// utils
import { ObjectId } from 'mongodb'

const favoriteFaker = async ({
  n = 1,
  author = null,
  story = null,
  single = false
}) => {
  const favorites = [...Array(n)].map(_item => {
    return Favorite.create({
      _id: ObjectId(),
      author: author || ObjectId(),
      story: story || ObjectId()
    })
  })
  if (single) {
    return await favorites[0]
  }
  return await Promise.all(favorites)
}

export default favoriteFaker
