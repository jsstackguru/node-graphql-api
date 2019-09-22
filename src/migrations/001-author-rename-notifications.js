
import { connect } from './db'


export const up = async (next) => {
  try {

    const db = await connect()
    const Author = db.collection('authors')

    await Author.updateMany({}, {
      $rename: {
        // notif collaboration
        'notif.collaboration.userLeavesJournal': 'notif.collaboration.userLeavesStory',
        'notif.collaboration.removedFromJournal': 'notif.collaboration.removedFromStory',
        'notif.collaboration.journalUpdates': 'notif.collaboration.storyUpdates',
        // notif social
        'notif.social.sharedJournal': 'notif.social.sharedStory',
        'notif.social.friendJournalUpdates': 'notif.social.friendStoryUpdates',
        'notif.social.friendNewJournal': 'notif.social.friendNewStory',
        'notif.social.favoritedYourJournal': 'notif.social.favoritedYourStory',
        // push notif
        'pushNotif.newJournalShare': 'pushNotif.newStoryShare',
        'pushNotif.newJournalPublic': 'pushNotif.newStoryPublic',
      }
    })

    next()
  } catch (err) {
    throw err
  }
}

export const down = async (next) => {
  try {

    const db = await connect()
    const Author = db.collection('authors')

    await Author.updateMany({}, {
      $rename: {
        // notif collaboration
        'notif.collaboration.userLeavesStory': 'notif.collaboration.userLeavesJournal',
        'notif.collaboration.removedFromStory': 'notif.collaboration.removedFromJournal',
        'notif.collaboration.storyUpdates': 'notif.collaboration.journalUpdates',
        // notif social
        'notif.social.sharedStory': 'notif.social.sharedJournal',
        'notif.social.friendStoryUpdates': 'notif.social.friendJournalUpdates',
        'notif.social.friendNewStory': 'notif.social.friendNewJournal',
        'notif.social.favoritedYourStory': 'notif.social.favoritedYourJournal',
        // push notif
        'pushNotif.newStoryShare': 'pushNotif.newJournalShare',
        'pushNotif.newStoryPublic': 'pushNotif.newJournalPublic',
      }
    })

    next()
  } catch (err) {
    throw err
  }
}
