
//  assertions
import chai from 'chai'
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'
// services
import activityTypes from '../../src/lib/activityTypes'
import {ObjectId} from 'mongodb'
import { initBefore, initAfter } from '../setup'
// fixtures
import fixtures from '../fixtures'
// handles
import activityHndl from '../../src/handles/activities.handles'
// fakers
import authorFaker from '../fixtures/faker/author/author.faker'
import storyFaker from '../fixtures/faker/story/story.faker'
import activityFaker from '../fixtures/faker/activity/activity.faker'
// models
import { Author } from '../../src/models/author/index.js'
import { Activity } from '../../src/models/activity'
// utils
import { createOIDs, calculateDate } from '../../src/lib/utils'

const authors = fixtures.collections.authors

describe('Activities handles tests...', async () => {

  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('save last activities check', () => {
    let user = authors[0]
    it('should not update last activity check properties', async () => {
      try {
        let user = authors[1]
        let newActivityCheck = {}

        let result = await activityHndl.saveLastActivitiesCheck(user._id, newActivityCheck)

        expect(new Date(result.lastActivityCheck.timeline)).to.deep.equals(new Date(user.lastActivityCheck.timeline))
        expect(new Date(result.lastActivityCheck.social)).to.deep.equals(new Date(user.lastActivityCheck.social))
        expect(new Date(result.lastActivityCheck.collaboration)).to.deep.equals(new Date(user.lastActivityCheck.collaboration))
      } catch (err) {
        expect(err).to.not.exist
      }
    })
    it('should update only one activity check property', async () => {
      try {
        let newActivityCheck = {
          timeline: new Date()
        }

        let result = await activityHndl.saveLastActivitiesCheck(user._id, newActivityCheck)

        expect(result.lastActivityCheck.timeline).to.equals(newActivityCheck.timeline)
        expect(result.lastActivityCheck.social).to.exist.and.not.equal(newActivityCheck.timeline)
        expect(result.lastActivityCheck.collaboration).to.exist.and.not.equal(newActivityCheck.timeline)

      } catch (err) {
        expect(err).to.not.exist
      }
    })
    it('should update only two last activity check properties', async () => {
      try {
        let newActivityCheck = {
          timeline: new Date(),
          social: new Date()
        }

        let result = await activityHndl.saveLastActivitiesCheck(user._id, newActivityCheck)

        expect(result.lastActivityCheck.timeline).to.equals(newActivityCheck.timeline)
        expect(result.lastActivityCheck.social).to.exist.and.equals(newActivityCheck.social)
        expect(result.lastActivityCheck.collaboration).to.exist.and.not.equal(newActivityCheck.timeline)
      } catch (err) {
        expect(err).to.not.exist
      }
    })
    it('should update all three of last activity check properties', async () => {
      try {
        let newActivityCheck = {
          timeline: new Date(),
          social: new Date(),
          collaboration: new Date()
        }

        let result = await activityHndl.saveLastActivitiesCheck(user._id, newActivityCheck)

        expect(result.lastActivityCheck.timeline).to.equals(newActivityCheck.timeline)
        expect(result.lastActivityCheck.social).to.exist.and.equals(newActivityCheck.social)
        expect(result.lastActivityCheck.collaboration).to.exist.and.equals(newActivityCheck.collaboration)
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('get new timeline activities', () => {

    it('should return all timeline activites based on input filter', async () => {
      try {
        let user = authors[0]
        // set last activity check in the past
        user.lastActivityCheck.timeline = new Date(2017, 4, 4)

        let filter = ["stories", "contents"]
        let result = await activityHndl.getNewTimelineActivities(user, filter)

        expect(result).to.be.an('array').lengthOf(4)

        result.forEach(item => {
          // check for activity type, need to be 'timeline'
          let type = activityTypes[item.type]['tab']
          let filter = activityTypes[item.type]['filter']
          assert.equal(type === 'timeline' || type.includes('timeline'), true)
          assert.equal(filter === 'stories' || filter === "contents", true)
          // check for date
          let activityUpdated = item.updated
          expect(activityUpdated).to.be.greaterThan(user.lastActivityCheck.timeline)
        })
      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('should return "stories" timeline activites based on input filter', async () => {
      try {
        let user = authors[0]
        // set last activity check in the past
        user.lastActivityCheck.timeline = new Date(2017, 4, 4)

        let filter = ["stories"]
        let result = await activityHndl.getNewTimelineActivities(user, filter)

        expect(result).to.be.an('array').lengthOf(3)

        result.forEach(item => {
          // check for activity type, need to be 'timeline'
          let type = activityTypes[item.type]['tab']
          let filter = activityTypes[item.type]['filter']
          assert.equal(type === 'timeline' || type.includes('timeline'), true)
          assert.equal(filter === 'stories', true)
          // check for date
          let activityUpdated = item.updated
          expect(activityUpdated).to.be.greaterThan(user.lastActivityCheck.timeline)
        })
      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('should return "contents" timeline activites based on input filter', async () => {
      try {
        let user = authors[0]
        // set last activity check in the past
        user.lastActivityCheck.timeline = new Date(2017, 4, 4)

        let filter = ["contents"]
        let result = await activityHndl.getNewTimelineActivities(user, filter)

        expect(result).to.be.an('array').lengthOf(1)

        result.forEach(item => {
          // check for activity type, need to be 'timeline'
          let type = activityTypes[item.type]['tab']
          let filter = activityTypes[item.type]['filter']
          assert.equal(type === 'timeline' || type.includes('timeline'), true)
          assert.equal(filter === 'contents', true)
          // check for date
          let activityUpdated = item.updated
          expect(activityUpdated).to.be.greaterThan(user.lastActivityCheck.timeline)
        })
      } catch (err) {
        expect(err).to.not.exist
      }
    })

  })

  describe('get new social activities', () => {

    it('should return all social activites based on input filter', async () => {
      try {
        let user = authors[1]
        let filter = ["stories", "system_message"]
        // set last activity check in the past
        user.lastActivityCheck.social = new Date(2017, 4, 4)

        let result = await activityHndl.getNewSocialActivities(user, filter)
        // expect(result).to.be.an('array').lengthOf(4)

        result.forEach(item => {
          // check for activity type, must be 'social'
          let type = activityTypes[item.type]['tab']
          assert.equal(type === 'social' || type.includes('social'), true)
          // check for date
          let activityUpdated = item.updated
          expect(activityUpdated).to.be.greaterThan(user.lastActivityCheck.social)
        })
      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('should return social system message activites based on input filter', async () => {
      try {
        let user = authors[1]
        let filter = ["system_message"]
        // set last activity check in the past
        user.lastActivityCheck.social = new Date(2017, 4, 4)

        let result = await activityHndl.getNewSocialActivities(user, filter)

        expect(result).to.be.an('array').lengthOf(2)

        result.forEach(item => {
          // check for activity type, must be 'social'
          let type = activityTypes[item.type]['tab']
          let filter = activityTypes[item.type]['filter']
          assert.equal(type === 'social' || type.includes('social'), true)
          assert.equal(filter === 'system_message', true)
          // check for date
          let activityUpdated = item.updated
          expect(activityUpdated).to.be.greaterThan(user.lastActivityCheck.social)
          expect(item.data).to.have.property('message')
        })
      } catch (err) {
        expect(err).to.not.exist
      }
    })

    // it('should return social stories activites based on input filters', async () => {
    //   try {
    //     let user = authors[1]
    //     let filter = ["stories"]
    //     // set last activity check in the past
    //     user.lastActivityCheck.social = new Date(2017, 4, 4)

    //     let result = await activityHndl.getNewSocialActivities(user, filter)
    //     console.log('res', result)

    //     expect(result).to.be.an('array').lengthOf(2)

    //     result.forEach(item => {
    //       // check for activity type, must be 'collaboration'
    //       let type = activityTypes[item.type]['tab']
    //       let filter = activityTypes[item.type]['filter']
    //       assert.equal(type === 'social' || type.includes('social'), true)
    //       assert.equal(filter === 'stories', true)
    //       // check for date
    //       let activityUpdated = item.updated
    //       expect(activityUpdated).to.be.greaterThan(user.lastActivityCheck.social)
    //     })

    //   } catch (err) {
    //     expect(err).to.not.exist
    //   }
    // })

  })

  describe('get collaboration invites', () => {
    it('should return collaboration invites based on ID', async () => {
      try {
        let user = authors[1]

        let result = await activityHndl.getCollaborationInvites(user._id, "", 1220)

        expect(result).to.be.an('array').lengthOf(4)

        result.forEach(invite => {
          let priorDate = new Date(new Date().setDate(new Date().getDate() - 1220))
          expect(invite).to.have.property('invited').and.deep.equal(ObjectId(user._id))
          expect(invite.created).to.be.greaterThan(priorDate)
        })
      } catch (err) {
        expect(err).to.not.exist
      }
    })
    it('should return collaboration invites based on ID and email', async () => {
      try {
        let user = authors[1]

        let result = await activityHndl.getCollaborationInvites(user._id, user.email, 1220)

        expect(result).to.be.an('array').lengthOf(4)

        result.forEach(invite => {
          let priorDate = new Date(new Date().setDate(new Date().getDate() - 1220))
          if (invite.email) {
            expect(invite).to.have.property('email').and.equals(user.email)
          } else if (invite.invited) {
            expect(invite).to.have.property('invited').and.deep.equals(ObjectId(user._id))
          }
          expect(invite.created).to.be.greaterThan(priorDate)
        })
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('get new group invitations', () => {
    it('should return null if args are not provided', async () => {
      try {
        let result = await activityHndl.getGroupInvitations()
        expect(result).to.be.null
      } catch (err) {
        expect(err).to.not.exist
      }

    })
    it('should return invitation for author', async () => {
      try {
        let author = authors[3]

        let result = await activityHndl.getGroupInvitations(author.id)
        expect(result).to.be.an('array')

        result.forEach(item => {
          expect(item).to.have.property('author')
          expect(item).to.have.property('token')
          expect(item).to.have.property('active')
          expect(item).to.have.property('accepted').and.be.null
          expect(item).to.have.property('invited')
          expect(item.invited.author === author.email || item.invited.email === author.email).to.be.true
        })

      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('get new followers', () => {
    try {
      it('should return list of followers Ids', async () => {

        let user = authors[1]
        let result = await activityHndl.getNewFollowers(user._id, 1000)

        expect(result).to.be.an('array').and.have.lengthOf(1)
        expect(String(result[0])).to.not.be.equal(user._id)
      })
    } catch (err) {
      expect(err).to.not.exist
    }
  })

  describe('get timeline comments', () => {
    it('should get timeline comments', async () => {
      try {
        let user = authors[1]

        let result = await activityHndl.getTimelineComments(user._id, 1000)

        expect(result).to.be.an('array').and.have.lengthOf(1)
        expect(String(result[0]['author'])).to.be.equal(user._id)
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('get new social comments', () => {
    it('should get new social comments', async () => {
      try {
        let user = authors[0]
        user.lastCommentsCheck.social = new Date(2017)

        let result = await activityHndl.getNewSocialComments(user)

        expect(result).to.be.an('array').an.have.lengthOf(4)

        result.forEach(comment => {
          expect(comment.author.toString()).to.not.equals(user._id)
          expect(comment.created).to.be.greaterThan(user.lastCommentsCheck.social)
        })
      } catch (err) {
        expect(err).to.not.exist
      }
    })
    it('should not find any comment', async () => {
      try {
        let user = authors[0]
        user.lastCommentsCheck.social = new Date()

        let result = await activityHndl.getNewSocialComments(user)

        expect(result).to.be.an('array').that.is.empty

      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('get new collaboration comments', () => {
    it('should get new collaboration comments', async () => {
      try {
        let user = authors[1]
        user.lastCommentsCheck.collaboration = new Date(2017)

        let result = await activityHndl.getNewCollaborationComments(user)

         expect(result).to.be.an('array').an.have.lengthOf(1)

         result.forEach(comment => {
           expect(comment.author.toString()).to.not.equals(user._id)
           expect(comment.created).to.be.greaterThan(user.lastCommentsCheck.collaboration)
         })
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('isAllowedToReceiveActivity', () => {
    it('should not allowed if type collaboration share false and author', () => {
      let user = {
        _id: ObjectId()
      }
      let act = {
        author: user._id.toString(),
        type: 'collaboration_share_false'
      }

      let res = activityHndl.isAllowedToReceiveActivity(act, user)
      expect(res).to.be.false
    })
    it('should allowed', () => {
      let user = {
        _id: ObjectId()
      }
      let act = {
        author: user._id.toString(),
        type: 'collaboration_add'
      }

      let res = activityHndl.isAllowedToReceiveActivity(act, user)
      expect(res).to.be.true
    })
  })

  describe('activity messages matrix', () => { //TODO: finish with more activity types
    it('should return string', () => {
      const activityTypes = [
        'collaboration_added',
        'collaboration_removed',
        // 'collaboration_leaved',
      ]

      const innerTypes = [
        'by_you',
        'by_someone',
        'you'
      ]

      const title = 'random title'
      const collaboratorUsername = {username: 'loreme'}

      activityTypes.forEach(activityType => {
        innerTypes.forEach(innerType => {
          let res = activityHndl.activityMessagesMatrix(
            activityType,
            title,
            collaboratorUsername)[innerType]('hoj')
          expect(res).to.be.a('string').and.not.include('undefined')
        })
      })
    })

    it('should return empty string', () => {
      const activityTypes = [
        'collaboration_fake1',
        'collaboration_fake2',
      ]

      const innerTypes = [
        'by_you',
        'by_someone',
        'you'
      ]

      const title = 'random title'
      const collaboratorUsername = {username: 'loreme'}

      activityTypes.forEach(activityType => {
        innerTypes.forEach(innerType => {
          let res = activityHndl.activityMessagesMatrix(
            activityType,
            title,
            collaboratorUsername)[innerType]('hoj')
          expect(res).to.equal('')
        })
      })

    })
  })

  describe('new collaboration activities for adding and removing collaborator', () => {
    let fakerAuthors, stories

    beforeEach(async () => {
      // delete fixtures
      await initAfter()

      // create authors
      fakerAuthors = createOIDs(6)

      for (let author of fakerAuthors) {
        await authorFaker({
          id: author
        })
      }

      // create story
      let storyArgs = {
        author: fakerAuthors[0],
        collaborators: [
          ...fakerAuthors.map((a, index) => {
            // add collaborators from right index values from fakers
            if (index == 1 || index == 2 || index == 3) {
              return {
                author: a,
                edit: true
              }
            }
          }).filter(a => !!a)
        ]
      }

      stories = await storyFaker(storyArgs)
      // create activity / add collaborator
      let activityArgs = [{
        author: fakerAuthors[0],
        type: 'collaboration_added',
        updated: calculateDate('1 minute'),
        created: calculateDate('1 minute'),
        data: {
          collaboratorId: fakerAuthors[3],
          storyId: stories[0]._id,
        }
      }, {
        author: fakerAuthors[0],
        type: 'collaboration_removed',
        updated: calculateDate('1 minute'),
        created: calculateDate('1 minute'),
        data: {
          collaboratorId: fakerAuthors[3],
          storyId: stories[0]._id,
        }
      }, 
      // {
      //   author: fakerAuthors[0],
      //   type: 'collaboration_invitation_sent',
      //   updated: calculateDate('1 minute'),
      //   created: calculateDate('1 minute'),
      //   data: {
      //     collaboratorId: fakerAuthors[3],
      //     storyId: stories[0]._id,
      //   }
      // }
    ]
      for (let arg of activityArgs) {
        await activityFaker(arg)
      }
    })

    afterEach(async () => {
      await initAfter()
    })

    it('should (not) find activities for different users, type collaboration_add', async () => {
      try {
        for (const index of fakerAuthors.keys()) {

          let author = await Author.findById(fakerAuthors[index])
          let result = await activityHndl.getNewCollaborationActivities(author)

          // console.log(JSON.stringify(result, null, 2))
          if (index > 3) {
            expect(result).to.be.an('array').that.is.empty
          } else {
            expect(result).to.be.an('array').that.is.not.empty
            let keys = ['_id', 'active', 'type', 'data']
            // test activitiy keys
            result.forEach(entry => {
              keys.forEach(key => {
                expect(entry[key]).to.exist
              })
            })
          }
        }
      } catch (err) {
        expect(err).to.not.exist
      }
    })

    let expectedTypes = [
      ['collaboration_added_by_you', 'collaboration_removed_by_you'],
      ['collaboration_added_by_someone', 'collaboration_removed_by_someone'],
      ['collaboration_added_by_someone', 'collaboration_removed_by_someone'],
      ['collaboration_added_you', 'collaboration_removed_you'],
    ]
    for (let [index, type] of expectedTypes.entries()) {
      it(`"resolveActivityTypeMessage" should sort activities and add message for expected types ${type}`, async () => {
        try {
          let authorId = fakerAuthors[index]
          let activities = await Activity.findNewActivitiesCollaboration(authorId, calculateDate('-3 minutes'))
          let user = await Author.findById(authorId)
          let result = await activityHndl.resolveActivityTypeMessage(activities, user)
          result.forEach((res, i) => expect(res.type).to.equals(type[i]))

        } catch (err) {
          expect(err).to.not.exist
        }
      })
    }

    describe('get new collaboration activities', () => {

      it('should return all collaboration activites based on filter', async () => {
        try {
          let userId = fakerAuthors[0]
          let user = await Author.findById(userId)
          let filter = ["stories", "invitations"]
          // set last activity check in the past
          user.lastActivityCheck.collaboration = new Date(2017, 4, 4)
          let result = await activityHndl.getNewCollaborationActivities(user, filter)
          expect(result).to.be.an('array').lengthOf(2)

          result.forEach(item => {
            expect(item.type.startsWith('collaboration')).to.be.true
            let activityUpdated = item.updated
            expect(activityUpdated).to.be.greaterThan(user.lastActivityCheck.collaboration)
          })

        } catch (err) {
          expect(err).to.not.exist
        }
      })

      it('should return stories collaboration activites based on filter', async () => {
        try {
          let userId = fakerAuthors[0]
          let user = await Author.findById(userId)
          let filter = ["stories"]
          // set last activity check in the past
          user.lastActivityCheck.collaboration = new Date(2017, 4, 4)

          let result = await activityHndl.getNewCollaborationActivities(user, filter)
          expect(result).to.be.an('array').lengthOf(2)

          result.forEach(item => {
            expect(item.type.startsWith('collaboration')).to.be.true
            let activityUpdated = item.updated
            expect(activityUpdated).to.be.greaterThan(user.lastActivityCheck.collaboration)
          })

        } catch (err) {
          expect(err).to.not.exist
        }
      })

      it.skip('should return invitations collaboration activites based on filter', async () => {
        try {
          let user = authors[0]
          let filter = ["invitations"]
          // set last activity check in the past
          user.lastActivityCheck.collaboration = new Date(2017, 4, 4)

          let result = await activityHndl.getNewCollaborationActivities(user, filter)
          expect(result).to.be.an('array').lengthOf(2)

          result.forEach(item => {

            let type = activityTypes[item.type]['tab']
            let filter = activityTypes[item.type]['filter']
            assert.equal(type === 'collaboration' || type.includes('collaboration'), true)
            assert.equal(filter === 'invitations', true)
            // check for date
            let activityUpdated = item.updated
            expect(activityUpdated).to.be.greaterThan(user.lastActivityCheck.collaboration)
          })

        } catch (err) {
          expect(err).to.not.exist
        }
      })

    })

  })

})
