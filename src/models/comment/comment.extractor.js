/**
 * @file Extractor for comment collection
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

export const basic = comment => {
  const result = {}
  if (comment) {
    Object.assign(result, {
      _id: comment.id,
      page: comment.page,
      author: comment.author,
      text: comment.text,
      active: comment.active,
      deleted: comment.deleted,
      deletedAt: comment.deletedAt,
      spam: comment.spam,
      reply: comment.reply,
      created: comment.created,
      updated: comment.updated
    })
  }
  return result
}

export const replyProperies = 'id page author text'
