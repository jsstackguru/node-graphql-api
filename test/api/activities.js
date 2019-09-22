
//  assert
import chai from 'chai'
import { assert, expect } from 'chai'
import should from 'should'
import chaiHttp from 'chai-http'
import server from '../setup/server'
// model
import { Author } from '../../src/models/author'
import { Following } from '../../src/models/following'
import CollaborationInvite from '../../src/models/collaboration-invite'
import { Story } from '../../src/models/story'
import { Activity } from '../../src/models/activity'
// libs
import translate from '../../src/lib/translate'
// utils
import { createOIDs, calculateDate } from '../../src/lib/utils'
// fakers
import authorFaker from '../fixtures/faker/author'
import storyFaker from '../fixtures/faker/story'
import activityFaker from '../fixtures/faker/activity/activity.faker'
// fistures
import fixtures from '../fixtures'
// services
import { generateToken } from '../../src/services/auth'
// setup
import { initBefore, initAfter } from '../setup'
// gql keys
import { gqlKeys } from '../../src/routes/graphQueriesVars'

const authors = fixtures.collections.authors
const stories = fixtures.collections.stories
const expectedAuthorKeys = gqlKeys.author.root.sort()

chai.use(chaiHttp)

describe('should test API for activity...', () => {
  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('Save last activity check', () => {
    it('should return error if not authorized', async () => {
      try {

        let response = await chai.request(server)
          .post('/v1/authors/fakeId/activities')
          .set('Authorization', `Bearer `)
          .send({})

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(401)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Authorization token missing'))
        expect(errorText.statusCode).to.be.equal(401)

      } catch (err) {
        should.not.exist(err)
      }
    })
    it('should return error if parameter id is not valid objectId', async () => {
      try {
        let author = authors[1]
        let token = generateToken(author['email'])
        let authorId = author._id

        let response = await chai.request(server)
          .post('/v1/authors/fakeId/activities')
          .set('Authorization', `Bearer ${token}`)
          .send({})

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('User Id is not a proper ObjectId'))
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return error if parameter not valid date', async () => {
      try {
        let author = authors[1]
        let token = generateToken(author['email'])
        let authorId = author._id
        let newActivityCheck = {
          timeline: 1,
          social: new Date(),
          collaboration: new Date()
        }
        // 1.
        let response = await chai.request(server)
          .post(`/v1/authors/${authorId}/activities`)
          .set('Authorization', `Bearer ${token}`)
          .send(newActivityCheck)

        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Something is wrong with the dates'))
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return error if parameter date is less than last activity check', async () => {
      try {
        let author = authors[1]
        let token = generateToken(author['email'])
        let authorId = author._id
        let newActivityCheck = {
          social: new Date(2017),
        }
        let response = await chai.request(server)
          .post(`/v1/authors/${authorId}/activities`)
          .set('Authorization', `Bearer ${token}`)
          .send(newActivityCheck)

        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Something is wrong with the dates'))
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return error if parameter date is greater than now', async () => {
      try {
        let author = authors[1]
        let token = generateToken(author['email'])
        let authorId = author._id
        let newActivityCheck = {
          social: new Date(2023),
        }
        let response = await chai.request(server)
          .post(`/v1/authors/${authorId}/activities`)
          .set('Authorization', `Bearer ${token}`)
          .send(newActivityCheck)

        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Something is wrong with the dates'))
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return updated author', async () => { //TODO: zavrsi ovo u odnosu na activities route ...
      try {
        let author = authors[1]
        let token = generateToken(author['email'])
        let authorId = author._id

        let newActivityCheck = {
          timeline: new Date(),
          social: new Date(),
          collaboration: new Date()
        }
        let response = await chai.request(server)
          .post(`/v1/authors/${authorId}/activities`)
          .set('Authorization', `Bearer ${token}`)
          .send(newActivityCheck)

        should.exist(response.body)
        expect(response.status).to.be.equal(200)
        expect(response.body.message).to.be.equal('You successfully update activities')
        expect(response.body.status).to.be.true

        // expect(response.body.data._id).to.equal(author._id)
        // assert.deepEqual(new Date(response.body.data.lastActivityCheck.timeline), new Date(newActivityCheck.timeline))
        // assert.deepEqual(new Date(response.body.data.lastActivityCheck.social), new Date(newActivityCheck.social))
        // assert.deepEqual(new Date(response.body.data.lastActivityCheck.collaboration), new Date(newActivityCheck.collaboration))

      } catch (err) {
        should.not.exist(err)
      }
    })

  })

})

/*************************************************/
/******************** | GET | ********************/
/*************************************************/

describe('should test API for activity, GET methods', () => {
  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('check new activities', () => {
    let author = authors[0]
    let token = generateToken(author.email)

    it('it should return error if not authorized ', async () => {
      try {
        let response = await chai.request(server)
          .get(`/v1/storage`)
          .set('Authorization', ``)

        expect(response.error).to.exist
        let error = response.error
        expect(error.status).to.be.equal(401)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Authorization token missing'))
        expect(errorText.statusCode).to.be.equal(401)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('it should return proper response', async () => {
      try {

        let response = await chai.request(server)
          .get('/v1/activities/check')
          .set('Authorization', `Bearer ${token}`)

        // console.log(JSON.stringify(response.body, null, 2))
        expect(response.body).to.exist
        expect(response.status).to.equal(200)
        let data = response.body.data

        let rules = ['timeline', 'social', 'collaboration']
        rules.forEach(item => {
          expect(data[item]).to.be.a('number')
        })

      } catch (err) {
        expect(err).to.not.exist
      }
    })

  })

  describe('check new comments', () => {
    let author = authors[0]
    let token = generateToken(author.email)

    it('it should return error if not authorized ', async () => {
      try {
        let response = await chai.request(server)
          .get(`/v1/activities/comments`)
          .set('Authorization', ``)

        expect(response.error).to.exist
        let error = response.error
        expect(error.status).to.be.equal(401)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Authorization token missing'))
        expect(errorText.statusCode).to.be.equal(401)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('it should return proper response', async () => {
      try {
        let response = await chai.request(server)
          .get('/v1/activities/comments')
          .set('Authorization', `Bearer ${token}`)

        // console.log(JSON.stringify(response.body, null, 2))
        expect(response.body).to.exist
        expect(response.status).to.equal(200)

        let data = response.body.data
        let rules = ['timelineComments', 'newSocialComments', 'newCollaborationComments']
        rules.forEach(rule => {
          expect(data[rule]).to.have.property('total')
        })

      } catch (err) {
        expect(err).to.not.exist
      }
    })

  })

  describe('check new followers', () => {
    let author = authors[0]
    let token = generateToken(author.email)

    before( async () => {
      // create new followers before, for testing purposes
      let newFollowers = [authors[1], authors[2], authors[3], authors[4]]
      for (let follower of newFollowers) {
        await Following.create({
          author: follower['_id'],
          follows: author['_id'],
          active: true
        })
      }
    })


    it('it should return error if not authorized ', async () => {
      try {
        let response = await chai.request(server)
          .get(`/v1/activities/followers`)
          .set('Authorization', ``)

        expect(response.error).to.exist
        let error = response.error
        expect(error.status).to.be.equal(401)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Authorization token missing'))
        expect(errorText.statusCode).to.be.equal(401)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('it should return proper response', async () => {
      try {

        let sort = 'name:desc'
        let page = 1
        let limit = 4
        let endpoints = [
          '/v1/activities/followers',
          `/v1/activities/followers?page=${page}&limit=${limit}&sort=${sort}`,
          `/v1/activities/followers?page=${2}&limit=${1}&sort=${'email:desc'}`
        ]

        // testing one endpoints, different queries
        for (let endpoint of endpoints) {
          let response = await chai.request(server)
            .get(endpoint)
            .set('Authorization', `Bearer ${token}`)

          // console.log(JSON.stringify(response.body, null, 2))
          expect(response.body).to.exist
          expect(response.status).to.equal(200)

          let data = response.body.data
          // test pagination props
          let paginationProps = ['limit', 'page', 'total', 'docs', 'pages']
          paginationProps.forEach(prop => {
            expect(data).to.have.property(prop)
          })

          let docs = data.docs
          docs.forEach(author => {
            let authorKeys = Object.keys(author)
            expect(authorKeys.sort()).to.deep.equal(expectedAuthorKeys.sort())
          })
        }

      } catch (err) {
        expect(err).to.not.exist
      }
    })

  })

  describe('check new invites', () => {
    let author = authors[0]
    let authorsStoryID = stories[0]['_id']
    let token = generateToken(author.email)

    before(async () => {
      // create new invitations before, for testing purposes
      let newInvited = [authors[1], authors[2], authors[3], authors[4]]
      for (let invite of newInvited) {
        await CollaborationInvite.create({
          author: invite['_id'],
          invited: author['_id'],
          story: authorsStoryID,
          edit: true,
          accepted: false
        })
      }
    })

    it('it should return error if not authorized ', async () => {
      try {
        let response = await chai.request(server)
          .get(`/v1/activities/invites`)
          .set('Authorization', ``)

        expect(response.error).to.exist
        let error = response.error
        expect(error.status).to.be.equal(401)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Authorization token missing'))
        expect(errorText.statusCode).to.be.equal(401)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('it should return proper response', async () => {
      try {
        let page = 1
        let limit = 4
        let sort = 'author:desc'

        let endpoints = [
          '/v1/activities/invites',
          `/v1/activities/invites?page=${page}&limit=${limit}&sort=${sort}`,
          `/v1/activities/invites?page=${2}&limit=${'2'}&sort=${'author:asc'}`,
        ]

        // testing one ep, multipe queries
        for (let endpoint of endpoints) {
          let response = await chai.request(server)
            .get(endpoint)
            .set('Authorization', `Bearer ${token}`)

          // console.log(JSON.stringify(response.body, null, 2))
          expect(response.body).to.exist
          expect(response.status).to.equal(200)

          let data = response.body.data
          // test pagination props
          let paginationProps = ['limit', 'page', 'total', 'docs', 'pages']
          paginationProps.forEach(prop => {
            expect(data).to.have.property(prop)
          })

          let docs = data.docs
          docs.forEach(doc => {
            let expectedRootKeys = ['author', 'invited', 'story', 'created', '_id']
            // test root keys
            let rootKeys = Object.keys(doc).sort()
            expect(rootKeys).to.deep.equals(expectedRootKeys.sort())
            // test author keys
            let authorKeys = Object.keys(doc.author).sort()
            expect(authorKeys).to.deep.equals(expectedAuthorKeys)
            // test invited keys
            let invitedKeys = Object.keys(doc.invited).sort()
            expect(invitedKeys).to.deep.equals(expectedAuthorKeys)
            // test story keys
            let storyKeys = Object.keys(doc.story).sort()
            let expectedStoryKeys = gqlKeys.storyMini.root.sort()
            expect(storyKeys).to.deep.equals(expectedStoryKeys)
          })
        }

      } catch (err) {
        expect(err).to.not.exist
      }
    })

  })

  describe.skip('check timeline activities', () => {
    let author = authors[0]
    let token = generateToken(author.email)

    it('it should return error if not authorized ', async () => {
      try {
        let response = await chai.request(server)
          .get(`/v1/activities/timeline`)
          .set('Authorization', ``)

        expect(response.error).to.exist
        let error = response.error
        expect(error.status).to.be.equal(401)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Authorization token missing'))
        expect(errorText.statusCode).to.be.equal(401)

      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('it should return proper response', async () => {
      try {

        let endpoints = [
          '/v1/activities/timeline',
          '/v1/activities/timeline?limit=1&page=1&filter=["audios", "videos", "images"]',
          '/v1/activities/timeline?limit=4&page=1&filter=["audios", "videos",]',
        ]

        for (let endpoint of endpoints) {
          let response = await chai.request(server)
            .get(endpoint)
            .set('Authorization', `Bearer ${token}`)

          // console.log(JSON.stringify(response.body, null, 2))
          expect(response.body).to.exist
          expect(response.status).to.equal(200)

          let data = response.body.data
          // test pagination props
          let paginationProps = ['limit', 'page', 'total', 'docs', 'pages']
          paginationProps.forEach(prop => {
            expect(data).to.have.property(prop)
          })
          let expectedKeys = ['author', 'story', 'contents', 'type', 'created']
          let actualKeys = Object.keys(data.docs[0])
          expect(expectedKeys).to.deep.equals(actualKeys)

          data.docs.forEach(doc => {
            // test author keys
            let actualAuthorKeys = Object.keys(doc.author).sort()
            let expectedAuthorKeys = gqlKeys.author.root.sort()
            expect(actualAuthorKeys).to.deep.equal(expectedAuthorKeys)
            // test story keys
            let actualStoryKeys = Object.keys(doc.story).sort()
            let expectedStoryKeys = gqlKeys.storyMini.root.sort()
            expect(actualStoryKeys).to.deep.equal(expectedStoryKeys)

          })
        }

      } catch (err) {
        expect(err).to.not.exist
      }
    })

  })

  describe('check social activities', () => {
    let author = authors[4]
    let followers = [
      authors[0],
      authors[1],
      authors[2],
      authors[3]
    ]
    let newStory
    before(async () => {
      // add followers
      for (let follower of followers) {
        await Following.create({
          author: follower['id'],
          follows: author._id,
          active: true
        })
      }
      // create story
      newStory = await Story.create({
        author: author['id'],
        title: 'new story title',
        active: true,
        deleted: false,
      })

      // create activity
      let activity = await Activity.create({
        author: author['id'],
        type: 'story_created',
        active: true,
        data: {
          storyId: newStory['id'],
        }
      })

    })

    // let token = generateToken(author.email)

    it('it should return error if not authorized ', async () => {
      try {
        let response = await chai.request(server)
          .get(`/v1/activities/social`)
          .set('Authorization', ``)

        expect(response.error).to.exist
        let error = response.error
        expect(error.status).to.be.equal(401)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Authorization token missing'))
        expect(errorText.statusCode).to.be.equal(401)

      } catch (err) {
        expect(err).to.not.exist
      }
    })

    for (let follow of followers) {
      let author = follow
      let token = generateToken(author.email)

      it(`it should return proper response for ${author.name}`, async () => {
        try {

          let endpoints = [
            '/v1/activities/social',
            '/v1/activities/social?limit=1&page=1',
            '/v1/activities/social?limit=2&page=1&sort=type:asc'
          ]

          for (let endpoint of endpoints) {
            let response = await chai.request(server)
              .get(endpoint)
              .set('Authorization', `Bearer ${token}`)

            // console.log(JSON.stringify(response.body, null, 2))
            expect(response.body).to.exist
            expect(response.status).to.equal(200)

            let data = response.body.data
            // test pagination props
            let paginationProps = ['limit', 'page', 'total', 'docs', 'pages']
            paginationProps.forEach(prop => {
              expect(data).to.have.property(prop)
            })
            let expectedKeys = ['author', 'story', 'message', 'type', 'created']
            let actualKeys = Object.keys(data.docs[0])
            expect(expectedKeys).to.deep.equals(actualKeys)

            data.docs.forEach(doc => {
              if (doc.type !== 'system_message') {
                // test author keys
                let actualAuthorKeys = Object.keys(doc.author).sort()
                let expectedAuthorKeys = gqlKeys.author.root.sort()
                expect(actualAuthorKeys).to.deep.equal(expectedAuthorKeys)
                // test story keys
                let actualStoryKeys = Object.keys(doc.story).sort()
                let expectedStoryKeys = gqlKeys.storyMini.root.sort()
                expect(actualStoryKeys).to.deep.equal(expectedStoryKeys)
              }

            })

          }

        } catch (err) {
          expect(err).to.not.exist
        }
      })

    }

  })

  describe('check collaboration activities', () => {
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
      }]
      for (let arg of activityArgs) {
        await activityFaker(arg)
      }
    })

    afterEach(async () => {
      await initAfter()
    })

    it('it should return error if not authorized ', async () => {
      try {
        let response = await chai.request(server)
          .get(`/v1/activities/collaboration`)
          .set('Authorization', ``)

        expect(response.error).to.exist
        let error = response.error
        expect(error.status).to.be.equal(401)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Authorization token missing'))
        expect(errorText.statusCode).to.be.equal(401)

      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('it should return proper response', async () => {
      try {
        let author = await Author.findById(fakerAuthors[0])
        let token = generateToken(author.email)
        let endpoints = [
          '/v1/activities/collaboration',
          '/v1/activities/collaboration?limit=1&page=1',
          '/v1/activities/collaboration?limit=1&page=1&sort=type:desc'
        ]

        for (let endpoint of endpoints) {
          let response = await chai.request(server)
            .get(endpoint)
            .set('Authorization', `Bearer ${token}`)

          // console.log(JSON.stringify(response.body, null, 2))
          expect(response.body).to.exist
          expect(response.status).to.equal(200)

          let data = response.body.data
          // test pagination props
          let paginationProps = ['limit', 'page', 'total', 'docs', 'pages']
          paginationProps.forEach(prop => {
            expect(data).to.have.property(prop)
          })
          let expectedKeys = ['author', 'story', 'collaborator', 'type', 'created', 'message'].sort()
          let actualKeys = Object.keys(data.docs[0]).sort()
          expect(expectedKeys).to.deep.equals(actualKeys)

          data.docs.forEach(doc => {
            // test author keys
            let actualAuthorKeys = Object.keys(doc.author).sort()
            let expectedAuthorKeys = gqlKeys.author.root.sort()
            expect(actualAuthorKeys).to.deep.equal(expectedAuthorKeys)
            // test collaborator keys
            let actualCollaboratorKeys = Object.keys(doc.collaborator).sort()
            let expectedCollaboratorKeys = gqlKeys.author.root.sort()
            expect(actualCollaboratorKeys).to.deep.equal(expectedCollaboratorKeys)
            // test story keys
            let actualStoryKeys = Object.keys(doc.story).sort()
            let expectedStoryKeys = gqlKeys.storyMini.root.sort()
            expect(actualStoryKeys).to.deep.equal(expectedStoryKeys)
          })

        }

      } catch (err) {
        console.log(err.stack)
        expect(err).to.not.exist
      }
    })

  })

})
