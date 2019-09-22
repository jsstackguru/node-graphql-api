
//  assert
import chai from 'chai'
import { assert, expect } from 'chai'
import should from 'should'
import chaiHttp from 'chai-http'
import server from '../setup/server'
// libs
import translate from '../../src/lib/translate'

// fistures
import fixtures from '../fixtures'

// services
import { generateToken } from '../../src/services/auth'
import { initAfter, initBefore } from '../setup'

// models
import Story from '../../src/models/story/story.model'

// fakers
import { authorFaker, storyFaker, collaborationInviteFaker, pageFaker } from '../fixtures/faker'

const stories = fixtures.collections.stories
const authors = fixtures.collections.authors
const invites = fixtures.collections.collaboration_invites

chai.use(chaiHttp)

describe('API tests for collaboration', () => {

  describe('collaboration leave', () => {
    let fakeAuthors = []
    let fakeStory = null
    let fakeInvitations

    beforeEach(async () => {
      await initAfter()
      fakeAuthors = []
      fakeStory = null
      // await initBefore()
      fakeAuthors = await authorFaker({
        n: 7
      })
      const newAuthor = await authorFaker({
        single: true,
        email: 'qwerty@istoryapp.com'
      })
      fakeAuthors.push(newAuthor)
      const storyAuthor = fakeAuthors[0]
      const collaborators = [
        {
          author: fakeAuthors[1]._id,
          edit: true
        }
      ]
      const fakePages = await pageFaker({
        n: 3,
        author: storyAuthor._id
      })
      fakePages.push(await pageFaker({
        single: true,
        author: fakeAuthors[1]._id
      }))
      fakeStory = await storyFaker({
        single: true,
        author: storyAuthor._id,
        collaborators,
        pages: fakePages
      })
      fakeInvitations = await Promise.all([
        collaborationInviteFaker({
          single: true,
          invited: null,
          author: storyAuthor._id,
          email: 'test1@istoryapp.com',
          story: fakeStory._id
        }),
        collaborationInviteFaker({
          single: true,
          invited: null,
          author: storyAuthor._id,
          email: 'test2@istoryapp.com',
          story: fakeStory._id
        }),
        collaborationInviteFaker({
          single: true,
          invited: null,
          author: storyAuthor._id,
          email: 'test3@istoryapp.com',
          story: fakeStory._id
        })
      ])
    })
  
    afterEach(async () => {
      await initAfter()
    })

    it('should return error if not authorized', async () => {
      try {
        let response = await chai.request(server)
          .put('/v1/collaboration/2334')
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

    it('should return status and message if everythings\'s ok, delete pages', async () => {
      try {
        const author = fakeAuthors[1]
        const story = fakeStory
        const token = generateToken(author.email)
        const data = {
          deletePages: 'Yes'
        }

        const response = await chai.request(server)
          .put(`/v1/collaboration/${story.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send(data)

        expect(response.body).to.exist
        // expect(response.body).to.have.property('status').and.true
        expect(response.body).to.have.property('message').and.equals("You successfully leaved story")
        let res = response.body.data
        expect(res).to.have.property('_id')
        expect(res).to.have.property('title')
        expect(res).to.have.property('created')
        expect(res).to.have.property('updated')

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return status and message if everythings\'s ok, do not delete pages', async () => {
      try {
        let author = fakeAuthors[1]
        let story = fakeStory
        let token = generateToken(author['email'])
        let data = {
          deletePages: 'false'
        }

        let response = await chai.request(server)
          .put(`/v1/collaboration/${story.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send(data)

        // console.log(JSON.stringify(response.body, null, 2))
        expect(response.body).to.exist
        // expect(response.body).to.have.property('status').and.true
        expect(response.body).to.have.property('message').and.equals("You successfully leaved story")
        let res = response.body.data
        expect(res).to.have.property('_id')
        expect(res).to.have.property('title')
        expect(res).to.have.property('created')
        expect(res).to.have.property('updated')

      } catch (err) {
        should.not.exist(err)
      }
    })

  })

  describe('collaboration remove', () => {
    let fakeAuthors = []
    let fakeStory = null

    before(async () => {
      await initAfter()
      fakeAuthors = await authorFaker({
        n: 5
      })
      const storyAuthor = fakeAuthors[0]
      const collaborators = [
        {
          author: fakeAuthors[1].id,
          edit: true
        },
        {
          author: fakeAuthors[2].id,
          edit: true
        },
        {
          author: fakeAuthors[3].id,
          edit: false
        }
      ]
      const fakePages = await pageFaker({
        n: 3,
        author: storyAuthor._id
      })
      fakePages.push(await pageFaker({
        single: true,
        author: fakeAuthors[1]._id
      }))
      fakeStory = await storyFaker({
        n: 1,
        author: storyAuthor,
        collaborators,
        single: true,
        pages: fakePages
      })
    })

    after(async () => {
      await initAfter()
    })

    it('should return error if not authorized', async () => {
      try {
        let response = await chai.request(server)
          .post('/v1/collaboration/1234/remove')
          .set('Authorization', `Bearer `)

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

    it('should return error if cancel data is missing', async () => {
      try {
        let author = fakeAuthors[0]
        let story = fakeStory
        let token = generateToken(author['email'])
        
        let response = await chai.request(server)
          .post(`/v1/collaboration/${story.id}/remove`)
          .set('Authorization', `Bearer ${token}`)

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__("User ID is missing"))
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return new story(ies)\'s ok', async () => {
      try {
        const author = fakeAuthors[0]
        const story = fakeStory
        const user = fakeAuthors[2]
        const token = generateToken(author.email)
        const data = {
          userId: user.id
        }

        const response = await chai.request(server)
          .post(`/v1/collaboration/${story.id}/remove`)
          .set('Authorization', `Bearer ${token}`)
          .send(data)

        // console.log(JSON.stringify(response.body, null, 2))
        const { body } = response
        expect(body).to.exist
        expect(body).to.have.property('message').and.equals(
          'User is removed from collaboration'
        )
        should(body).be.type('object')
        expect(body).to.have.property('data')
        assert.deepEqual(body.data, [])
        
        // after
        let storyAfter = await Story.findOneActiveById(story.id)
        let collaboratorsAfter = storyAfter.collaborators.map(c => c.author.toString())
        expect(collaboratorsAfter).to.not.include(user.id.toString())
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return new story(ies)\'s ok', async () => {
      try {
        const author = fakeAuthors[0]
        const story = fakeStory
        const user = fakeAuthors[1]
        const user2 = fakeAuthors[2]
        const token = generateToken(author.email)
        const data = {
          userId: [
            user.id,
            user2.id
          ]
        }
        const response = await chai.request(server)
          .post(`/v1/collaboration/${story.id}/remove`)
          .set('Authorization', `Bearer ${token}`)
          .send(data)

        // console.log(JSON.stringify(response.body, null, 2))
        expect(response.body).to.exist
        const { body } = response
        expect(body).to.have.property('message').and.equals(
          "Users are removed from collaboration"
        )
        expect(body).to.have.property('data')
        assert.equal(body.data.length, 1)
        const resultStory = body.data[0]
        should(resultStory).have.property('_id')
        should(resultStory).have.property('title')
        should(resultStory).have.property('status')
        should(resultStory).have.property('pages')
        should(resultStory).have.property('collaborators')
        should(resultStory).have.property('author')
        
        // after
        let storyAfter = await Story.findOneActiveById(story.id)
        let collaboratorsAfter = storyAfter.collaborators.map(c => c.author.toString())
        expect(collaboratorsAfter).to.not.include(user.id.toString())
        expect(collaboratorsAfter).to.not.include(user2.id.toString())
      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('update collaborator', () => {
    let fakeAuthors = []
    let fakeStories = []

    before(async () => {
      await initAfter()
      fakeAuthors = await authorFaker({
        n: 5
      })
      const storyAuthor = fakeAuthors[0]
      const collaborators = [
        {
          author: fakeAuthors[1],
          edit: true
        },
        {
          author: fakeAuthors[2],
          edit: true
        },
        {
          author: fakeAuthors[3],
          edit: false
        }
      ]
      fakeStories = await storyFaker({
        n: 1,
        author: storyAuthor,
        collaborators
      })
    })

    after(async () => {
      await initAfter()
    })

    it('should return error if not authorized', async () => {
      try {
        const response = await chai.request(server)
          .patch('/v1/collaboration/1234')
          .set('Authorization', `Bearer `)
          .send({})

        should.exist(response.error)
        const error = response.error
        expect(error.status).to.be.equal(401)
        const errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Authorization token missing'))
        expect(errorText.statusCode).to.be.equal(401)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should update collaborator by author, edit false', async () => {
      try {
        const user = fakeAuthors[0]
        const token = generateToken(user['email'])
        const story = fakeStories[0]
        const author = fakeAuthors[1]
        const response = await chai.request(server)
          .patch(`/v1/collaboration/${story.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            userId: author.id
          })

        expect(response.body).to.exist
        const { body } = response
        expect(body).to.have.property('message')
        expect(body).to.have.property('data')
        const { data } = body
        expect(data).to.have.property('author')
        expect(data).to.have.property('edit')
        const collaborator = data.author
        assert.equal(collaborator._id, author.id)
        assert.equal(data.edit, false)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should update collaborator by author, edit true', async () => {
      try {
        const user = fakeAuthors[0]
        const token = generateToken(user['email'])
        const story = fakeStories[0]
        const author = fakeAuthors[1]
        const response = await chai.request(server)
          .patch(`/v1/collaboration/${story.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            userId: author.id,
            edit: true
          })

        // console.log(JSON.stringify(response.body, null, 2))
        expect(response.body).to.exist
        const { body } = response
        expect(body).to.have.property('message')
        expect(body).to.have.property('data')
        const { data } = body
        expect(data).to.have.property('author')
        expect(data).to.have.property('edit')
        const collaborator = data.author
        assert.equal(collaborator._id, author.id)
        assert.equal(data.edit, true)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should update collaborator by co-author, edit false', async () => {
      try {
        const user = fakeAuthors[2]
        const token = generateToken(user['email'])
        const story = fakeStories[0]
        const author = fakeAuthors[1]
        const response = await chai.request(server)
          .patch(`/v1/collaboration/${story.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            userId: author.id
          })

        expect(response.body).to.exist
        const { body } = response
        expect(body).to.have.property('message')
        expect(body).to.have.property('data')
        const { data } = body
        expect(data).to.have.property('author')
        expect(data).to.have.property('edit')
        const collaborator = data.author
        assert.equal(collaborator._id, author.id)
        assert.equal(data.edit, false)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should update collaborator by co-author, edit true', async () => {
      try {
        const user = fakeAuthors[2]
        const token = generateToken(user['email'])
        const story = fakeStories[0]
        const author = fakeAuthors[1]
        const response = await chai.request(server)
          .patch(`/v1/collaboration/${story.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            userId: author.id,
            edit: true
          })

        expect(response.body).to.exist
        const { body } = response
        expect(body).to.have.property('message')
        expect(body).to.have.property('data')
        const { data } = body
        expect(data).to.have.property('author')
        expect(data).to.have.property('edit')
        const collaborator = data.author
        assert.equal(collaborator._id, author.id)
        assert.equal(data.edit, true)
      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('cancel invitation', () => {
    let fakeAuthors = []
    let fakeStory = null
    let fakeInvitations = []

    before(async () => {
      await initAfter()
      fakeAuthors = await authorFaker({
        n: 7
      })
      const newAuthor = await authorFaker({
        single: true,
        email: 'qwerty@istoryapp.com'
      })
      fakeAuthors.push(newAuthor)
      const storyAuthor = fakeAuthors[0]
      const collaborators = [
        {
          author: fakeAuthors[1]._id,
          edit: true
        }
      ]
      fakeStory = await storyFaker({
        single: true,
        author: storyAuthor._id,
        collaborators
      })
      fakeInvitations = await Promise.all([
        collaborationInviteFaker({
          single: true,
          invited: null,
          author: storyAuthor._id,
          email: 'test1@istoryapp.com',
          story: fakeStory._id
        }),
        collaborationInviteFaker({
          single: true,
          invited: null,
          author: storyAuthor._id,
          email: 'test2@istoryapp.com',
          story: fakeStory._id
        }),
        collaborationInviteFaker({
          single: true,
          invited: null,
          author: storyAuthor._id,
          email: 'test3@istoryapp.com',
          story: fakeStory._id
        })
      ])
    })

    after(async () => {
      await initAfter()
    })

    it('should return error if not authorized', async () => {
      try {
        const response = await chai.request(server)
          .post('/v1/collaboration/cancel')
          .set('Authorization', 'Bearer ')
          .send({})

        should.exist(response.error)
        const error = response.error
        expect(error.status).to.be.equal(401)
        const errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Authorization token missing'))
        expect(errorText.statusCode).to.be.equal(401)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return error if story is not defined', async () => {
      try {
        const author = fakeAuthors[0]
        const token = generateToken(author.email)
        const response = await chai.request(server)
          .post('/v1/collaboration/cancel')
          .set('Authorization', `Bearer ${token}`)
          .send({})

        should.exist(response.error)
        const error = response.error
        expect(error.status).to.be.equal(400)
        const errorText = JSON.parse(error.text)
        expect(errorText.name).to.be.equal('BadRequest')
        expect(errorText.message).to.be.equal(translate.__('Story ID is missing'))
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return error if story is not defined', async () => {
      try {
        const author = fakeAuthors[0]
        const token = generateToken(author.email)
        const response = await chai.request(server)
          .post('/v1/collaboration/cancel')
          .set('Authorization', `Bearer ${token}`)
          .send({
            storyId: fakeStory._id,
          })

        should.exist(response.error)
        const error = response.error
        expect(error.status).to.be.equal(400)
        const errorText = JSON.parse(error.text)
        expect(errorText.name).to.be.equal('BadRequest')
        expect(errorText.message).to.be.equal(translate.__('Missing user\'s emails'))
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return error if user don\'t have permission', async () => {
      try {
        const token = generateToken('qwerty@istoryapp.com')
        const response = await chai.request(server)
          .post('/v1/collaboration/cancel')
          .set('Authorization', `Bearer ${token}`)
          .send({
            storyId: fakeStory._id,
            emails: [
              'test2@istoryapp.com'
            ]
          })

        should.exist(response.error)
        const error = response.error
        expect(error.status).to.be.equal(403)
        const errorText = JSON.parse(error.text)
        expect(errorText.name).to.be.equal('Forbidden')
        expect(errorText.message).to.be.equal(translate.__('You don\'t have permission for this action'))
        expect(errorText.statusCode).to.be.equal(403)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should cancel invitation by an email', async () => {
      try {
        const author = fakeAuthors[0]
        const token = generateToken(author.email)
        const response = await chai.request(server)
          .post('/v1/collaboration/cancel')
          .set('Authorization', `Bearer ${token}`)
          .send({
            storyId: fakeStory._id,
            emails: [
              'test3@istoryapp.com'
            ]
          })

          // console.log(JSON.stringify(response.body, null, 2))
          expect(response.body).to.exist
          const { body } = response
          expect(body).to.have.property('message')
          expect(body).to.have.property('status')
          assert.equal(body.status, true)
          assert.equal(body.message, 'The 1 invitation(s) has been cancelled successfully')
      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('add collaborator', () => {
    let fakeAuthors = []
    let fakeStories = []

    before(async () => {
      await initAfter()
      fakeAuthors = await authorFaker({
        n: 5
      })
      const storyAuthor = fakeAuthors[0]
      const collaborators = [
        {
          author: fakeAuthors[1],
          edit: true
        },
        {
          author: fakeAuthors[2],
          edit: true
        },
        {
          author: fakeAuthors[3],
          edit: false
        }
      ]
      fakeStories = await storyFaker({
        n: 1,
        author: storyAuthor,
        collaborators
      })
    })

    after(async () => {
      await initAfter()
    })

    it('should return error if not authorized', async () => {
      try {
        const response = await chai.request(server)
          .post('/v1/collaboration/1234')
          .set('Authorization', `Bearer `)
          .send({})

        should.exist(response.error)
        const error = response.error
        expect(error.status).to.be.equal(401)
        const errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Authorization token missing'))
        expect(errorText.statusCode).to.be.equal(401)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should not add collaborator, user is missing', async () => {
      try {
        const user = fakeAuthors[0]
        const token = generateToken(user['email'])
        const story = fakeStories[0]
        const author = fakeAuthors[1]
        const response = await chai.request(server)
          .post(`/v1/collaboration/${story.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            userIds: []
          })

        should.exist(response.error)
        const error = response.error
        expect(error.status).to.be.equal(400)
        const errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Bad parameters'))
        expect(errorText.statusCode).to.be.equal(400)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should not add collaborator, collaborator already exist', async () => {
      try {
        const user = fakeAuthors[0]
        const token = generateToken(user['email'])
        const story = fakeStories[0]
        const author = fakeAuthors[1]
        const response = await chai.request(server)
          .post(`/v1/collaboration/${story.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            collaborators: {
              userIds: [
                {
                  id: author.id,
                  edit: false
                }
              ],
              emailAddresses: []
            }
          })
        
        should.exist(response.error)
        const error = response.error
        expect(error.status).to.be.equal(422)
        const errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(
          translate.__('User is already collaborator on this Story')
        )
        expect(errorText.statusCode).to.be.equal(422)
      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
      }
    })

    it('should add collaborator, edit false', async () => {
      try {
        const user = fakeAuthors[0]
        const token = generateToken(user['email'])
        const story = fakeStories[0]
        const author = fakeAuthors[4]
        const response = await chai.request(server)
          .post(`/v1/collaboration/${story.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            collaborators: {
              userIds: [
                {
                  id: author.id,
                  edit: false
                }
              ],
              emailAddresses: []
            }
          })
        
        expect(response.body).to.exist
        const { body } = response
        expect(body).to.have.property('data')
        const { data } = body
        assert.deepEqual(data.length, 1)
        const collaborator = data[0]
        expect(collaborator).to.have.property('_id')
        expect(collaborator).to.have.property('name')
        expect(collaborator).to.have.property('username')
        expect(collaborator).to.have.property('avatar')
        assert.equal(collaborator._id, author.id)
      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
      }
    })
  })
})
