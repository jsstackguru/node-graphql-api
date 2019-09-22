/**
 * @file Story extractor
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

/**
 * Get the basic properties for the Story
 * @param {Object} story - Story
 * @return {Object}
 */
export const basic = story => {
  let result = {}
  if (story) {
    Object.assign(result, {
      _id: story._id,
      title: story.title,
      author: story.author,
      pages: story.pages,
      slug: story.slug,
      status: story.status,
      views: story.views,
      theme: story.theme,
      active: story.active,
      deleted: story.deleted,
      deletedAt: story.deletedAt,
      matchId: story.matchId,
      banInPublic: story.banInPublic,
      collaborators: story.collaborators,
      featured: story.featured,
      share: story.share,
      created: story.created,
      updated: story.updated
    })
  }
  return result
}
