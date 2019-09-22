// assertions
import chai from 'chai'
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'
import moment from 'moment'

// setup
import { initAfter, initBefore } from '../../setup'

// gql resolver
import authorQuery from '../../../src/GQLSchema/queries/author.query'
import activityQuery from '../../../src/GQLSchema/queries/activity.query'

// models
import Author from '../../../src/models/author/author.model'

// fixtures
import authors from '../../fixtures/authors.json'

// fakers
import { commentFaker, authorFaker } from '../../fixtures/faker';


describe('Activity resolvers', () => {

  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('check new activities', () => {
    // extract function to test
    const checkNewActivities = activityQuery.checkNewActivities.resolve

    it('should get number of all new activities ', async () => {
      try {
        let user = authors[1]
        let req = { user }
        let response = await checkNewActivities('', '', req)

        response.should.have.property('timeline').and.have.type('number')
        response.should.have.property('collaboration').and.have.type('number')
        response.should.have.property('social').and.have.type('number')
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('new followers', () => {
    const newFollowers = activityQuery.newFollowers.resolve
    it('should get followers based on number of days you entered', async () => {
      try {
        let user = authors[1]
        let req = { user }
        let args = {
          days: 1000 // after this period pass, test will fail. Increase this number in order to pass test.
        }

        let response = await newFollowers("", args, req)

        expect(response).to.be.an('object')
        response.should.have.property('limit').and.have.type('number')
        response.should.have.property('page').and.have.type('number')
        response.should.have.property('pages').and.have.type('number')
        response.should.have.property('docs')
        expect(response.docs).to.be.an('array').that.is.not.empty

      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe.skip('timeline comments', () => {
    const timelineComments = activityQuery.timelineComments.resolve
    let authors
    let commentAuthor

    before(async () => {
      await initAfter()

      authors = await authorFaker({
        n: 10
      })
      commentAuthor = authors[0]

      await commentFaker({
        n: 5,
        author: commentAuthor._id,
        created: moment().add('-3 days')
      })
    })

    after(async () => {
      await initAfter()
    })

    it('should return timeline comments', async () => {
      try {
        let user = commentAuthor
        let req = { user }
        let args = {
          days: 300
        }

        let response = await timelineComments("", args, req)

        expect(response).to.be.an('object')
        response.should.have.property('limit').and.have.type('number')
        response.should.have.property('page').and.have.type('number')
        response.should.have.property('pages').and.have.type('number')
        response.should.have.property('docs')
        expect(response.docs).to.be.an('array').that.is.not.empty

        response.docs.forEach(item => {
          // expect(item.author).to.equals(user._id)
          expect(item).to.have.property('text')
          expect(item).to.have.property('reply')
        })
      } catch (err) {
        console.log(err.stack)
        expect(err).to.not.exist
      }
    })
  })

  describe('new social comments', () => {
    const newSocialComments = activityQuery.newSocialComments.resolve
    it('should return new social comments', async () => {
      try {
        let user = authors[1]
        let req = { user }
        let args = {
          days: 300
        }

        let response = await newSocialComments("", args, req)

        expect(response).to.be.an('object')
        response.should.have.property('limit').and.have.type('number')
        response.should.have.property('page').and.have.type('number')
        response.should.have.property('pages').and.have.type('number')
        response.should.have.property('docs')
        expect(response.docs).to.be.an('array').that.is.not.empty

        response.docs.forEach(item => {
          expect(item.author.toString()).to.not.equals(user._id)
          expect(item).to.have.property('text')
          expect(item).to.have.property('reply')
        })
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('new collaboration comments', () => {
    const newCollaborationComments = activityQuery.newCollaborationComments.resolve
    it('should return new collaboration comments', async () => {
      try {
        let user = authors[1]
        let req = { user }
        let args = {
          days: 300
        }

        let response = await newCollaborationComments("", args, req)

        expect(response).to.be.an('object')
        response.should.have.property('limit').and.have.type('number')
        response.should.have.property('page').and.have.type('number')
        response.should.have.property('pages').and.have.type('number')
        response.should.have.property('docs')
        expect(response.docs).to.be.an('array').that.is.not.empty

        response.docs.forEach(item => {
          // expect(item.author.toString()).to.not.equals(user._id)
          expect(item).to.have.property('text')
          expect(item).to.have.property('reply')
        })
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('collaboration invites', () => {
    const collaborationInvites = activityQuery.collaborationInvites.resolve
    it('should return collaboration invites ', async () => {
      try {
        let user = authors[1]
        let req = { user }
        let args = {
          days: 1000,
          sort: "created:asc"
        }
        let response = await collaborationInvites("", args, req)

        expect(response).to.be.an('object')
        response.should.have.property('limit').and.have.type('number')
        response.should.have.property('page').and.have.type('number')
        response.should.have.property('pages').and.have.type('number')
        response.should.have.property('docs')
        expect(response.docs).to.be.an('array').that.is.not.empty

        response.docs.forEach(item => {
          expect(item.author.toString()).to.not.equals(user._id)
          expect(item).to.have.property('author')
          expect(item).to.have.property('story')
          expect(item).to.have.property('invited')
          expect(item).to.have.property('active')
          expect(item).to.have.property('created')
          expect(item).to.have.property('email')
          expect(item).to.have.property('accepted')
        })
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('group invites', () => {
    const groupInvites = activityQuery.groupInvites.resolve
    it('should return group invites', async () => {
      try {
        let user = authors[3]
        let req = { user }
        let args = {
          days: 1000,
          sort: "created:asc"
        }
        let res = await groupInvites("", args, req)

        // console.log(JSON.stringify(res, '', 2))
        expect(res).to.be.an('object')
        res.should.have.property('limit').and.have.type('number')
        res.should.have.property('page').and.have.type('number')
        res.should.have.property('pages').and.have.type('number')
        res.should.have.property('docs')
        expect(res.docs).to.be.an('array').that.is.not.empty

        res.docs.forEach(item => {
          expect(item).to.have.property('_id')
          expect(item).to.have.property('author')
          expect(item).to.have.property('token')
          expect(item).to.have.property('updated')
          expect(item).to.have.property('created')
          expect(item).to.have.property('active')
          expect(item).to.have.property('accepted').and.be.null
          expect(item.invited.author == user.id).to.be.true
        })

      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('activity timeline', () => {
    const activityTimeline = activityQuery.activityTimeline.resolve
    it('should return new paginated timeline activities', async () => {
      try {
        let user = authors[0]
        let req = { user }
        let args = {}

        let response = await activityTimeline("", args, req)

        expect(response).to.be.an('object')
        response.should.have.property('limit').and.have.type('number')
        response.should.have.property('page').and.have.type('number')
        response.should.have.property('pages').and.have.type('number')
        response.should.have.property('docs')
        expect(response.docs).to.be.an('array').that.is.not.empty

        response.docs.forEach(item => {
          expect(item.data).to.have.property("storyId")
          expect(item).to.have.property('author')
          expect(item).to.have.property('created')
          expect(item).to.have.property('updated')
        })
      } catch (err) {
        console.log('err', err.stack)
        expect(err).to.not.exist
      }
    })
  })

  describe('activity social', () => {
    const activitySocial = activityQuery.activitySocial.resolve
    it('should return new paginated timeline activities', async () => {
      try {
        let user = authors[0]
        let req = { user }
        let args = {}

        let response = await activitySocial("", args, req)

        expect(response).to.be.an('object')
        response.should.have.property('limit').and.have.type('number')
        response.should.have.property('page').and.have.type('number')
        response.should.have.property('pages').and.have.type('number')
        response.should.have.property('docs')
        // expect(response.docs).to.be.an('array').that.is.not.empty //TODO: fix this!
        response.docs.forEach(item => {
          expect(item).to.have.property('author')
          expect(item).to.have.property('created')
          expect(item).to.have.property('updated')
        })
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe.skip('activity collaboration', () => {
    const activityCollaboration = activityQuery.activityCollaboration.resolve
    it('should return new paginated timeline activities', async () => {
      try {
        let user = authors[0]
        let req = { user }
        let args = {}

        let response = await activityCollaboration("", args, req)

        expect(response).to.be.an('object')
        response.should.have.property('limit').and.have.type('number')
        response.should.have.property('page').and.have.type('number')
        response.should.have.property('pages').and.have.type('number')
        response.should.have.property('docs')
        expect(response.docs).to.be.an('array').that.is.not.empty

        response.docs.forEach(item => {
          expect(item).to.have.property('author')
          expect(item).to.have.property('created')
          expect(item).to.have.property('updated')
        })
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe.skip('activity', () => {
    const getActivity = activityQuery.activity.resolve
    it('should return new activities', async () => {
      try {
        let user = authors[0]
        let req = {user}
        let args = {
          tab: "collaboration"
        }

        let response = await getActivity("", args, req)
        expect(response).to.be.an('object')
        response.should.have.property('limit').and.have.type('number')
        response.should.have.property('page').and.have.type('number')
        response.should.have.property('pages').and.have.type('number')
        response.should.have.property('docs')
        expect(response.docs).to.be.an('array').that.is.not.empty

        response.docs.forEach(item => {
          expect(item).to.have.property('data').that.is.not.empty
          expect(item).to.have.property('type')
        })

      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })
})
