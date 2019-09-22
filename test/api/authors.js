/**
 * @file Author API tests
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

//  assert
import chai from 'chai'
import { assert, expect } from 'chai'
import should from 'should'
import chaiHttp from 'chai-http'
import { v4 } from 'node-uuid'

import server from '../setup/server'
// libs
import translate from '../../src/lib/translate'
// fistures
import fixtures from '../fixtures'
// services
import { generateToken } from '../../src/services/auth'
import { ObjectId } from 'mongodb'
// utils
import utils from '../../src/lib/utils'
// setup
import {initAfter, initBefore} from '../setup'
// gql extractor
import gq, {gqlKeys} from '../../src/routes/graphQueriesVars'
// config
import config from '../../src/config'
// models
import { Author } from '../../src/models/author';

// fakers
import { forgotPasswordFaker, authorFaker, storyFaker, followingFaker, pageFaker } from '../fixtures/faker'

const authors = fixtures.collections.authors

chai.use(chaiHttp)

describe('should test API for authors', () => {

  before(async () => {
    await initAfter()
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('Register', () => {

    it('should denied registration by wrong parameters', async () => {
      try {
        let response = await chai.request(server)
          .post('/v1/register')
          .send({})
      } catch (err) {
        should.exist(err)
        assert.equal(err.message, translate.__('Missing parameters'))
        assert.equal(err.statusCode, 400)
      }
    })

    it('should denied registration by wrong passwords', async () => {
      try {
        let response = await chai.request(server)
          .post('/v1/register')
          .send({
            user: {
              username: '!123~P)',
              password: '123123',
              passwordConfirmation: '123122',
              email: 'test@test.com',
              name: '123'
            }
          })

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Insert equal passwords'))
        expect(errorText.statusCode).to.be.equal(400)
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should denied registration by wrong username', async () => {
      try {
        let response = await chai.request(server)
          .post('/v1/register')
          .send({
            user: {
              username: '!123~P)',
              password: '123123',
              passwordConfirmation: '123123',
              email: 'test@test.com',
              name: '123'
            }
          })

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('The username contains illegal characters'))
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
        throw err
      }
    })

    it('should denied registration by username longer then 15 chars', async () => {
      try {
        let response = await chai.request(server)
          .post('/v1/register')
          .send({
            user: {
              username: 'accountfortest123',
              password: '123123',
              passwordConfirmation: '123123',
              email: 'test@test.com',
              name: '123'
            }
          })

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Username is longer then 15 characters'))
        expect(errorText.statusCode).to.be.equal(400)
      } catch (err) {
        should.not.exists(err)
        throw err
      }
    })

    it('should denied registration by wrong email', async () => {
      try {
        let response = await chai.request(server)
          .post('/v1/register')
          .send({
            user: {
              username: 'test123',
              password: '123123',
              passwordConfirmation: '123123',
              email: 'test@test.com~',
              name: '123'
            }
          })

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Insert valid email address'))
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should denied registration by short password', async () => {
      try {
        let response = await chai.request(server)
          .post('/v1/register')
          .send({
            user: {
              username: 'test123',
              password: '123',
              passwordConfirmation: '123',
              email: 'test@test.com',
              name: '123'
            }
          })

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Password must be 6 characters at least'))
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should denied registration by too long password', async () => {
      try {
        let response = await chai.request(server)
          .post('/v1/register')
          .send({
            user: {
              username: 'test123',
              password: '12356789012345678',
              passwordConfirmation: '12356789012345678',
              email: 'test@test.com',
              name: '123'
            }
          })

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Password is longer then 15 characters'))
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should denied registration by taken username', async () => {
      try {
        let response = await chai.request(server)
          .post('/v1/register')
          .send({
            user: {
              username: 'sasha',
              password: '123123',
              passwordConfirmation: '123123',
              email: 'test@test.com',
              name: '123'
            }
          })

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(422)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('The username is already taken'))
        expect(errorText.statusCode).to.be.equal(422)
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should denied registration by taken email', async () => {
      try {
        let response = await chai.request(server)
          .post('/v1/register')
          .send({
            user: {
              username: 'test123',
              password: '123123',
              passwordConfirmation: '123123',
              email: 'sasateodorovic57@istoryapp.com',
              name: '123'
            }
          })

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(422)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('The email is already taken'))
        expect(errorText.statusCode).to.be.equal(422)
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should create new author', async () => {
      try {
        let response = await chai.request(server)
          .post('/v1/register')
          .send({
            user: {
              username: 'test123',
              password: '123123',
              passwordConfirmation: '123123',
              email: 'test@test.com',
              name: '123'
            }
          })

        // console.log(JSON.stringify(response.body, null, 2))
        should(response.body).have.property('data')
        let data = response.body.data

        should(data).have.property('_id')
        should(data).have.property('username')
        assert.equal(data.username, 'test123')
        should(data).have.property('name')
        assert.equal(data.name, '123')
        should(data).have.property('email')
        assert.equal(data.email, 'test@test.com')
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should create new author and accept group invitation', async () => {
      try {
        let response = await chai.request(server)
          .post('/v1/register')
          .send({
            user: {
              username: 'invitation123',
              password: '123123',
              passwordConfirmation: '123123',
              email: 'test@test.com',
              name: '123'
            },
            invitationToken: 'invitation3'
          })

        should(response.body).have.property('data')
        let data = response.body.data

        should(data).have.property('_id')
        should(data).have.property('username')
        assert.equal(data.username, 'invitation123')
        should(data).have.property('name')
        assert.equal(data.name, '123')
        should(data).have.property('email')
        assert.equal(data.email, 'test@test.com')
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should create new author, login and sync', async () => {
      try {
        const email = 'test11@test.com'
        const password = '1234567890'
        await chai.request(server)
          .post('/v1/register')
          .send({
            user: {
              username: 'test123567890',
              password: password,
              passwordConfirmation: password,
              email: email,
              name: '123'
            }
          })

        await Author.updateOne({email: email}, {active: true})

        let response = await chai.request(server)
          .post('/v1/login')
          .send({
            password: password,
            email: email
          })

        should(response.body).have.property('data')
        let data = response.body.data

        should(data).have.property('_id')
        should(data).have.property('username')
        assert.equal(data.username, 'test123567890')
        should(data).have.property('name')
        assert.equal(data.name, '123')
        should(data).have.property('email')
        assert.equal(data.email, email)
        should(data).have.property('token')
        should(data.token).have.property('access')
        should(data.token).have.property('refresh')
        should(data.token).have.property('expired')

        let stories = []
        // create stories
        for (let i = 0; i < 5; i++) {
          // create fake stories
          const pages = await pageFaker({
            n: 3,
            author: data._id,
            status: 'private',
            content: [
              {
                type: 'text',
                text: 'This is a page content',
                contentId: v4(),
                created: new Date()
              }
            ]
          })
          const story = await storyFaker({
            single: true,
            author: data._id,
            status: 'private',
            pages: pages.map(page => page.id)
          })
          stories.push(story)
        }

        let deletedStories = []
        // create deleted stories
        for (let i = 0; i < 2; i++) {
          // create fake stories
          const pages = await pageFaker({
            n: 3,
            author: data._id,
            status: 'private',
            content: [
              {
                type: 'text',
                text: 'This is a page content',
                contentId: v4(),
                created: new Date()
              }
            ],
            deleted: true,
            active: false,
            deletedAt: new Date()
          })
          const story = await storyFaker({
            single: true,
            author: data._id,
            status: 'private',
            pages: pages.map(page => page.id),
            deleted: true,
            active: false,
            deletedAt: new Date()
          })
          deletedStories.push(story)
          stories.push(story)
        }

        const storyIds = stories.map(story => story.id)
        const today = new Date()
        const sync = await chai.request(server)
          .post('/v1/sync')
          .set('Authorization', `Bearer ${data.token.access}`)
          .send({
            storyIds: storyIds,
            lastSync: new Date(today.getDate() - 2)
          })

        should(sync.body).have.property('data')
        const syncData = sync.body.data
        assert.equal(syncData.stories.length, 5)
        assert.equal(syncData.deletedStories.length, 2)
        assert.equal(syncData.deletedPages.length, 6)
      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
        throw err
      }
    })
  })

  describe('Login', () => {
    let author

    before(async () => {
      await initAfter()
      author = await authorFaker({
        single: true,
        email: 'sasateodorovic57@istoryapp.com',
        password: utils.generatePassword('nikola'),
        active: true,
        deleted: false,
        username: 'sasha',
        name: 'sasha'
      })
    })

    after(async () => {
      await initAfter()
    })

    it('should login author', async () => {
      try {
        let response = await chai.request(server)
          .post('/v1/login')
          .send({
            email: 'sasateodorovic57@istoryapp.com',
            password: 'nikola'
          })

        // console.log(JSON.stringify(response.body, null, 2))
        let result = response.body
        should(result).be.type('object')
        should(result).have.property('data')
        let data = result.data
        should(data).be.type('object')
        should(data).have.property('_id')
        assert.equal(data._id, author._id)
        should(data).have.property('name')
        assert.equal(data.name, 'sasha')
        should(data).have.property('username')
        assert.equal(data.username, 'sasha')
        should(data).have.property('avatar')
        should(data).have.property('email')
        should(data).have.property('sync')
        should(data).have.property('notif')
        should(data).have.property('pushNotif')
        should(data).have.property('bio')
        should(data).have.property('location')
        should(data).have.property('firstTime')
        should(data).have.property('token')
        should(data.token).have.property('access')
        should(data.token).have.property('refresh')
        should(data.token).have.property('expired')
        should(data).have.property('plan')
        should(data.plan).have.property('level')
        assert.equal(data.email, 'sasateodorovic57@istoryapp.com')
      } catch (err) {
        console.log(err)
        should.not.exist(err)
      }
    })

    it('should login author and sync', async () => {
      try {
        const email = 'sasateodorovic57@istoryapp.com'
        const loginResponse = await chai.request(server)
          .post('/v1/login')
          .send({
            email: email,
            password: 'nikola'
          })

        // console.log(JSON.stringify(loginResponse.body, null, 2))
        const result = loginResponse.body
        should(result).be.type('object')
        should(result).have.property('data')
        const data = result.data
        should(data).be.type('object')
        should(data).have.property('_id')
        assert.equal(data._id, author._id)
        should(data).have.property('name')
        assert.equal(data.name, 'sasha')
        should(data).have.property('username')
        assert.equal(data.username, 'sasha')
        should(data).have.property('avatar')
        should(data).have.property('email')
        should(data).have.property('sync')
        should(data).have.property('notif')
        should(data).have.property('pushNotif')
        should(data).have.property('bio')
        should(data).have.property('location')
        should(data).have.property('firstTime')
        should(data).have.property('token')
        should(data.token).have.property('access')
        should(data.token).have.property('refresh')
        should(data.token).have.property('expired')
        should(data).have.property('plan')
        should(data.plan).have.property('level')
        assert.equal(data.email, 'sasateodorovic57@istoryapp.com')

        let stories = []
        // create stories
        for (let i = 0; i < 5; i++) {
          // create fake stories
          const pages = await pageFaker({
            n: 3,
            author: data._id,
            status: 'private',
            content: [
              {
                type: 'text',
                text: 'This is a page content',
                contentId: v4(),
                created: new Date()
              }
            ]
          })
          const story = await storyFaker({
            single: true,
            author: data._id,
            status: 'private',
            pages: pages.map(page => page.id)
          })
          stories.push(story)
        }

        let deletedStories = []
        // create deleted stories
        for (let i = 0; i < 2; i++) {
          // create fake stories
          const pages = await pageFaker({
            n: 3,
            author: data._id,
            status: 'private',
            content: [
              {
                type: 'text',
                text: 'This is a page content',
                contentId: v4(),
                created: new Date()
              }
            ],
            deleted: true,
            active: false,
            deletedAt: new Date()
          })
          const story = await storyFaker({
            single: true,
            author: data._id,
            status: 'private',
            pages: pages.map(page => page.id),
            deleted: true,
            active: false,
            deletedAt: new Date()
          })
          deletedStories.push(story)
          stories.push(story)
        }

        const storyIds = stories.map(story => story.id)
        const today = new Date()
        const sync = await chai.request(server)
          .post('/v1/sync')
          .set('Authorization', `Bearer ${data.token.access}`)
          .send({
            storyIds: storyIds,
            lastSync: new Date(today.getDate() - 2)
          })

        should(sync.body).have.property('data')
        const syncData = sync.body.data
        assert.equal(syncData.stories.length, 5)
        assert.equal(syncData.deletedStories.length, 2)
        assert.equal(syncData.deletedPages.length, 6)

      } catch (err) {
        console.log(err)
        should.not.exist(err)
      }
    })
  })

  describe('Change password', () => {
    before(async () => {
      await initAfter()
      await initBefore()
    })

    after(async () => {
      await initAfter()
    })

    it('should return error if not authorized', async () => {
      try {
        let response = await chai.request(server)
          .post('/v1/change-password')
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

    it('should return error if old password not provided', async () => {
      try {
        let token = generateToken(authors[0]['email'])

        let response = await chai.request(server)
          .post('/v1/change-password')
          .set('Authorization', `Bearer ${token}`)
          .send({})

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('You need to send old password'))
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return error if password failed to validate', async () => {
      try {
        let author = authors[0]
        let token = generateToken(author['email'])

        let response = await chai.request(server)
          .post('/v1/change-password')
          .set('Authorization', `Bearer ${token}`)
          .send({
            oldPassword: author.password,
            newPassword: '1234',
            newPasswordConfirmation: '1234'
          })

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Password must be 6 characters at least'))
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return error if passwords doesn\'t match', async () => {
      try {
        let author = authors[0]
        let token = generateToken(author['email'])

        let response = await chai.request(server)
          .post('/v1/change-password')
          .set('Authorization', `Bearer ${token}`)
          .send({
            oldPassword: 'wrongas',
            newPassword: '654321',
            newPasswordConfirmation: '123456'
          })

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Failed to confirm new password, try again'))
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return status true and message', async () => {
      try {
        let author = authors[0]
        let token = generateToken(author['email'])

        let response = await chai.request(server)
          .post('/v1/change-password')
          .set('Authorization', `Bearer ${token}`)
          .send({
            oldPassword: 'nikola',
            newPassword: '123456',
            newPasswordConfirmation: '123456'
          })

        let result = response.body
        // console.log(JSON.stringify(result, null, 2))

        expect(result).to.be.an('object')
        expect(result.status).to.equal(true)
        expect(result.message).to.equals('Password is changed')

      } catch (err) {
        should.not.exist(err)
      }
    })

  })

  describe('Update profile', () => {
    before(async () => {
      await initAfter()
      await initBefore()
    })

    after(async () => {
      await initAfter()
    })

    it('should return error if not authorized', async () => {
      try {
        let response = await chai.request(server)
          .post('/v1/authors')
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

    it('should return error if not paramaters send', async () => {
      try {
        let token = generateToken(authors[0]['email'])

        let response = await chai.request(server)
          .post('/v1/authors')
          .set('Authorization', `Bearer ${token}`)
          .send({})

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('You need at least one parameter to change profile.'))
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return error if location missing props', async () => {
      try {
        let author = authors[0]
        let token = generateToken(author['email'])

        let obj = {
          location: {
            lat: 123434,
            lon: '',
            name: 'asdf'
          }
        }
        let response = await chai.request(server)
          .post('/v1/authors')
          .set('Authorization', `Bearer ${token}`)
          .send(obj)

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText['message'].startsWith('You are missing value for')).to.be.true

        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should update profile', async () => {
      try {
        let author = authors[0]
        let token = generateToken(author['email'])
        let obj = {
          name: 'tester',
          bio: 'my bio',
          location: {
            name: 'asdf',
            lon: '123434',
            lat: '123434'
          }
        }

        let response = await chai.request(server)
          .post('/v1/authors')
          .set('Authorization', `Bearer ${token}`)
          .send(obj)

        let result = response.body.data
        // console.log(JSON.stringify(result, null, 2))

        expect(result).to.be.an('object')
        expect(result).to.have.property('_id')
        expect(result).to.have.property('name').and.equals(obj.name)
        expect(result).to.have.property('bio').and.equals(obj.bio)
        expect(result).to.have.property('username')
        expect(result).to.have.property('avatar')
        expect(result).to.have.property('email')
        expect(response.status).to.equal(200)
        expect(result).to.have.property('location')
        for (let key in obj.location) {
          expect(result.location[key]).to.equals(obj.location[key])
        }

      } catch (err) {
        should.not.exist(err)
      }
    })

  })

  describe('Save settings for notifications', () => {
    before(async () => {
      await initAfter()
      await initBefore()
    })

    after(async () => {
      await initAfter()
    })

    let author
    before(async () => {
      await initAfter()
      author = await authorFaker({
        single: true,
        notif: {
          collaboration: {
            userLeavesStory: false,
            removedFromStory: false,
            storyUpdates: false,
            newCollaborator: false,
            invitations: false
          },
          social: {
            newFollower: false,
            comments: false,
            favoritedYourStory: false,
            sharedStory: false,
            friendStoryUpdates: false,
            friendNewStory: false,
            newFriend: false
          }
        }
      })
    })

    after(async () => {
      await initAfter()
    })

    it('should return error if not authorized', async () => {
      try {
        const response = await chai.request(server)
          .post('/v1/authors/notifications')
          .set('Authorization', 'Bearer ')
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

    it('should return error if collaboration settings are not saved', async () => {
      try {
        const token = generateToken(author.email)
        const collaboration = {}

        const response = await chai.request(server)
          .post('/v1/authors/notifications')
          .set('Authorization', `Bearer ${token}`)
          .send(collaboration)

        should.exist(response.error)
        const error = response.error
        expect(error.status).to.be.equal(400)
        const errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Bad request, collaboration notifications settings not saved'))
        expect(errorText.statusCode).to.be.equal(400)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return error if social settings are not saved', async () => {
      try {
        let token = generateToken(author.email)
        let collaboration = {a: 1}

        let response = await chai.request(server)
          .post('/v1/authors/notifications')
          .set('Authorization', `Bearer ${token}`)
          .send({collaboration})

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Bad request, social notifications settings not saved'))
        expect(errorText.statusCode).to.be.equal(400)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return author object with changed notifications', async () => {
      try {
        let token = generateToken(author.email)
        let collaboration = {
          userLeavesStory: true,
          removedFromStory: false,
          storyUpdates: false,
          newCollaborator: true,
          invitations: false
        }
        let social = {
          newFollower: false,
          comments: true,
          favoritedYourStory: false,
          sharedStory: false,
          friendStoryUpdates: true,
          friendNewStory: false,
          newFriend: false
        }

        let response = await chai.request(server)
          .post('/v1/authors/notifications')
          .set('Authorization', `Bearer ${token}`)
          .send({collaboration})
          .send({social})

        // console.log(JSON.stringify(response.body, null, 2))
        const result = response.body.data
        const newCollaboration = result.notif.collaboration
        const newSocial = result.notif.social

        expect(result).to.be.an('object')
        expect(response.body.message).to.exist.and.equal(translate.__('You successfully saved settings for notifications'))
        should.exist(response.body.data)

        // check collaboration notifications in result
        for (let key in collaboration) {
          let prop = collaboration[key]
          assert.equal(newCollaboration[key], prop)
        }

        for (let key in social) {
          let prop = social[key]
          assert.equal(newSocial[key], prop)
        }

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return author object with changed notifications, all as true', async () => {
      try {
        let token = generateToken(author.email)
        let collaboration = {
          userLeavesStory: true,
          removedFromStory: true,
          storyUpdates: true,
          newCollaborator: true,
          invitations: true
        }
        let social = {
          newFollower: true,
          comments: true,
          favoritedYourStory: true,
          sharedStory: true,
          friendStoryUpdates: true,
          friendNewStory: true,
          newFriend: true
        }

        let response = await chai.request(server)
          .post('/v1/authors/notifications')
          .set('Authorization', `Bearer ${token}`)
          .send({collaboration})
          .send({social})

        // console.log(JSON.stringify(response.body, null, 2))
        const result = response.body.data
        const newCollaboration = result.notif.collaboration
        const newSocial = result.notif.social

        expect(result).to.be.an('object')
        expect(response.body.message).to.exist.and.equal(translate.__('You successfully saved settings for notifications'))
        should.exist(response.body.data)

        // check collaboration notifications in result
        for (let key in collaboration) {
          let prop = collaboration[key]
          assert.equal(newCollaboration[key], prop)
        }

        for (let key in social) {
          let prop = social[key]
          assert.equal(newSocial[key], prop)
        }

      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('Save settings for push notifications', () => {
    before(async () => {
      await initAfter()
      await initBefore()
    })

    after(async () => {
      await initAfter()
    })

    let author

    before(async () => {
      await initAfter()
      author = await authorFaker({
        single: true
      })
    })

    after(async () => {
      await initAfter()
    })

    it('should return error if not authorized', async () => {
      try {
        const response = await chai.request(server)
          .post('/v1/authors/push-notifications')
          .set('Authorization', 'Bearer ')
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

    it('should return error if notification settings are not sent', async () => {
      try {
        const token = generateToken(author['email'])
        const notification = {}

        const response = await chai.request(server)
          .post('/v1/authors/push-notifications')
          .set('Authorization', `Bearer ${token}`)
          .send(notification)

        should.exist(response.error)
        const error = response.error
        expect(error.status).to.be.equal(400)
        const errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Bad request, notifications settings not sent'))
        expect(errorText.statusCode).to.be.equal(400)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return author object with changed notifications', async () => {
      try {
        const token = generateToken(author['email'])
        const notifications = {
          newStoryShare: true,
          newStoryPublic: false,
          newFollower: false,
          newComment: true,
        }

        const response = await chai.request(server)
          .post('/v1/authors/push-notifications')
          .set('Authorization', `Bearer ${token}`)
          .send(notifications)

        // console.log(JSON.stringify(response.body, null, 2))
        const result = response.body.data
        const newNotifications = result.pushNotif

        expect(result).to.be.an('object')
        expect(response.body.message).to.exist.and.equal(translate.__('You successfully saved settings for push notifications'))
        should.exist(response.body.data)

        // check collaboration notifications in result
        for (let key in notifications) {
          const prop = notifications[key]
          assert.equal(newNotifications[key], prop)
        }

      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('refresh token', () => {

    let author
    let token

    before(async () => {
      await initAfter()
      author = await authorFaker({
        single: true
      })
      token = generateToken(author.email)
    })

    it('should not refresh token, wrong parameters', async () => {
      try {
        let response = await chai.request(server)
          .post('/v1/refresh-token')
          .set('Authorization', `Bearer ${token}`)
          .send({})

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Missing parameters'))
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should not refresh token, wrong email parameter', async () => {
      try {
        let response = await chai.request(server)
          .post('/v1/refresh-token')
          .set('Authorization', `Bearer ${token}`)
          .send({
            email: author.email,
            refreshToken: null,
          })

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Missing parameters'))
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should not refresh token, wrong email address', async () => {
      try {
        let email = 'no@email.com'
        let token = generateToken(author.email)
        let response = await chai.request(server)
          .post('/v1/refresh-token')
          .set('Authorization', `Bearer ${token}`)
          .send({
            email: email,
            refreshToken: author.token.refresh,
          })

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(422)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('User not found'))
        expect(errorText.statusCode).to.be.equal(422)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should refresh token', async () => {
      try {
        const response = await chai.request(server)
          .post('/v1/refresh-token')
          .set('Authorization', `Bearer ${token}`)
          .send({
            email: author.email,
            refreshToken: author.token.refresh,
          })

        // console.log(JSON.stringify(response.body, null, 2))
        should.exist(response)
        const res = response.body.data

        should(res).be.type('object')
        should(res).have.property('token')
        should(res.token).have.property('access')
        assert.notEqual(res.token.access, author.token.access)
        should(res.token).have.property('expired')
        assert.notEqual(res.token.expired, author.token.expired)
        should(res.token).have.property('refresh')
        assert.notEqual(res.refreshToken, author.token.refresh)

      } catch (err) {
        should.not.exist(err)
      }
    })

  })

  describe('delete account', () => {
    let author
    let token

    before(async () => {
      await initAfter()
      author = await authorFaker({
        single: true
      })
      token = generateToken(author.email)
    })

    it('should not author, token is missing', async () => {
      try {
        let response = await chai.request(server)
          .delete(`/v1/authors/${author._id}`)
          .set('Authorization', 'Bearer ""')

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

    it('it should return err, user doesn\'t have permission', async () => {
      try {
        let diffAuthor = authors[1]
        let response = await chai.request(server)
          .delete(`/v1/authors/${diffAuthor._id}`)
          .set('Authorization', `Bearer ${token}`)

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('You don\'t have permission for this action'))
        expect(errorText.statusCode).to.be.equal(400)
      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('it should delete author', async () => {
      try {
        let cDate = new Date()

        let response = await chai.request(server)
          .delete(`/v1/authors/${author._id}`)
          .set('Authorization', `Bearer ${token}`)

        // console.log(JSON.stringify(response.body, null, 2))
        let res = response.body
        expect(res).to.be.an('object')
        // expect(res).to.have.property('status').and.true
        expect(res).to.have.property('message').and.equals('You successfully deleted account')
        let data = res.data

        expect(data).to.have.property('_id').and.equals(author._id.toString())
        expect(data).to.have.property('name').and.equals(author.name)
        expect(data).to.have.property('username').and.equals(author.username)
        expect(data).to.have.property('active').and.false
        expect(data).to.have.property('deleted').and.true
        expect(data).to.have.property('deletedAt')
        let deletedAt = new Date(data.deletedAt)
        expect(deletedAt).to.be.greaterThan(cDate)

      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('reset password', () => {
    let fakeExpiredForgotPassword
    let fakeForgotPassword
    let fakeAuthor
    const expiredCode = '0987654321'

    before(async () => {
      await initAfter()
      fakeAuthor = await authorFaker({
        single: true
      })

      fakeExpiredForgotPassword = await forgotPasswordFaker({
        author: fakeAuthor.id,
        single: true,
        active: false,
        code: expiredCode
      })

      fakeForgotPassword = await forgotPasswordFaker({
        author: fakeAuthor.id,
        single: true,
        code: '111222333444555'
      })
    })

    after(async () => {
      await initAfter()
    })

    it('it should return error, code is missing ', async () => {
      try {
        const response = await chai.request(server)
          .post('/v1/new-password')
          .send({})

        expect(response.error).to.exist
        const error = response.error
        expect(error.status).to.be.equal(400)
        const errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Code is required'))
        expect(errorText.statusCode).to.be.equal(400)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('it should return error, password is missing ', async () => {
      try {
        const response = await chai.request(server)
          .post('/v1/new-password')
          .send({
            code: '12345'
          })

        expect(response.error).to.exist
        const error = response.error
        expect(error.status).to.be.equal(400)
        const errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Password is required'))
        expect(errorText.statusCode).to.be.equal(400)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('it should return error, password doesn\'t match', async () => {
      try {
        let response = await chai.request(server)
          .post('/v1/new-password')
          .send({
            code: '12345',
            password: 'newpassword'
          })

        expect(response.error).to.exist
        const error = response.error
        expect(error.status).to.be.equal(400)
        const errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Passwords must be the same'))
        expect(errorText.statusCode).to.be.equal(400)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('it should return error, password doesn\'t match', async () => {
      try {
        const response = await chai.request(server)
          .post('/v1/new-password')
          .send({
            code: '12345',
            password: 'newpassword',
            retypedPassword: 'newpasswor'
          })

        expect(response.error).to.exist
        const error = response.error
        expect(error.status).to.be.equal(400)
        const errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Passwords must be the same'))
        expect(errorText.statusCode).to.be.equal(400)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('it should return error, code has expired', async () => {
      try {
        const password = 'newpassword'
        const response = await chai.request(server)
          .post('/v1/new-password')
          .send({
            code: fakeExpiredForgotPassword.code,
            password: password,
            retypedPassword: password
          })

        expect(response.error).to.exist
        let error = response.error
        expect(error.status).to.be.equal(422)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Code has expired or doesn\'t exist'))
        expect(errorText.statusCode).to.be.equal(422)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('it should set a new password', async () => {
      try {
        const password = 'newpassword'
        const response = await chai.request(server)
          .post('/v1/new-password')
          .send({
            code: fakeForgotPassword.code,
            password: password,
            retypedPassword: password
          })

        // console.log(JSON.stringify(response.body, null, 2))
        const { body } = response
        expect(body).to.be.an('object')
        expect(body).to.not.have.property('data')
        expect(body).to.have.property('status').and.true
        expect(body).to.have.property('message').and.equals('You successfully reset password')
      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('forgot password', () => {
    const email = 'asdf@asdf.asdf'
    before(async () => {
      await initAfter()
        await authorFaker({
          email,
          single: true
        })

    })

    after(async () => {
      await initAfter()
    })


    it('it should return error, email is missing ', async () => {
      try {
        const response = await chai.request(server)
          .post('/v1/forgot-password')
          .send({})

        // console.log(JSON.stringify(response.body, null, 2))
        expect(response.error).to.exist
        const error = response.error
        expect(error.status).to.be.equal(400)
        const errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Missing email parameter'))
        expect(errorText.statusCode).to.be.equal(400)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('it should set a new password', async () => {
      try {
        const response = await chai.request(server)
          .post('/v1/forgot-password')
          .send({ email })

        const { body } = response
        expect(body).to.be.an('object')
        expect(body).to.not.have.property('data')
        expect(body).to.have.property('status').and.true
        expect(body).to.have.property('message').and.equals('Email link send on email ' + email)
      } catch (err) {
        should.not.exist(err)
      }
    })
  })

})

/*************************************************/
/******************** | GET | ********************/
/*************************************************/

describe('should test API for authors, GET methods', () => {
  before(async () => {
    await initAfter()
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('Authors profile', () => {

    let author = fixtures.collections.authors[3]
    let token = generateToken(author.email)

    it('it should return error if not authorized ', async () => {
      let author = fixtures.collections.authors[3]
      try {
        let response = await chai.request(server)
          .get(`/v1/authors/${author._id}`)
          .set('Authorization', ``)

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

    it('it should return server error if not valid OID ', async () => {
      try {
        const author = fixtures.collections.authors[3]
        const token = generateToken(author.email)
        const fakeId = 1234
        let response = await chai.request(server)
          .get(`/v1/authors/${fakeId}`)
          .set('Authorization', `Bearer ${token}`)

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(500)
        let errorText = JSON.parse(error.text)
        expect(errorText.statusCode).to.be.equal(500)

      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
      }
    })

    it('it should return null if id user not exist', async () => {
      try {
        let response = await chai.request(server)
          .get(`/v1/authors/${ObjectId()}`)
          .set('Authorization', `Bearer ${token}`)

        expect(response.body).to.exist
        expect(response.body).to.have.property('data').and.be.null

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('it should return proper response', async () => {
      try {
        let response = await chai.request(server)
          .get(`/v1/authors/${author._id}`)
          .set('Authorization', `Bearer ${token}`)

        // console.log(JSON.stringify(response.body, null, 2))
        expect(response.body).to.exist
        expect(response.status).to.equal(200)

        let data = response.body.data
        // expected keys need to match actual keys
        let actualKeys = Object.keys(data)
        let expectedKeys = utils.strToArr(gq.author.profile)
        assert(actualKeys.every(item => expectedKeys.includes(item)))
        expect(data).to.have.property('stories')
        expect(data).to.have.property('followers')
        expect(data).to.have.property('following')
        expect(data).to.have.property('shareLink')
      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
      }
    })

  })

  describe('Authors profile by username', () => {

    const author = fixtures.collections.authors[3]
    const token = generateToken(author.email)

    it('it should return null if username user not exist', async () => {
      try {
        const response = await chai.request(server)
          .get('/v1/authors/username/notexist')
          .set('Authorization', `Bearer ${token}`)

        should.exist(response.error)
        const error = response.error
        expect(error.status).to.be.equal(422)
        let errorText = JSON.parse(error.text)
        expect(errorText.statusCode).to.be.equal(422)
        assert.equal(errorText.message, 'Author not found')

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('it should return proper response', async () => {
      try {
        const response = await chai.request(server)
          .get(`/v1/authors/username/${author.username}`)
          .set('Authorization', `Bearer ${token}`)

        // console.log(JSON.stringify(response.body, null, 2))
        expect(response.body).to.exist
        expect(response.status).to.equal(200)

        const data = response.body.data
        // expected keys need to match actual keys
        expect(data).to.have.property('_id')
        expect(data).to.have.property('username')
        expect(data).to.have.property('bio')
        expect(data).to.have.property('name')
        expect(data).to.have.property('avatar')
        expect(data).to.have.property('location')
        expect(data).to.have.property('followers')
        expect(data).to.have.property('following')
      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
      }
    })

  })

  describe('Authors search', () => {

    let author = fixtures.collections.authors[1]
    let token = generateToken(author.email)

    it('it should return error if not authorized ', async () => {
      try {
        const response = await chai.request(server)
          .get(`/v1/authors/search`)
          .set('Authorization', ``)

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

    it('it should return proper response with invalid pagination query strings', async () => {
      try {
        const page = 2
        const response = await chai.request(server)
          .get(`/v1/authors/search?search=a&sort=usernam:asc&pages=${page}&limita=asdf`)
          .set('Authorization', `Bearer ${token}`)

        expect(response.body).to.exist
        expect(response.status).to.equal(200)
        const data = response.body.data
        const docs = data.docs
        // expected keys need to match actual keys
        const actualKeys = Object.keys(docs[0])
        const expectedKeys = utils.strToArr(gq.author.advanced)
        docs.forEach(item => {
          assert(actualKeys.every(key => expectedKeys.includes(key)))
        })

      } catch (err) {
        console.log(err)
        expect(err).to.not.exist
      }
    })

    it('it should return proper response without query components', async () => {
      try {
        let page = 2
        let limit = 3
        let response = await chai.request(server)
          .get(`/v1/authors/search`)
          .set('Authorization', `Bearer ${token}`)

        // console.log(JSON.stringify(response.body, null, 2))
        expect(response.body).to.exist
        expect(response.status).to.equal(200)
        let data = response.body.data
        let docs = data.docs
        // test pagination props
        expect(data).to.have.property('limit').and.equal(config.paginate.limit)
        expect(data).to.have.property('page').and.equal(config.paginate.page)
        expect(data).to.have.property('pages')
        expect(data).to.have.property('total')
        // expected keys need to match actual keys
        let actualKeys = Object.keys(docs[0])
        let expectedKeys = utils.strToArr(gq.author.advanced)
        docs.forEach(item => {
          assert(actualKeys.every(key => expectedKeys.includes(key)))
        })

      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('it should return proper response with query components', async () => {
      try {
        let page = 2
        let limit = 3
        let response = await chai.request(server)
          .get(`/v1/authors/search?search=a&sort=username:asc&page=${page}&limit=${limit}`)
          .set('Authorization', `Bearer ${token}`)

        expect(response.body).to.exist
        expect(response.status).to.equal(200)
        let data = response.body.data
        let docs = data.docs
        // test pagination props
        expect(data).to.have.property('limit').and.equal(limit)
        expect(data).to.have.property('page').and.equal(page)
        expect(data).to.have.property('pages')
        expect(data).to.have.property('total')
        // expected keys need to match actual keys
        let actualKeys = Object.keys(docs[0])
        let expectedKeys = utils.strToArr(gq.author.advanced)
        docs.forEach(item => {
          assert(actualKeys.every(key => expectedKeys.includes(key)))
        })

      } catch (err) {
        expect(err).to.not.exist
      }
    })

  })

  describe('Authors stories', () => {

    let author
    const email = 'testuser@istoryapp.com'
    let token = generateToken(email)

    before(async () => {
      await initAfter()
      author = await authorFaker({
        single: true,
        email
      })

      // private
      for (let i = 0; i <= 30; i++) {
        await pageFaker({
          n: 2
        })
        await storyFaker({
          single: true,
          author: author._id
        })
      }

      // public
      for (let i = 0; i <= 30; i++) {
        await pageFaker({
          n: 2
        })
        await storyFaker({
          status: 'public',
          single: true,
          author: author._id
        })
      }
    })

    it('it should return error if not authorized ', async () => {
      let author = fixtures.collections.authors[3]
      try {
        let response = await chai.request(server)
          .get(`/v1/authors/${ObjectId()}/stories`)
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

    it('it should return error if filter is incorrect', async () => {
      try {

        let page = 10
        let limit = 3
        let sort = 'title:desc'
        let author2 = authors[0]
        let filter = 'nonexisting'

        let response = await chai.request(server)
          .get(`/v1/authors/${author2.id}/stories?filter=${filter}&sort=${sort}&limit=${limit}&page=${page}`)
          .set('Authorization', `Bearer ${token}`)

        expect(response.error).to.exist
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__(`Allowed parameter names for selection are "author" and "collaborator"`))
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        console.log(err.stack)
        expect(err).to.not.exist
      }
    })

    it('it should return proper response with various query strings options', async () => {
      try {
        let page = 1
        let limit = 1
        let author2 = authors[0]
        let sort = 'title:desc'

        const endpoints = [
          `/v1/authors/${author2.id}/stories?filter=author&sort=${sort}&limit=${limit}&page=${page}`,
          `/v1/authors/${author2.id}/stories?filter=author&sort=${'fakeSort'}&lim=${limit}&pages=${page}`,
          `/v1/authors/${author2.id}/stories`
        ]
        /*  testing multiple endpoints */

        for (let endpoint of endpoints) {

          const response = await chai.request(server)
            .get(endpoint)
            .set('Authorization', `Bearer ${token}`)

          // console.log(JSON.stringify(response.body, null, 2))
          expect(response.body).to.exist
          expect(response.status).to.equal(200)
          const data = response.body.data

          // test pagination props
          const paginationProps = ['limit', 'page', 'total', 'docs', 'pages']
          paginationProps.forEach(prop => {
            expect(data).to.have.property(prop)
          })

          const docs = data.docs
          docs.forEach(story => {
            // test keys for first level - story
            const authorKeys = Object.keys(story.author)
            expect(authorKeys.sort()).to.deep.equal(gqlKeys.story.author.sort()).and.exist
            const storyKeys = Object.keys(story)
            expect(storyKeys.sort()).to.deep.equal(gqlKeys.story.root.sort()).and.exist
            const storyShareKeys = Object.keys(story.share)
            expect(storyShareKeys.sort()).to.deep.equal(gqlKeys.story.share).and.exist

            // test keys for second level - story.collaborators
            const collaborators = story.collaborators
            collaborators.forEach(collaborator => {
              const authorKeys = Object.keys(collaborator.author)
              expect(authorKeys.sort()).to.deep.equal(gqlKeys.author.root.sort()).and.exist
              const collaboratorKeys = Object.keys(collaborator)
              expect(collaboratorKeys.sort()).to.deep.equal(gqlKeys.story.collaborators.sort()).and.exist
            })

            // test keys for second level - story.pages
            const pages = story.pages
            pages.forEach(page => {
              const authorKeys = Object.keys(page.author)
              expect(authorKeys.sort()).to.deep.equal(gqlKeys.author.root.sort()).and.exist
              const pageKeys = Object.keys(page)
              expect(pageKeys.sort()).to.deep.equal(gqlKeys.page.root.sort()).and.exist
              const pageThemeKeys = Object.keys(page.theme)
              expect(pageThemeKeys).to.deep.equal(gqlKeys.page.theme).and.exist
              expect(typeof page.place).to.be.oneOf(['object', null])
            })

          })
        }

      } catch (err) {
        console.log(err.stack)
        expect(err).to.not.exist
      }
    })

  })

  describe('Authors storage', () => {

    before(async () => {
      await initAfter()
      await initBefore()
    })

    after(async () => {
      await initAfter()
    })

    let author = authors[5]
    let token = generateToken(author.email)

    it('it should return error if not authorized ', async () => {
      let author = fixtures.collections.authors[3]
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

    it('it should return proper response with various query strings options', async () => {
      try {

        let response = await chai.request(server)
          .get('/v1/storage')
          .set('Authorization', `Bearer ${token}`)

        // console.log(JSON.stringify(response.body, null, 2))

        expect(response.body).to.exist
        expect(response.status).to.equal(200)
        let data = response.body.data

        expect(data).to.have.property('author')
        let authorRules = ['total', 'used', 'left']
        authorRules.forEach(item => {
          let prop = data.author[item]
          expect(prop).to.have.property('bytes')
          expect(prop).to.have.property('format')
        })

        expect(data).to.have.property('members')
        let members = data.members
        if (members) {
          let membersRules = ['you', 'others', 'left', 'total']
          membersRules.forEach(item => {
            let prop = members[item]
            expect(prop).to.have.property('bytes')
            expect(prop).to.have.property('format')
          })
        }

      } catch (err) {
        expect(err).to.not.exist
      }
    })

  })

  describe('search authors & stories', () => {

    before(async () => {
      await initAfter()
      await initBefore()
    })

    after(async () => {
      await initAfter()
    })

    let author = fixtures.collections.authors[1]
    let token = generateToken(author.email)

    it('it should return error if not authorized ', async () => {
      let author = fixtures.collections.authors[3]
      try {
        let response = await chai.request(server)
          .get(`/v1/search`)
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

    it('it should return proper response with various query strings options', async () => {
      try {
        const endpoints = [
          `/v1/search`,
          `/v1/search?search=a&authorPage=2&authorLimit=2&authorSort=name:desc&storyPage=1&storyLimit=2&storySort=title:desc`,
          `/v1/search?search=k&authorPage=2&authorLimith=2&authorSort=name:fail&story_page=1&storyLimit=3&storySort=title:desc`,
        ]

        /*  test multiple endpoints */

        for (let endpoint of endpoints) {

          let response = await chai.request(server)
            .get(endpoint)
            .set('Authorization', `Bearer ${token}`)

          // console.log(JSON.stringify(response.body, null, 2))
          expect(response.body).to.exist
          expect(response.status).to.equal(200)
          let searchRes = response.body.data
          expect(searchRes).to.have.property('stories')
          expect(searchRes).to.have.property('authors')

          const authorsRes = searchRes.authors
          const storiesRes = searchRes.stories
          // test pagination props
          const paginationProps = ['limit', 'page', 'total', 'docs', 'pages']
          paginationProps.forEach(prop => {
            expect(authorsRes).to.have.property(prop)
            expect(storiesRes).to.have.property(prop)
          })
          // test stories docs
          storiesRes.docs.forEach(doc => {
            const keys = Object.keys(doc)
            const expectedKeys = gqlKeys.storyMini.search
            expect(keys).to.deep.equal(expectedKeys)
          })
          // test authors docs
          authorsRes.docs.forEach(doc => {
            const keys = Object.keys(doc)
            const expectedKeys = gqlKeys.author.advanced
            expect(keys.sort()).to.deep.equal(expectedKeys.sort())
          })
        }

      } catch (err) {
        console.log(err.stack)
        expect(err).to.not.exist
      }
    })

    it('should search user\'s stories', async () => {
      try {
        // remove all data
        await initAfter()

        const author = await authorFaker({
          single: true
        });
        await storyFaker({
          n: 10,
          author: author.id
        })
        await storyFaker({
          single: true,
          title: 'my story',
          author: author.id
        })

        const token = generateToken(author.email)
        const response = await chai.request(server)
          .get('/v1/search')
          .set('Authorization', `Bearer ${token}`)

        // console.log(JSON.stringify(response.body, null, 2))
        expect(response.body).to.exist
        expect(response.status).to.equal(200)
        let searchRes = response.body.data
        expect(searchRes).to.have.property('stories')
        expect(searchRes).to.have.property('authors')

        const authorsRes = searchRes.authors
        const storiesRes = searchRes.stories

        // test pagination props
        const paginationProps = ['limit', 'page', 'total', 'docs', 'pages']

        paginationProps.forEach(prop => {
          expect(authorsRes).to.have.property(prop)
          expect(storiesRes).to.have.property(prop)
        })

        expect(storiesRes.total).equals(11)
      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('should search user\'s stories with term', async () => {
      try {
        // remove all data
        await initAfter()

        const author = await authorFaker({
          single: true
        });
        await storyFaker({
          n: 10,
          author: author.id
        })
        await storyFaker({
          single: true,
          title: 'my story',
          author: author.id
        })

        const token = generateToken(author.email)
        const response = await chai.request(server)
          .get('/v1/search?search=my')
          .set('Authorization', `Bearer ${token}`)

        // console.log(JSON.stringify(response.body, null, 2))
        expect(response.body).to.exist
        expect(response.status).to.equal(200)
        let searchRes = response.body.data
        expect(searchRes).to.have.property('stories')
        expect(searchRes).to.have.property('authors')

        const authorsRes = searchRes.authors
        const storiesRes = searchRes.stories

        // test pagination props
        const paginationProps = ['limit', 'page', 'total', 'docs', 'pages']

        paginationProps.forEach(prop => {
          expect(authorsRes).to.have.property(prop)
          expect(storiesRes).to.have.property(prop)
        })

        expect(storiesRes.total).equals(1)
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('get followers', () => {

    before(async () => {
      await initAfter()
      await initBefore()
    })

    after(async () => {
      await initAfter()
    })

    const author = fixtures.collections.authors[1]
    let token = generateToken(author.email)

    it('should return followers', async () => {
      const response = await chai.request(server)
        .get(`/v1/authors/${author.id}/followers`)
        .set('Authorization', `Bearer ${token}`)

      // console.log(JSON.stringify(response.body, null, 2))
      expect(response.body).to.exist
      expect(response.status).to.equal(200)
    })

  })

  describe('get followings', () => {
    let authors
    before(async () => {
      await initAfter()
      authors = await authorFaker({
        n: 4
      })
      authors.forEach(async (author, index) => {
        if (index > 0) {
          await followingFaker({
            author: authors[0]._id,
            follows: author
          })
        }
      })
    })

    after(async () => {
      await initAfter()
    })

    it('should return followings', async () => {
      const author = authors[0]
      const token = generateToken(author.email)
      const response = await chai.request(server)
        .get(`/v1/authors/${author.id}/followings`)
        .set('Authorization', `Bearer ${token}`)

      // console.log(JSON.stringify(response.body, null, 2))
      expect(response.body).to.exist
      expect(response.status).to.equal(200)
      const { body } = response
      expect(body).to.have.property('data')
      expect(body.data).to.have.property('following')
      const { following } = body.data
      expect(following).to.have.property('docs')
      expect(following).to.have.property('page')
      expect(following).to.have.property('total')
      expect(following).to.have.property('limit')
      expect(following).to.have.property('pages')
      assert.equal(following.docs.length, 3)
      const followingAuthor = following.docs[0]
      should(followingAuthor).have.property('_id')
      should(followingAuthor).have.property('name')
      should(followingAuthor).have.property('username')
      should(followingAuthor).have.property('avatar')
      should(followingAuthor).have.property('email')
    })
  })
})

/* TESTS WITH FAKER */

describe('Tests API for authors, with fakers', () => {

  describe('search authors & stories, when author', () => {
    let authorId = ObjectId()
    let follower1 = ObjectId()
    let follower2 = ObjectId()
    let email = 'fakemail@fake.mail'
    let storyParams
    let foundTitle = 'random FOUND title'

    /* before */
    before(async () => {
      storyParams = [
        /* not to be found, private rekords */
        { n: 5, title: 'not to be found private', status: 'private' },
        /* found authors story */
        { author: authorId, title: 'random FOUND title', status: 'private' },
        /* found public story */
        { n: 1, title: 'random FOUND title', status: 'public' },
        /* found collaborated story edit true */
        {
          title: 'random FOUND title',
          collaborators: [{
            edit: true,
            author: authorId
          }]
        },
        /* found collaborated story edit false */
        {
          title: 'random FOUND title',
          collaborators: [{
            edit: false,
            author: authorId
          }],
          status: 'private'
        },
        /* found followers story */
        {
          author: follower1,
          title: 'random FOUND title',
          followersShare: true,
          status: 'private'
        },
        /* not to be found, share false */
        {
          author: follower2,
          title: 'not to be found share false',
          followersShare: false,
          status: 'private'
        }
      ]
      // create author
      await authorFaker({
        id: authorId,
        email
      })
      // create stories
      for (let p of storyParams) {
        await storyFaker(p)
      }
      // create followers
      let followParams = [
        { author: authorId, follows: follower1 },
        { author: authorId, follows: follower2 }
      ]
      for (let f of followParams) {
        await followingFaker(f)
      }
    })

    /* after */
    after(async () => {
      await initAfter()
    })
    let token = generateToken(email)

    it('should find all stories that user have access for', async () => {
      let response = await chai.request(server)
        .get('/v1/search')
        .set('Authorization', `Bearer ${token}`)

      const sr = response.body.data.stories
      let keys = ['docs', 'total', 'limit', 'page', 'pages']
      expect(Object.keys(sr)).to.deep.eq(keys)
      expect(sr.total).to.equal(5)
      sr.docs.forEach(s => {
        expect(s.title).to.equal(foundTitle)
      })

    })
  })

  describe('getMyProfile', () => {
    let author

    before(async () => {
      await initAfter()
      author = await authorFaker({
        single: true
      })
    })

    after(async () => {
      await initAfter()
    })

    it('shouldn\'t return author, no token provided', async () => {
      try {
        const response = await chai.request(server)
          .get('/v1/authors/me')
          .set('Authorization', `Bearer `)

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

    it('should return author', async () => {
      try {
        const token = generateToken(author.email)
        const response = await chai.request(server)
          .get('/v1/authors/me')
          .set('Authorization', `Bearer ${token}`)

        expect(response.body).to.exist
        expect(response.status).to.equal(200)
        const { body } = response
        expect(body).to.have.property('data')
        const { data } = body
        assert.equal(data._id, author.id)
      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
      }
    })
  })

  describe('sync', () => {
    let author
    let story
    let originalPageIds

    before(async () => {
      await initAfter()

      author = await authorFaker({
        single: true
      })
      const pages = await pageFaker({
        n: 4,
        author: author._id,
        created: new Date('2019-06-10')
      })
      originalPageIds = pages.map(page => page._id)
      story = await storyFaker({
        single: true,
        author: author._id,
        pages: originalPageIds,
        created: new Date('2019-06-10')
      })
    })

    after(async () => {
      await initAfter()
    })

    it('should sync after story update', async () => {
      // update story with reordered pages
      const pageIds = story.pages.map(pageId => String(pageId))
      pageIds.splice(2, 1)

      const token = generateToken(author.email)
      const storyResponse = await chai.request(server)
        .put('/v1/stories')
        .send({
          id: story._id,
          title: story.title,
          pageIds
        })
        .set('Authorization', `Bearer ${token}`)

      expect(storyResponse.body).to.exist
      expect(storyResponse.status).to.equal(200)
      const { body: { data } } = storyResponse
      const newPageIds = data.pages.map(page => page._id)
      assert.deepEqual(newPageIds, pageIds)
      assert.notDeepEqual(newPageIds, originalPageIds)

      // try to sync
      const syncResponse = await chai.request(server)
        .post('/v1/sync')
        .send({
          lastSync: '2019-06-13T09:04:39.508Z',
          storyIds: [story._id]
        })
        .set('Authorization', `Bearer ${token}`)

      expect(syncResponse.body).to.exist
      expect(syncResponse.status).to.equal(200)
      const syncData = syncResponse.body.data
      assert.equal(syncData.stories.length, 1)
      const syncStory = syncData.stories[0]
      const syncPageIds = syncStory.pages.map(page => page._id)
      assert.deepEqual(syncPageIds, pageIds)

      // get story details
      const detailsResponse = await chai.request(server)
        .get(`/v1/stories/${story._id}`)
        .set('Authorization', `Bearer ${token}`)

      expect(detailsResponse.body).to.exist
      expect(detailsResponse.status).to.equal(200)
      const storyData = detailsResponse.body.data
      // console.log('storyData', storyData)
      const detailsPageIds = storyData.pages.map(page => page._id)
      assert.deepEqual(detailsPageIds, pageIds)
    })
  })
})

