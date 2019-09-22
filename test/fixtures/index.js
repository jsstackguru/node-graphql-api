const authors = require('./authors')
const forgotPasswords = require('./forgotpasswords')
const stories = require('./stories')
const pages = require('./pages')
const collaborationInvites = require('./collaboration_invites')
const followings = require('./followings.json')
const comments = require('./comments.json')
const storySpam = require('./story-spam.json')
const pageSpam = require('./page-spam.json')
const commentSpam = require('./comment-spam.json')
const devices = require('./devices.json')
const activities = require('./activities.json')
const group = require('./groups.json')
const groupInvites = require('./group-invites.json')

const data = {
  'collections': {
    'authors': authors,
    'forgotpasswords': forgotPasswords,
    'stories': stories,
    'pages': pages,
    'collaboration_invites': collaborationInvites,
    'followings': followings,
    'comments': comments,
    'story_spam': storySpam,
    'page_spam': pageSpam,
    'comment_spam': commentSpam,
    'devices': devices,
    'activities': activities,
    'group': group,
    'group_invites': groupInvites
  }
}

module.exports = data
