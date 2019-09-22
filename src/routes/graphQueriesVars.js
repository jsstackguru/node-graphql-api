/* eslint-disable camelcase */

/**
 * gqlKeys are used for testing purposes.
 *
 */
export const gqlKeys = {
  author: {
    root: ['_id', 'name', 'username', 'avatar', 'email'],
    advanced: [
      '_id',
      'name',
      'username',
      'avatar',
      'email',
      'isFollowed',
      'isFollowing'
    ]
  },
  page: {
    root: [
      '_id',
      'title',
      'slug',
      'matchId',
      'created',
      'updated',
      'theme',
      'place',
      'author',
      'content'
    ],
    theme: ['cover'],
    place: ['lat', 'lon', 'name']
  },
  story: {
    root: [
      '_id',
      'title',
      'slug',
      'created',
      'updated',
      'author',
      'pages',
      'share',
      'collaborators',
      'theme'
    ],
    share: ['followers', 'link', 'search'],
    collaborators: ['edit', 'author'],
    author: ['_id', 'name', 'username', 'avatar', 'email', 'isFollowed'],
    details: [
      '_id',
      'title',
      'slug',
      'created',
      'updated',
      'author',
      'pages',
      'share',
      'collaborators',
      'isFavorite',
      'commentsCount',
      'shareLink',
      'edit',
      'pagesNumber',
      'theme'
    ]
  },
  storyMini: {
    root: ['_id', 'title', 'created'],
    search: [
      '_id',
      'title',
      'slug',
      'created',
      'updated',
      'author',
      'pages',
      'share',
      'collaborators',
      'isFavorite',
      'commentsCount',
      'shareLink',
      'edit',
      'pagesNumber',
      'theme'
    ]
  },
  comments: {
    root: ['_id', 'page', 'text', 'created', 'spam', 'reply', 'author'],
    details: ['_id', 'page', 'text', 'created', 'spam', 'reply', 'author']
  }
}

const author = {
  basic: `
    _id name username avatar email
  `,
  advanced: '_id name username avatar email isFollowed isFollowing',
  story: ['_id', 'name', 'username', 'avatar', 'email', 'isFollowed'],
  profile: `
    _id
    name
    username
    avatar
    bio
    shareLink
    stories {
      total
    }
    following {
      total
    }
    followers {
      total
    }
    shareLink
  `
}

const page = {
  basic: `
    _id title slug matchId created updated content
    theme { cover }
    place { lat lon name }
    author { ${author.basic} }
  `,
  story: `
    _id title slug matchId created updated content
    theme { cover }
    place { lat lon name }
    author { ${author.basic} }
  `,
  storyPages: `
    _id title slug matchId created updated content
    theme { cover }
    place { lat lon name }
    author { ${author.basic} }
    pageNumber
    commentsNumber
    shareLink
  `
}

const story = {
  basic: `
    _id title slug created updated
    author { ${author.story} }
    pages { ${page.basic} }
    share { followers link search }
    collaborators {
      edit
      author { ${author.basic} }
    }
    theme { cover }
  `,
  mini: `
    _id title created
  `,
  details: `
    _id title slug created updated
    author { ${author.story} }
    pages { ${page.story} }
    share { followers link search }
    collaborators {
      edit
      author { ${author.basic} }
    },
    isFavorite
    commentsCount
    shareLink
    edit
    pagesNumber
    theme { cover }
  `,
  search: `
    _id title slug created updated
    author { ${author.story} }
    pages { ${page.story} }
    share { followers link search }
    collaborators {
      edit
      author { ${author.basic} }
    },
    isFavorite
    commentsCount
    shareLink
    edit
    pagesNumber
    theme { cover }
  `
}

const comments = {
  basic: `
    _id page text created spam reply author { ${author.basic} }
  `,
  details: `
    _id page text created spam reply { _id page text created updated author { ${author.basic} } } author { ${author.basic} }
  `
}

export default {
  author,
  page,
  story,
  comments
}
