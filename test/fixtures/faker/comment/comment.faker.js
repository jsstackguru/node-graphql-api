// models
import { Comment } from '../../../../src/models/comment'
// faker
import faker from 'faker'
// utils
import { ObjectId } from 'mongodb'


const commentFaker = async ({
  n = 1,
  author,
  page,
  text,
  active = true,
  reply,
  single = false
}) => {
  let comments = []
  for (let i = 0; i < n; i++) {
    let comment = Comment.create({
      author: author ? author : ObjectId(),
      page: page ? page : ObjectId(),
      text: text ? text : faker.lorem.words(32),
      active,
      deleted: false,
      spam: 0,
      reply: reply ? reply : ObjectId()
    })
    comments.push(comment)
  }
  if (single) {
    return await comments[0]
  }
  return await Promise.all(comments)
}

export default commentFaker
