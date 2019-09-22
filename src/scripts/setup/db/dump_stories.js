/**
 * @file Create dump stories
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

// import { Author } from '../../../models/author'

// Fakers
import authorFaker from '../../../../test/fixtures/faker/author/author.faker'
import storyFaker from '../../../../test/fixtures/faker/story/story.faker'

// Constants
import { STORY_STATUS } from '../../../../src/constants/story'

// Insert stories
export const createStories = async ({
  n = 1 }) => {
  const stories = await storyFaker({
    n
  })
  console.log('stories', stories.length)
}

// createStories({n: 10})

export const createAuthorStories = async ({
  n = 1, author, status = STORY_STATUS.PRIVATE }) => {
  const stories = await storyFaker({
    n,
    author,
    status
  })
  console.log('stories', stories.length)
}

// const author = '5c9bce90e456bc4729c31d8b' // mnikson@gmail.com
// createAuthorStories({ n: 1, author })

// Insert authors and stories
export const createAuthorAndStories = async () => {
  const authors = await authorFaker({
    n: 10
  })
  let totalStories = 0
  for (const author of authors) {
    // Create private stories
    const privateStories = await createStoriesByAuthor({
      n: 10,
      author: author.id,
      status: STORY_STATUS.PRIVATE
    })
    totalStories += privateStories.length

    // Create public stories
    const publicStories = await createStoriesByAuthor({
      n: 10,
      author: author.id,
      status: STORY_STATUS.PUBLIC,
      share: {
        followers: true,
        link: true,
        search: true
      }
    })
    totalStories += publicStories.length

    // Create public stories
    const followersStories = await createStoriesByAuthor({
      n: 10,
      author: author.id,
      share: {
        followers: true,
        link: false,
        search: false
      },
      status: STORY_STATUS.PUBLIC
    })
    totalStories += followersStories.length
  }

  console.log('stories', totalStories)
}

async function createStoriesByAuthor(props) {
  const privateStories = await storyFaker(props)

  return privateStories
}

createAuthorAndStories()
