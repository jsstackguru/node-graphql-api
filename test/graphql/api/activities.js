// assertions
import chai from 'chai'
import chaiHttp from 'chai-http'
import should from 'should'
import { expect } from 'chai'
import server from '../../setup/server'
import {initAfter, initBefore} from '../../setup'

// services
import { generateToken } from '../../../src/services/auth'

// models
import { Activity } from '../../../src/models/activity'
import { Story } from '../../../src/models/story'
import { Following } from '../../../src/models/following'

// fixtures
import fixtures from '../../fixtures'

// expected
import timelineActivitiesExpected from '../../fixtures/other/GQL_tests/activities/timeline/timelineActivities.json'
import socialActivitiesExpected from '../../fixtures/other/GQL_tests/activities/social/socialActivities.json'
import collaborationActivitiesExpected from '../../fixtures/other/GQL_tests/activities/collaboration/collaborationActivities.json'

const authors = fixtures.collections.authors
const stories = fixtures.collections.stories

chai.use(chaiHttp)

describe('Activity based queries', () => {

  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('checkNewActivities', () => {
    it('should return proper activities data', async () => {
      try {
        let author = authors[0]
        let token = generateToken(author.email)
        const query = `
          query {
            checkNewActivities {
              timeline
              social
              collaboration
            }
          }
          `
      let response = await chai.request(server)
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({query})

      let expected = {
        data: {
          checkNewActivities: {
            timeline: 4,
            social: 2,
            collaboration: 0
          }
        }
      }

      should.exist(response.body.data)
      expect(response.status).to.equal(200)
      expect(response.body).to.deep.equals(expected)
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })
  })

  describe('checkNewFollowers', () => {
    it('should return followers based on input days', async () => {
      try {
        let author = authors[0]
        let token = generateToken(author.email)
        const query = `
          query {
            newFollowers(days: 1000) {
              docs {
                name
              }
              total
              limit
              page
              pages
            }
          }
          `
      let response = await chai.request(server)
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({query})

      let expected = {
        "data": {
          "newFollowers": {
            "docs": [{
                "name": "nikola"
              }, {
                "name": "sajko"
              },
            ],
            "total": 2,
            "limit": 10,
            "page": 1,
            "pages": 1
          }
        }
      }
      should.exist(response.body.data)
      expect(response.status).to.equal(200)
      expect(response.body).to.deep.equals(expected)
      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
        throw err
      }
    })
  })

  describe('check new comments', () => {
    it('should return all new comments (timeline, social, collaboration)', async () => {
      try {
        let author = authors[1]
        let token = generateToken(author.email)
        const query = `
          query {
            timelineComments {
              total
            }
            newSocialComments {
              total
            }
            newCollaborationComments{
              total
            }
          }
          `
      let response = await chai.request(server)
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({query})

      let expected = {
        data: {
          timelineComments: {
            total: 0
          },
          newSocialComments: {
            total: 1
          },
          newCollaborationComments: {
            total: 1
          }
        }
      }

      should.exist(response.body.data)
      expect(response.status).to.equal(200)
      expect(response.body).to.deep.equals(expected)
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })
  })

  describe('check collaboration invites', () => {
    it('should return collaboration invites', async () => {
      try {
        let author = authors[1]
        let token = generateToken(author.email)
        const query = `
          query {
            collaborationInvites (days: 1000, sort: "created:desc") {
              docs {
                author {
                  name
                }
                invited {
                  username
                  name
                }
                story {
                  title
                }
                created
                email
                _id
              }
            }
          }
          `

        let response = await chai.request(server)
          .post('/graphql')
          .set('Authorization', `Bearer ${token}`)
          .send({query})

        should.exist(response.body.data)
        expect(response.status).to.equal(200)
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })
  })

  describe('check group invites', () => {
    it('should return group invites', async () => {
      try {
        let author = authors[3]
        let token = generateToken(author.email)
        const query = `
          query {
            groupInvites (days: 1000, sort: "created:desc") {
              docs {
                author {
                  name
                }
                invited {
                  author {
                    name
                  }
                  email
                }
              }
              limit
              page
            }
          }
          `

      let response = await chai.request(server)
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({query})

      let expected = {
          "data": {
            "groupInvites": {
              "docs": [
                {
                  "author": {
                    "name": "sasha"
                  },
                  "invited": {
                    "author": {
                      "name": "nikola"
                    },
                    "email": "nidzoliki@istoryapp.com"
                  },
                }
              ],
              "limit": 4,
              "page": 1
            }
          }
      }
      
      should.exist(response.body.data)
      expect(response.status).to.equal(200)
      expect(response.body).to.deep.equals(expected)
      } catch (err) {
        expect(err).to.not.exist
        throw err
      }
    })
  })

  describe('activity', () => {
    it('should return proper data based on filter "timeline"', async () => {
      try {
        let author = authors[0]
        let token = generateToken(author.email)
        const query = `
          query {
            activity(tab: "timeline", limit: 5, sort: "created:desc") {
              docs {
                author {
                  name
                }
                story {
                  title
                }
                page {
                  title
                }
                contents
                type
              }
              total
            }
          }
          `
        let response = await chai.request(server)
          .post('/graphql')
          .set('Authorization', `Bearer ${token}`)
          .send({
            query
          })

        should.exist(response.body.data)
        expect(response.status).to.equal(200)
      } catch (err) {
        expect(err).to.not.exist
      }
    })
    it('should return proper data based on filter "social"', async () => {
      try {
        let author = authors[1]
        let token = generateToken(author.email)
        const query = `
          query {
            activity(tab: "social", limit: 5, sort: "created:desc") {
              docs {
                author {
                  name
                }
                story {
                  title
                }
                type
                contents
              }
              total
            }
          }
          `
        let response = await chai.request(server)
          .post('/graphql')
          .set('Authorization', `Bearer ${token}`)
          .send({
            query
          })
        should.exist(response.body.data)
        expect(response.status).to.equal(200)
      } catch (err) {
        expect(err).to.not.exist
      }
    })
    it('should return proper data based on filter "collaboration"', async () => {
      try {
        let author = authors[0]
        let token = generateToken(author.email)
        const query = `
          query {
            activity(tab: "collaboration", limit: 5, sort: "created:desc") {
              docs {
                author {
                  name
                }
                story {
                  title
                }
                collaborator {
                  name
                }
                type
              }
              total
            }
          }
          `
        let response = await chai.request(server)
          .post('/graphql')
          .set('Authorization', `Bearer ${token}`)
          .send({
            query
          })

        should.exist(response.body.data)
        expect(response.status).to.equal(200)
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('activityTimeline', () => {
    it('should return proper data based on filters', async () => {
      try {
        let author = authors[0]
        let token = generateToken(author.email)
        const query = `
          query {
            activityTimeline(filters: ["stories", "contents"], limit: 5, sort: "created:desc") {
              docs {
                author {
                  name
                }
                story {
                  title
                }
                contents (filters: ["audios", "images", "videos"])
                type
              }
              total
            }
          }
          `
        let response = await chai.request(server)
          .post('/graphql')
          .set('Authorization', `Bearer ${token}`)
          .send({
            query
          })

        should.exist(response.body.data)
        expect(response.status).to.equal(200)
        expect(response.body).to.deep.equals(timelineActivitiesExpected)
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  // describe('activitySocial', () => { //TODO: fixTests
  //   it('should return proper data based on filters', async () => {
  //     try {
  //       let author = authors[3]
  //       let token = generateToken(author.email)
  //       const query = `
  //         query {
  //           activitySocial(filters: ["stories", "system_message"], limit: 5, sort: "created:desc") {
  //             docs {
  //               author {
  //                 name
  //               }
  //               story {
  //                 title
  //               }
  //               message
  //               type
  //             }
  //             total
  //           }
  //         }
  //         `
  //       let response = await chai.request(server)
  //         .post('/graphql')
  //         .set('Authorization', `Bearer ${token}`)
  //         .send({
  //           query
  //         })

  //       console.log(JSON.stringify(response.body, null, 2))
  //       should.exist(response.body.data)
  //       expect(response.status).to.equal(200)
  //       expect(response.body).to.deep.equals(socialActivitiesExpected)
  //     } catch (err) {
  //       expect(err).to.not.exist
  //     }
  //   })
  // })

  describe.skip('activityCollaboration', () => {
    it('should return proper data based on filters', async () => {
      try {
        let author = authors[0]
        let token = generateToken(author.email)
        const query = `
          query {
            activityCollaboration(filters: ["stories", "invitations"], limit: 5, sort: "created:desc") {
              docs {
                author {
                  name
                }
                story {
                  title
                }
                collaborator {
                  name
                }
                type
              }
              total
            }
          }
          `
        let response = await chai.request(server)
          .post('/graphql')
          .set('Authorization', `Bearer ${token}`)
          .send({
            query
          })

        console.log(JSON.stringify(response.body, null, 2))

        should.exist(response.body.data)
        expect(response.status).to.equal(200)
        expect(response.body).to.deep.equals(collaborationActivitiesExpected)
      } catch (err) {
        console.log(err.stack)
        expect(err).to.not.exist
      }
    })
  })

  describe.skip('activityCollaboration before', () => {
    let author = authors[4]
    let collaborator = authors[5]
    let story = stories[4]
    before(async () => {
      let activity = await Activity.create({
        author: author['id'],
        type: 'collaboration_invitation_sent',
        active: true,
        data: {
          storyId: story['id'],
          collaboratorId: collaborator['id']
        }
      })
    })
    it('should work', async () => {
      let author = authors[4]
      let token = generateToken(author.email)
      const query = `
          query {
            activityCollaboration(filters: ["invitations"], limit: 5, sort: "created:desc") {
              docs {
                author {
                  name
                }
                story {
                  title
                }
                collaborator {
                  name
                }
                type
              }
              total
            }
          }
          `
      let response = await chai.request(server)
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query
        })
      
      // console.log(response.body)
    })
  })

  describe('activity Social-timeline', () => {
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

    it('should check timeline for author', async () => {
      // let author = authors[4]
      let token = generateToken(author.email)
      const query = `
          query {
            activityTimeline(filters: ["stories", "contents"]) {
              docs {
                author {
                  name
                }
                story {
                  title
                }
                contents (filters: ["audios", "images", "videos"])
                type
              }
              total
            }
          }
          `
      let response = await chai.request(server)
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query
        })

      expect(response.body).to.exist
      let res = response.body.data.activityTimeline
      expect(res).to.have.property('docs')
      expect(res).to.have.property('total').and.equals(1)

      let expectedKeys = ['author', 'story', 'contents', 'type'].sort()
      let actualKeys = Object.keys(res.docs[0]).sort()

      expect(expectedKeys).to.deep.equal(actualKeys)
    })

    it('should check social activities for new followers', async () => {

      for (let follow of followers) {
        let author = follow
        let token = generateToken(author.email)
        const query = `
            query {
              activitySocial(filters: ["stories", "system_message"], limit: 5, sort: "created:desc") {
                docs {
                  author {
                    name
                  }
                  story {
                    title
                  }
                  message
                  type
                }
                total
              }
            }
            `
        let response = await chai.request(server)
          .post('/graphql')
          .set('Authorization', `Bearer ${token}`)
          .send({
            query
          })
        let res = response.body.data.activitySocial
        let expectedKeys = ['author', 'story', 'type', 'message'].sort()
        let actualKeys = Object.keys(res.docs[0]).sort()
        expect(expectedKeys).to.deep.equal(actualKeys)
        expect(res.docs[0]['story']['title']).to.equals(newStory.title)
      }
    })



  })

})
