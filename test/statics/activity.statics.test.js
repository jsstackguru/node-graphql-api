//  assertions
import chai from 'chai'
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'
// services
import { initBefore, initAfter } from '../setup'
import { ObjectId } from 'mongodb'
import utils from '../../src/lib/utils'
// fixtures
import fixtures from '../fixtures'
// faker
import activityFaker from '../fixtures/faker/activity/activity.faker'
import storyFaker from '../fixtures/faker/story/story.faker';
// model
import { Activity } from '../../src/models/activity'
// errors
import { UnprocessableEntity } from '../../src/lib/errors'
// static handlers
import { delaySocialQuery } from '../../src/models/activity/activity.model'


const createOIDs = (n) => { return  [...Array(n)].map(_id => ObjectId()) }


describe('Activity statics tests...', async () => {

  describe('findManyActiveByAuthor', () => {
    const args = {
      n: 4,
      author: ObjectId(),
      type: 'story_created',
      data: {
        storyId: ObjectId()
      }
    }
    beforeEach(async () => {
      await activityFaker(args)
    })
    afterEach(async () => {
      await initAfter()
    })

    it('should find and return all activities if updated earlier', async () => {
      try {
        let updated = utils.calculateDate('-1 minutes')
        let activities = await Activity.findManyActiveByAuthor(args.author, updated)

        expect(activities).to.have.lengthOf(args.n)
        activities.forEach(activity => {
          expect(activity.author).to.deep.equal(args.author)
          expect(activity.active).to.be.true
          expect(updated).to.be.lessThan(activity.updated)
        })
      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('should not find  activities if updated later', async () => {
      try {
        let updated = utils.calculateDate('1 minute')
        let activities = await Activity.findManyActiveByAuthor(args.author, updated)
        expect(activities).to.have.lengthOf(0)
      } catch (err) {
        expect(err).to.not.exist
      }
    })

  })

  describe('findNewActivitiesTimeline', () => {
    const author = ObjectId()
    const types = ['story_updated', 'story_created', 'page_created', 'new_content']
    const args = types.map(type => {
      return {
        author,
        type,
        data: {
          storyId: ObjectId()
        }
      }
    })

    beforeEach(async () => {
      // create multiple activities
      for (let arg of args) {
        await activityFaker(arg)
      }
    })
    afterEach(async () => {
      await initAfter()
    })

    it('should find and return all activities if updated earlier', async () => {
      try {
        let updated = utils.calculateDate('-1 minutes')
        let activities = await Activity.findNewActivitiesTimeline(author, updated)

        // check if all activities have different types that match types from before hook
        let actualTypes = activities.map(a => a.type).sort()
        expect(actualTypes).to.deep.equals(types.sort())

        expect(activities).to.have.lengthOf(types.length)
        activities.forEach(activity => {
          expect(activity.author).to.deep.equal(author)
          expect(activity.active).to.be.true
          expect(updated).to.be.lessThan(activity.updated)
        })
      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('should not find  activities if updated later', async () => {
      try {
        let updated = utils.calculateDate('1 hour')
        let activities = await Activity.findNewActivitiesTimeline(author, updated)
        expect(activities).to.have.lengthOf(0)
      } catch (err) {
        expect(err).to.not.exist
      }
    })

  })

  describe('delaySocialQuery', () => {

    it('should return same date if not good type', async () => {
      let activity = {
        type: 'story_updated'
      }
      let date = new Date()

      let result = delaySocialQuery(activity, date)
      expect(result).to.deep.equals(date)
      // console.log('res', result)
    })

    it('should return same date if first arg not obj', async () => {
      let date = new Date()
      let firstArg = [
        null,
        undefined,
        0,
        false,
        34,
        'asdf',
        []
      ]
      firstArg.forEach(arg => {
        let result = delaySocialQuery(arg, date)
        expect(result).to.deep.equals(date)
      })
    })

    it('should return 1 hour later date if not good type', async () => {
      let activity = {
        type: 'story_created'
      }
      let date = new Date()

      let result = delaySocialQuery(activity, date)
      let diff = Math.abs(result - date)
      expect(diff).to.equals(3600 * 1000) // 1 hour difference in milliseconds
    })

  })

  describe('findNewActivitiesSocial', () => {
    const types = ['story_updated', 'story_created', 'system_message', 'story_shared']
    const authors = createOIDs(types.length)
    const args = types.map((type, index) => {
      let obj = {
        author: authors[index],
        type: 'system_message'
      }
      if (type !== 'system_message') {
        Object.assign(obj, {
          type,
          data: {
            storyId: ObjectId()
          }
        })
      }
      return obj
    })

    beforeEach(async () => {
      // create multiple activities
      for (let arg of args) {
        await activityFaker(arg)
      }
    })
    afterEach(async () => {
      await initAfter()
    })

    it('should find all activities except delayed', async () => {
      try {
        let rules = [
          '-60 minutes', '-1 minutes', '-1 hour', '-59 minutes'
        ]

        for (let rule of rules) {
          let updated = utils.calculateDate(rule)
          let activities = await Activity.findNewActivitiesSocial(authors, updated)

          expect(activities).to.have.lengthOf(3)
          let actualTypes = activities.map(a => a.type)
          expect(actualTypes).to.not.includes('story_created')

          activities.forEach(activity => {
            expect(authors.map(a => a.toString())).to.includes(activity.author.toString())
            expect(activity.active).to.be.true
            expect(updated).to.be.lessThan(activity.updated)
          })
        }
      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('should find all activities, with delayed act.', async () => {
      try {
        let rules = [
          '-61 minutes', '-123 minutes', '-2 hour', '-159 minutes'
        ]

        for (let rule of rules) {
          let updated = utils.calculateDate(rule)
          let activities = await Activity.findNewActivitiesSocial(authors, updated)

          expect(activities).to.have.lengthOf(4)
          let actualTypes = activities.map(a => a.type)
          expect(actualTypes).to.includes('story_created')

          activities.forEach(activity => {
            expect(authors.map(a => a.toString())).to.includes(activity.author.toString())
            expect(activity.active).to.be.true
            expect(updated).to.be.lessThan(activity.updated)
          })
        }
      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('should not find and return all activities if updated earlier', async () => {
      try {
        let updated = utils.calculateDate('11 minutes')
        let activities = await Activity.findNewActivitiesSocial(authors, updated)

        expect(activities).to.have.lengthOf(0) //TODO: system message created, model ?
      } catch (err) {
        expect(err).to.not.exist
      }
    })

  })

  describe('findNewActivitiesCollaboration', () => {

    let authorId = ObjectId()
    let storyIds = createOIDs(4)
    let storyArgs = [
      // #1
      {
        id: storyIds[0],
        author: authorId
      },
      // #2
      {
        id: storyIds[1],
        collaborators: [
          {author: authorId, edit: true}
        ]
      },
      // #3
      {
        id: storyIds[2],
        collaborators: [
          {author: authorId, edit: true}
        ]
      },
      // #4 two more random stories
      { n: 2 }
    ]
    let activityArgs = [
      {
        type: 'collaboration_removed',
        author: authorId,
        data: {
          storyId: storyIds[0],
        }
      },
      {
        type: 'collaboration_added',
        data: {
          storyId: storyIds[1],
          collaboratorId: authorId
        }
      },
      {
        type: 'collaboration_leaved',
        author: authorId,
        data: {
           storyId: storyIds[2]
        }
      },

    ]

    beforeEach(async () => {
      // create multiple stories
      for (let arg of storyArgs  ) {
        await storyFaker(arg)
      }
      // create multiple activities
      for (let arg of activityArgs ) {
        await activityFaker(arg)
      }
    })
    afterEach(async () => {
      await initAfter()
    })

    it('should find activities if updated later', async () => {
      try {
        let updated = utils.calculateDate('-30 minutes')
        let activities = await Activity.findNewActivitiesCollaboration(authorId, updated)

        let expected = [
          activities[0]['author'],
          activities[1]['data']['collaboratorId'],
          activities[2]['author']
        ]
        expected.forEach(item => {
          expect(item).to.deep.equals(authorId)
        })

      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('should not find and return all activities if updated earlier', async () => {
      try {
        let updated = utils.calculateDate('11 minutes')
        let activities = await Activity.findNewActivitiesCollaboration(authorId, updated)

        expect(activities).to.have.lengthOf(0) //TODO: system message created, model ?
      } catch (err) {
        expect(err).to.not.exist
      }
    })

  })

})