/**
 * @file Tests for author handles
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

 //  assertions
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'
import { ObjectId } from 'mongodb'

// libs
import utils from '../../src/lib/utils'
import translate from '../../src/lib/translate'

// handles
import authorHndl from '../../src/handles/author.handles'

// fixtures
import fixtures from '../fixtures'

// models
import Story from '../../src/models/story/story.model'
import Page from '../../src/models/page/page.model'
import Following from '../../src/models/following/following.model'
import { Author } from '../../src/models/author';

// services
import { initBefore, initAfter } from '../setup'

// Constants
import { planLevels } from '../../src/constants/plan'
import {
  PASSWORD_MAX,
  PASSWORD_MIN,
  USERNAME_MAX,
  USERNAME_MIN
} from '../../src/constants/app'

// fakers
import { forgotPasswordFaker, authorFaker } from '../fixtures/faker'

const pages = fixtures.collections.pages
const authors = fixtures.collections.authors
const stories = fixtures.collections.stories
const groups = fixtures.collections.group
const groupInvites = fixtures.collections.group_invites

describe('Author handles tests...',  () => {

  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('authorize', () => {
    it('should not authorize author by wrong token', async () => {
      try {
        let user = await authorHndl.authorize('12345')

        user.should.be.type('object')
        assert.isEmpty(user)

      } catch (err) {
        should.exist(err)
      }
    })

    it('should authorize author by token', async () => {
      try {
        let user = await authorHndl.authorize('8ug7V79qH4U8soZ7oJ6qhRqaNHFJA2Wt')
        user.should.be.type('object')
        assert.isNotEmpty(user)
        user.should.have.property('_id')
        user.should.have.property('name')
        user.should.have.property('username')
        user.should.have.property('avatar')
      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('getById', () => {
    it('should return author by id', async () => {
      try {
        let author = await authorHndl.getById('58eb78b94b432a21008c2346')
        author.should.be.type('object')
        assert.isNotEmpty(author)
        author.should.have.property('_id')
        author.should.have.property('name')
        author.should.have.property('username')
        author.should.have.property('avatar')
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should not return author by id', async () => {
      try {
        let author = await authorHndl.getById('58eb78b94b432a21008c2340')
        author.should.be.type('object')
        assert.isEmpty(author)
      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('tokenHasExpired', () => {
    it('should token has expired', () => {
      var pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 1 * 86400000)
      let expired = authorHndl.tokenHasExpired(pastDate)
      assert.equal(expired, true)
    })

    it('should token has not expired', () => {
      var futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 1 * 86400000)
      let expired = authorHndl.tokenHasExpired(futureDate)
      assert.equal(expired, false)
    })
  })

  describe('login', () => {
    it('should login author', async () => {
      try {
        let email = 'sasateodorovic57@istoryapp.com'
        let author = await authorHndl.login(email, 'nikola')

        author.should.be.type('object')
        should(author).have.property('_id')
        should(author).have.property('name')
        should(author).have.property('username')
        should(author).have.property('avatar')
        should(author).have.property('email')
        should(author).have.property('plan')
        should(author.plan).have.property('level')
        should(author).have.property('storage')
        should(author.storage).have.property('usage')
        assert.equal(author.email, email)
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should not login author', async () => {
      let email = 'sasateodorovic57@istoryapp.com'
      try {
        let author = await authorHndl.login(email, '12345')
        assert.isNull(author)
      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('register', () => {
    it('should not create the new author, username does not exist', async () => {
      let email = 'test@test.com'
      let username = ''
      let password = '123456'
      let name = 'john smith'
      try {
        await authorHndl.register(email, username, password, name)

      } catch (err) {
        should.exist(err)
        assert.equal(err.message, 'You didn\'t enter a username')
      }
    })

    it('should not create the new author, username is too short', async () => {
      let email = 'test@test.com'
      let username = 'us'
      let password = '123456'
      let name = 'john smith'
      try {
        await authorHndl.register(email, username, password, name)

      } catch (err) {
        should.exist(err)
        assert.equal(err.message, `Username can not be less then ${USERNAME_MIN} characters`)
      }
    })

    it('should not create the new author, username is too long', async () => {
      let email = 'test@test.com'
      let username = 'usernameusername'
      let password = '123456'
      let name = 'john smith'
      try {
        await authorHndl.register(email, username, password, name)

      } catch (err) {
        should.exist(err)
        assert.equal(err.message, `Username is longer then ${USERNAME_MAX} characters`)
      }
    })

    it('should not create the new author, username has illegal character', async () => {
      let email = 'test@test.com'
      let username = 'usern@me'
      let password = '123456'
      let name = 'john smith'
      try {
        await authorHndl.register(email, username, password, name)

      } catch (err) {
        should.exist(err)
        assert.equal(err.message, `The username contains illegal characters`)
      }
    })

    it('should not create the new author, password does not exist', async () => {
      let email = 'test@test.com'
      let username = 'username'
      let password = ''
      let name = 'john smith'
      try {
        await authorHndl.register(email, username, password, name)

      } catch (err) {
        should.exist(err)
        assert.equal(err.message, 'You didn\'t enter a password')
      }
    })

    it('should not create the new author, password is too short', async () => {
      let email = 'test@test.com'
      let username = 'username'
      let password = 'passw'
      let name = 'john smith'
      try {
        await authorHndl.register(email, username, password, name)

      } catch (err) {
        should.exist(err)
        assert.equal(err.message, `Password must be ${PASSWORD_MIN} characters at least`)
      }
    })

    it('should create new author', async () => {
      let email = 'test@test.com'
      let username = 'testauthor'
      let password = '123456'
      let name = 'john smith'
      try {
        let author = await authorHndl.register(email, username, password, name)
        should(author).be.type('object')
        should(author).have.property('_id')
        should(author).have.property('name')
        should(author).have.property('username')
        should(author).have.property('avatar')
        should(author).have.property('email')
        should(author).have.property('token')
        should(author.token).have.property('access')
        should(author).have.property('bio')
        should(author).have.property('plan')
        should(author.plan).have.property('expires')
        should(author).have.property('storage')
        should(author.storage).have.property('usage')
        assert.equal(author.email, email)

      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('forgotPassword', () => {
    it('should finish forgot password', async () => {
      try {
        let email = 'sasateodorovic57@istoryapp.com'
        // console.log(email)
        let result = await authorHndl.forgotPassword(email)

        should(result).be.type('object')
        should(result).have.property('author')
        should(result.author).be.type('object')
        assert.equal(result.author.email, email)
        should(result).have.property('code')
      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('saveSettingsNotifications', () => {
    it('should return error if author not found', async () => {
      try {
        // let author = fixtures.collections.authors[0]
        let authorId = '58eb78b94b432a21008c2340'

        let response = await authorHndl.saveSettingsNotifications(authorId)

        expect(response).to.be.an('object')
        assert.equal(response instanceof Error, true)
        expect(response.message).to.equal(translate.__('Author not found'))
      } catch (err) {
        should.not.exist(err)
      }
    })
    it('should return author with correct notifications settings', async () => {
      try {
        let author = fixtures.collections.authors[0]
        let authorId = author._id
        let collaboration = {
          userLeavesStory: false,
          storyUpdates: false,
          fake1: false,
          invitations: 0

        }
        let social = {
          newFollower: false,
          newFriend: false,
          fake1: '',
          comments: true
        }

        const response = await authorHndl.saveSettingsNotifications(authorId, collaboration, social)
        const collNotif = response.notif.collaboration
        const socNotif = response.notif.social

        assert.equal(response instanceof Error, false)
        // check collaboration notification
        assert.equal(collaboration.userLeavesStory, collNotif.userLeavesStory)
        assert.equal(collaboration.storyUpdates, collNotif.storyUpdates)
        should.not.exist(collNotif.fake1)
        assert.equal(Boolean(collaboration.invitations), collNotif.invitations)
        // check social notification
        assert.equal(social.newFollower, socNotif.newFollower)
        assert.equal(social.newFriend, socNotif.newFriend)
        should.not.exist(socNotif.fake1)
        assert.equal(social.comments, socNotif.comments)

      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('saveSettingsPushNotifications', () => {
    it('should return error if author not found', async () => {
      try {
        // let author = fixtures.collections.authors[0]
        let authorId = '58eb78b94b432a21008c2340'

        let response = await authorHndl.saveSettingsPushNotifications(authorId)

        expect(response).to.be.an('object')
        assert.equal(response instanceof Error, true)
        expect(response.message).to.equal(translate.__('Author not found'))
      } catch (err) {
        should.not.exist(err)
      }
    })
    it('should return author with correct push notifications settings', async () => {
      try {
        let author = fixtures.collections.authors[0]
        let authorId = author._id
        let notifications = {
          newStoryShare: false,
          newStoryPublic: false,
          fake1: false,
          newFollower: 0,
          newComment: true
        }

        const response = await authorHndl.saveSettingsPushNotifications(authorId, notifications)
        const newNotif = response.pushNotif

        assert.equal(response instanceof Error, false)
        // check collaboration notification
        assert.equal(newNotif.newStoryShare, notifications.newStoryShare)
        assert.equal(newNotif.newStoryPublic, notifications.newStoryPublic)
        should.not.exist(newNotif.fake1)
        assert.equal(newNotif.newFollower, notifications.newFollower)
        assert.equal(newNotif.newComment, notifications.newComment)


      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('changePassword', () => {

    it('should return error if author not found', async () => {
      let author = fixtures.collections.authors[0]
      let oldPassword = author.password
      let authorId = '58eb78b94b432a21008c2340'
      let newPassword = 'newPassword123'

      try {
        let response = await authorHndl.changePassword(authorId, oldPassword, newPassword)

        expect(response).to.be.an('object')
        assert.equal(response instanceof Error, true)
        expect(response.message).to.equal(translate.__('Author not found'))

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return error if old password is not matched', async () => {
      let author = fixtures.collections.authors[0]
      let oldPassword = 'notOldPassword'
      let authorId = author._id
      let newPassword = 'newPassword123'

      try {
        let response = await authorHndl.changePassword(authorId, oldPassword, newPassword)

        expect(response).to.be.an('object')
        assert.equal(response instanceof Error, true)
        expect(response.message).to.equal(translate.__('Failed to match your current password'))

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should return author with updated password', async () => {
      let author = fixtures.collections.authors[0]
      let authorId = author._id
      let oldPassword = 'nikola'
      let newPassword = 'newPassword123'

      try {
        let response = await authorHndl.changePassword(authorId, oldPassword, newPassword)

        expect(response).to.be.an('object')
        assert.equal(response._id, authorId)
        assert.equal(response.password, utils.generatePassword(newPassword))

      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('usernameExists', () => {
    it('should username been taken', async () => {
      try {
        let taken = await authorHndl.usernameExists('sasha')
        assert.equal(taken, true)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should username be available', async () => {
      try {
        let taken = await authorHndl.usernameExists('dontexist')
        assert.equal(taken, false)
      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('emailExists', () => {
    it('should email been taken', async () => {
      try {
        let taken = await authorHndl.emailExists('sasateodorovic57@istoryapp.com')
        assert.equal(taken, true)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should email be available', async () => {
      try {
        let taken = await authorHndl.emailExists('sasateodorovic58@istoryapp.com')
        assert.equal(taken, false)
      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('search', () => {
    it('should find authors by username', async () => {
      try {
        let results = await authorHndl.search('sasha')
        assert.equal(results.length, 1)
        let author = results[0]
        author.should.be.type('object')
        assert(author.name, 'sasha')
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should not find authors by username', async () => {
      try {
        let results = await authorHndl.search('sasha2')
        assert.equal(results.length, 0)
      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('updateProfile', () => {
    let name = 'test user'// user's full name
    let username = 'username'// user's username
    let bio = 'lorem ipsum bio' // user's bio
    let location = {
      lat: "1234",
      lng: "4321",
      name: 'ulica test'
    }
    // users location, object with three properties
    let avatar // users's avatar
    let user = fixtures.collections.authors[0]  // user object

    it('should update users profile information', async () => {
      // avatar = require('../media/test_image.jpg') TODO: kako da testiram avatar?
      let result = await authorHndl.updateProfile(name, username, bio, location, avatar, user)

      result.should.be.type('object')
      assert.equal(result.name, name)
      assert.equal(result.username, username)
      assert.equal(result.bio, bio)

    })

    it('should update users profile information partialy', async () => {
      name = undefined
      bio = undefined
      user = fixtures.collections.authors[1]

      let result = await authorHndl.updateProfile(name, username, bio, location, avatar, user)

      result.should.be.type('object')
      assert.equal(result.name, user.name)
      assert.equal(result.username, username)
      assert.equal(result.bio, user.bio)

    })
  })

  describe('refresh token', () => {
    let author = fixtures.collections.authors[0]

    it ('should not refresh token, author not found', async () => {
      try {
        let email = 'no@email.com'
        let token = '12345'
        await authorHndl.refreshToken(email, token)
      } catch (err) {
        should.exist(err)
        assert.equal(err.statusCode, 422)
        assert.equal(err.message, translate.__('User not found'))
      }
    })

    it ('should not refresh token, wrong token', async () => {
      try {
        let email = author.email
        let token = '12345'
        await authorHndl.refreshToken(email, token)
      } catch (err) {
        should.exist(err)
        assert.equal(err.statusCode, 422)
        assert.equal(err.message, translate.__('User not found'))
      }
    })

    it('should refresh token', async () => {
      try {
        const author = authors[1]
        let email = author.email
        let token = author.token.refresh
        let result = await authorHndl.refreshToken(email, token)

        should(result).be.type('object')
        should(result).have.property('token')
        should(result.token).have.property('access')
        should(result.token).have.property('refresh')
        assert.notEqual(result.token.access, author.token.access)
        assert.notEqual(result.token.refresh, author.token.refresh)
        assert.notEqual(result.token.expired, author.token.expired)
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

  })

  describe('storage Usage', () => {

    it('should return proper data for authors[0]', async () => {
      let author = authors[0]
      try {
        let result = await authorHndl.storageUsage(author._id)

        expect(result).not.to.be.throw
        result.should.be.type('object')
        expect(result).to.have.a.property('usageTable')
        expect(result).to.have.a.property('sum')
        expect(result).to.have.property('sumBytes')
        expect(result.sumBytes).to.be.a('number')
        assert.equal(result.sum, '9.44 MB')

      } catch (err) {
        should.not.exist(err)
      }
    })
    it('should return proper data for authors[1]', async () => {
      let author = authors[1]
      try {
        let result = await authorHndl.storageUsage(author._id)

        expect(result).not.to.be.throw
        result.should.be.type('object')
        expect(result).to.have.a.property('usageTable')
        expect(result).to.have.a.property('sum')
        expect(result).to.have.property('sumBytes')
        expect(result.sumBytes).to.be.a('number')
        assert.equal(result.sum, '0 Bytes')

      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('delete account', () => {
    /**
     * before this test two authors are added to collaborators on Sajko's story,
     * Also, four pages from those authors are added too (3 from first author, and 1 from other one)
     */

    before(async () => {

      let sajkosStory = stories[7]
      let story = await Story.findOne({
        _id: sajkosStory['_id']
      })
      // add collaborators
      let coll1 = {
        author: authors[0]['_id'],
        edit: true
      }
      let coll2 = {
        author: authors[1]['_id'],
        edit: true
      }
      let newCollaborators = [coll1, coll2]
      story.collaborators = newCollaborators
      // add pages
      let newPages = []
      for (let i = 0; i < 4; i++) {
        newPages.push(pages[i]['_id'])
      }
      story.pages = newPages
      // save
      await story.save()
      // assign changed story to modifiedStory for all tests to use
    })

    it('should return error if author not found', async () => {
      try {
        let authorId = '58eb78b94b432a21008c2222' // fake id

        let response = await authorHndl.deleteAccount(authorId)
        should.not.exist(response)
        // console.log('hej', response)

      } catch (err) {
        expect(err).to.be.an('object')
        assert.equal(err instanceof Error, true)
        expect(err.message).to.equal(translate.__('Author not found'))
      }
    })
    it('should delete author and all of his pages, stories, following, comments...', async () => {
      try {
        let authorId = authors[8]['_id'] // Author Sajko
        let cDate = new Date()

        // check BEFORE delete account

        // collaborators
        let beforeCollaborators = await Story.findAuthorsCollaborations(authorId)
        expect(beforeCollaborators).to.have.lengthOf(1)


        // followings
        let followQueryBefore = {
          $or: [
            { author: authorId },
            { follow: authorId }
          ]
        }
        let followingsBefore = await Following.find(followQueryBefore)
        expect(followingsBefore).to.have.lengthOf(1)

        let response = await authorHndl.deleteAccount(authorId)

        expect(response).to.be.an('object')
        expect(response).to.have.property('_id').and.equals(authorId.toString())
        expect(response).to.have.property('deleted').and.true
        expect(response).to.have.property('active').and.false
        expect(response).to.have.property('deletedAt').and.greaterThan(cDate)

        // check after delete account

        // story
        let storiesAfter = await Story.find({author: authorId})
        storiesAfter.forEach(story => {
          expect(story).to.have.property('deleted').and.true
          expect(story).to.have.property('active').and.false
          expect(story).to.have.property('deletedAt').and.greaterThan(cDate)
        })

        // PAGES
        let pagesAfter = await Page.find({author: authorId})
        pagesAfter.forEach(page => {
          expect(page).to.have.property('deleted').and.true
          expect(page).to.have.property('active').and.false
          expect(page).to.have.property('deletedAt').and.greaterThan(cDate)
        })

        // COLLABORATIONS
        let collaborations = await Story.findAuthorsCollaborations(authorId)
        expect(collaborations).to.have.lengthOf(0)

        // FOLLOWINGs
        let followQueryAfter = {
          $or: [
            { author: authorId },
            { follow: authorId }
          ]
        }
        let followingsAfter = await Following.find(followQueryAfter)
        expect(followingsAfter).to.have.lengthOf(0)

      } catch (err) {
        console.log(err)
        expect(err).to.not.exist
      }
    })
  })

  describe('calcStorageLimitGroup', () => {
    it('should return calculation for author only', () => {
      let author = authors[0]
      let result = authorHndl.calcStorageLimitGroup(author, '')

      expect(result).to.be.an('object')
      expect(result).to.have.property('author')

      let a = result.author
      let propertiesAuthor = ['total', 'used', 'left']
      for (let key in a) {
        expect(propertiesAuthor).to.includes(key)
      }

      expect(result.members).to.be.null

      for (let key in result.author) {
        let prop = result.author[key]
        expect(prop).to.have.property('bytes')
        expect(prop).to.have.property('format')
        expect(prop.bytes).to.be.a('number')
        expect(prop.format).to.be.a('string')
      }
    })
    it('should return calculation for author and members', () => {
      let author = authors[0]
      let members = []
      for (let i = 1; i < 4; i++) {
        const el = authors[i];
        members.push(el)
      }

      let result = authorHndl.calcStorageLimitGroup(author, members)

      expect(result).to.be.an('object')
      expect(result).to.have.property('author')

      let a = result.author
      let propertiesAuthor = ['total', 'used', 'left']
      for (let key in a) {
        expect(propertiesAuthor).to.includes(key)
      }

      for (let key in a) {
        let prop = a[key]
        expect(prop).to.have.property('bytes')
        expect(prop).to.have.property('format')
        expect(prop.bytes).to.be.a('number')
        expect(prop.format).to.be.a('string')
      }

      let m = result.members
      let propertiesMembers = ['you', 'others', 'left', 'total']
      for (let key in m) {
        expect(propertiesMembers).to.includes(key)
      }

    })
  })

  describe('storageLimit', () => {
    it('should return err, author not found', async () => {
      try {
        let author = stories[0]['_id'] // fake author id
        let result = await authorHndl.storageLimit(author.id)
        expect(result).to.not.exist

      } catch (err) {
        expect(err).to.exist
        expect(err.name).to.equals('UnprocessableEntity')
        expect(err.message).to.equals('Author not found')
        expect(err.statusCode).to.equals(422)
        expect(err.errorCode).to.equals(422)
      }
    })
    it('should return storage data for author', async () => {
      try {
        let author = authors[1]
        let result = await authorHndl.storageLimit(author.id)
        expect(result).to.be.an('object')
        expect(result).to.have.property('author')
        expect(result).to.have.property('members')
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('groupRegisterInvitation', () => {

    before(async () => {
      try {
        await initAfter()
        await initBefore()
      } catch (e) {
        throw e
      }
    })

    after(async () => {
      try {
        await initAfter()
      } catch (e) {
        throw e
      }
    })

    it('should update group and invitation', async () => {
      try {
        let group = groups[1]
        let groupInvite = groupInvites[5]
        let author = authors[3]
        let now = new Date()

        let result = await authorHndl.groupRegisterInvitation(author.id, groupInvite.token)

        expect(result).to.exist.and.not.be.empty
        expect(result).to.have.property('groupInvitation')
        let fgi = result.groupInvitation
        expect(fgi).to.have.property('token').and.equals(groupInvite.token)
        expect(fgi).to.have.property('accepted').and.true
        expect(fgi).to.have.property('updated').and.gte(now)

        expect(result).to.have.property('group')
        let fg = result.group
        expect(fg).to.have.property('updated').and.gte(now)
        expect([...fg.members, fg.owner].map(m => String(m))).to.includes(author.id)

        expect(fg.members.length).to.be.gte(group.members.length)

      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('isPlanOverrun', () => {
    it('should return true for a basic, user can sync content', () => {
      const result = authorHndl.isPlanOverrun(planLevels.BASIC, 5000)
      expect(result).to.equal(false)
    })
    it('should return false for a basic, user can\'t sync content', () => {
      const result = authorHndl.isPlanOverrun(planLevels.BASIC, 512000)
      expect(result).to.equal(true)
    })
    it('should return false for a basic, user can\'t sync content', () => {
      const result = authorHndl.isPlanOverrun(planLevels.BASIC, 5112000)
      expect(result).to.equal(true)
    })

    it('should return true for a standard, user can sync content', () => {
      const result = authorHndl.isPlanOverrun(planLevels.STANDARD, 5000)
      expect(result).to.equal(false)
    })
    it('should return false for a standard, user can\'t sync content', () => {
      const result = authorHndl.isPlanOverrun(planLevels.STANDARD, 52428800)
      expect(result).to.equal(true)
    })
    it('should return false for a standard, user can\'t sync content', () => {
      const result = authorHndl.isPlanOverrun(planLevels.STANDARD, 62428800)
      expect(result).to.equal(true)
    })

    it('should return true for a premium, user can sync content', () => {
      const result = authorHndl.isPlanOverrun(planLevels.PREMIUM, 5000)
      expect(result).to.equal(false)
    })
    it('should return false for a premium, user can\'t sync content', () => {
      const result = authorHndl.isPlanOverrun(planLevels.STANDARD, 104857600)
      expect(result).to.equal(true)
    })
    it('should return false for a premium, user can\'t sync content', () => {
      const result = authorHndl.isPlanOverrun(planLevels.STANDARD, 204857600)
      expect(result).to.equal(true)
    })
  });

  describe('setNewPassword', () => {
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

    it('should not update password, code is missing', async () => {
      try {
        const password = 'newpassword'
        await authorHndl.setNewPassword(null, password)
      } catch (err) {
        should.exist(err)
        assert.deepEqual(err.statusCode, 400)
        assert.deepEqual(err.name, 'BadRequest')
        assert.deepEqual(err.message, translate.__('Code is required'))
      }
    })

    it('should not update password, code is missing', async () => {
      try {
        const code = '1234567890'
        await authorHndl.setNewPassword(code, null)
      } catch (err) {
        should.exist(err)
        assert.deepEqual(err.statusCode, 400)
        assert.deepEqual(err.name, 'BadRequest')
        assert.deepEqual(err.message, translate.__('Password is required'))
      }
    })

    it('should not update password, code not found', async () => {
      try {
        const code = '1234567890'
        await authorHndl.setNewPassword(code, null)
      } catch (err) {
        should.exist(err)
        assert.deepEqual(err.statusCode, 400)
        assert.deepEqual(err.name, 'BadRequest')
        assert.deepEqual(err.message, translate.__('Password is required'))
      }
    })

    it('should not update password, code expired', async () => {
      try {
        const fakeForgotPasswordWrontAuthor = await forgotPasswordFaker({
          author: ObjectId(),
          single: true
        })
        const password = 'newpassword'
        await authorHndl.setNewPassword(expiredCode, password)
      } catch (err) {
        should.exist(err)
        assert.deepEqual(err.statusCode, 422)
        assert.deepEqual(err.name, 'UnprocessableEntity')
        assert.deepEqual(err.message, translate.__('Code has expired or doesn\'t exist'))
      }
    })

    it('should not update password, code user not found', async () => {
      try {
        const fakeForgotPasswordWrontAuthor = await forgotPasswordFaker({
          author: ObjectId(),
          single: true
        })
        const password = 'newpassword'
        await authorHndl.setNewPassword(fakeForgotPasswordWrontAuthor.code, password)
      } catch (err) {
        should.exist(err)
        assert.deepEqual(err.statusCode, 422)
        assert.deepEqual(err.name, 'UnprocessableEntity')
        assert.deepEqual(err.message, translate.__('User not found'))
      }
    })

    it('should update password', async () => {
      try {
        const password = 'newpassword'
        const result = await authorHndl.setNewPassword(fakeForgotPassword.code, password)

        should(result).be.type('object')
        assert.deepEqual(result._id, fakeAuthor.id)
        const author = await Author.findById(result._id)
        assert.deepEqual(author.password, utils.generatePassword(password))
      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('getByUsername', () => {
    before(async () => {
      await initAfter()
    })

    after(async () => {
      await initBefore()
    })

    it('should return error, user not found', async () => {
      try {
        await authorHndl.getByUsername('notexist')
      } catch (err) {
        expect(err).to.exist
        expect(err.name).to.equals('UnprocessableEntity')
        expect(err.message).to.equals('Author not found')
        expect(err.statusCode).to.equals(422)
        expect(err.errorCode).to.equals(422)
      }
    })

    it('should return author', async () => {
      try {
        const author = await authorFaker({
          single: true
        })
        const result = await authorHndl.getByUsername(author.username)
        assert.equal(result.username, author.username)
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })
})
