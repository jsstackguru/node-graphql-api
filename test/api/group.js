//  assert
import chai from 'chai'
import { assert, expect } from 'chai'
import should from 'should'
import server from '../setup/server'

// models
import { GroupInvite } from '../../src/models/group-invite'

// libs
import translate from '../../src/lib/translate'
import { initAfter, initBefore } from '../setup'
import { generateToken } from '../../src/services/auth'
import { ObjectId } from 'mongodb'

// fixtures
import fixtures from '../fixtures'

const authors = fixtures.collections.authors
const groups = fixtures.collections.group

describe('should test API for group...', () => {

  describe('invite user by email', () => {

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
          .post('/v1/group/invite')
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

    it('should return error, email missing', async () => {
      try {
        let author = authors[1]
        let token = generateToken(author['email'])
        let data = {
          email: ''
        }

        let response = await chai.request(server)
          .post('/v1/group/invite')
          .set('Authorization', `Bearer ${token}`)
          .send(data)

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Email is required'))
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should send invitation to existing user', async () => {
      try {
        const author = authors[6]
        const invite = authors[7]
        const email = invite.email
        let token = generateToken(author['email'])
        let data = {
          email: email
        }

        let response = await chai.request(server)
          .post('/v1/group/invite')
          .set('Authorization', `Bearer ${token}`)
          .send(data)

        // console.log(JSON.stringify(response.body, null, 2))
        should.exist(response.body)
        let result = response.body
        should(result).have.property('data')
        result = result.data
        expect(response.body).to.have.property('message').and.equal('You successfully send invitation')
        should(result).have.property('invited')
        should(result.invited).be.type('object')
        should(result.invited).have.property('_id')
        should(result.invited).have.property('name')
        should(result.invited).have.property('username')
        should(result.invited).have.property('email')
        assert.strictEqual(result.invited.email, email)
        should(result).have.property('email')
        assert.strictEqual(result.email, email)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should send invitation to non existing user', async () => {
      try {
        const author = authors[7]
        const email = 'group1234@istoryapp.com'
        let token = generateToken(author['email'])
        let data = {
          email: email
        }

        let response = await chai.request(server)
          .post('/v1/group/invite')
          .set('Authorization', `Bearer ${token}`)
          .send(data)

        should.exist(response.body)
        let result = response.body
        should(result).have.property('data')
        result = result.data
        expect(response.body).to.have.property('message').and.equal('You successfully send invitation')
        should(result).have.property('invited')
        assert.strictEqual(result.invited, null)
        should(result).have.property('email')
        assert.strictEqual(result.email, email)

      } catch (err) {
        should.not.exist(err)
      }
    })

  })

  describe('accept invitation', () => {

    beforeEach(async () => {
      await initAfter()
      await initBefore()
    })

    afterEach(async () => {
      await initAfter()
    })

    it('should return error, email missing', async () => {
      try {
        let author = authors[1]
        let token = generateToken(author['email'])
        let data = {
          token: '',
          accept: null,
        }

        let response = await chai.request(server)
          .post('/v1/group/accept')
          .set('Authorization', `Bearer ${token}`)
          .send(data)

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Token is required'))
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should denied invitation', async () => {
      try {
        let data = {
          token: 'invitation3',
          accept: false,
        }

        let response = await chai.request(server)
          .post('/v1/group/accept')
          // .set('Authorization', `Bearer ${token}`)
          .send(data)

        should.exist(response.body)
        let result = response.body
        should(result).have.property('data')
        const resData = result.data
        should(resData).have.property('accepted')
        assert.strictEqual(resData.accepted, false)
        should(resData).have.property('group')
        assert.strictEqual(resData.group, null)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should accept invitation', async () => {
      try {
        let data = {
          token: 'invitation3',
          accept: true,
        }

        let response = await chai.request(server)
          .post('/v1/group/accept')
          // .set('Authorization', `Bearer ${token}`)
          .send(data)

        // console.log(JSON.stringify(response.body, null, 2))
        should.exist(response.body)
        let result = response.body
        should(result).have.property('data')
        const resData = result.data
        should(resData).have.property('accepted')
        assert.strictEqual(resData.accepted, true)
        should(resData).have.property('group')
        should(resData.group).be.type('string')
        assert.notStrictEqual(resData.group, null)

      } catch (err) {
        should.not.exist(err)
      }
    })

  })

  describe('leave group', () => {

    beforeEach(async () => {
      await initAfter()
      await initBefore()
    })

    afterEach(async () => {
      await initAfter()
    })

    it('should not leave group, authorization token is missing', async () => {
      try {
        let authorId = authors[5]['_id']
        let response = await chai.request(server)
          .post(`/v1/group/leave`)
          .set('Authorization', '')

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(401)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Authorization token missing'))
        expect(errorText.statusCode).to.be.equal(401)

      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should leave group', async () => {
      try {
        let author = authors[5]
        let token = generateToken(author.email)

        let response = await chai.request(server)
          .post(`/v1/group/leave`)
          .set('Authorization', `Bearer ${token}`)

        // console.log(JSON.stringify(response.body, null, 2))
        expect(response.body).to.exist
        let res = response.body
        expect(res).to.have.property('message').and.equals('You have successfully left the group')
        expect(res).to.have.property('data')

      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

  })

  describe('remove from group', () => {

    beforeEach(async () => {
      await initAfter()
      await initBefore()
    })

    afterEach(async () => {
      await initAfter()
    })

    it('should not remove from group, authorization token is missing', async () => {
      try {
        let response = await chai.request(server)
          .post(`/v1/group/remove`)
          .set('Authorization', '')

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(401)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Authorization token missing'))
        expect(errorText.statusCode).to.be.equal(401)

      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should not remove from group, groupUserId is missing', async () => {
      try {

        let group = groups[0]
        let author = authors[5]
        let token = generateToken(author['email'])

        let obj = {
          groupId: group['_id']
        }

        let response = await chai.request(server)
          .post(`/v1/group/remove`)
          .set('Authorization', `Bearer ${token}`)
          .send(obj)

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('User ID is not correct'))
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should not remove from group, groupUserId is invalid', async () => {
      try {

        let group = groups[0]
        let author = authors[5]
        let token = generateToken(author['email'])

        let obj = {
          groupId: group['_id'],
          groupUserId: 'asdf'
        }

        let response = await chai.request(server)
          .post(`/v1/group/remove`)
          .set('Authorization', `Bearer ${token}`)
          .send(obj)

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('User ID is not correct'))
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should not remove from group, owner wants to remove himself', async () => {
      try {

        let group = groups[0]
        let author = authors[5]
        let token = generateToken(author['email'])

        let obj = {
          groupId: group['_id'],
          groupUserId: author.id
        }

        let response = await chai.request(server)
          .post(`/v1/group/remove`)
          .set('Authorization', `Bearer ${token}`)
          .send(obj)

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(400)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('User ID is not correct'))
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should remove from group', async () => {
      try {

        let group = groups[0]
        let author = authors[4] // owner
        let token = generateToken(author['email'])
        let groupUserId = authors[5]['id']

        let obj = {
          group: group['_id'],
          groupUser: groupUserId
        }

        let response = await chai.request(server)
          .post(`/v1/group/remove`)
          .set('Authorization', `Bearer ${token}`)
          .send(obj)

        // console.log(JSON.stringify(response.body, null, 2))
        expect(response.body).to.exist
        let res = response.body
        expect(res).to.have.property('message').and.equals('You successfully removed user from group')
        expect(res).to.have.property('data')

      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

  })

  describe('cancel group invitation', () => {

    beforeEach(async () => {
      await initAfter()
      await initBefore()
    })

    afterEach(async () => {
      await initAfter()
    })

    it('should not cancel group invitation, authorization token is missing', async () => {
      try {

        let response = await chai.request(server)
          .post(`/v1/group/cancel/fakeId`)
          .set('Authorization', '')

        should.exist(response.error)
        let error = response.error
        expect(error.status).to.be.equal(401)
        let errorText = JSON.parse(error.text)
        expect(errorText.message).to.be.equal(translate.__('Authorization token missing'))
        expect(errorText.statusCode).to.be.equal(401)

      } catch (err) {
        expect(err).to.not.exist
        throw err
      }
    })

    it('should not cancel invitation, invitationId is missing or not correct', async () => {
      try {
        const groupInvites = await GroupInvite.find()
        const fGInvite = groupInvites[1]

        let authorId = fGInvite.author
        let author = authors.find(a => a._id == authorId)

        let token = generateToken(author['email'])

        let response = await chai.request(server)
          .post(`/v1/group/cancel/1234`)
          .set('Authorization', `Bearer ${token}`)

        expect(response.error).to.exist
        let error = response.error
        let errorText = JSON.parse(error.text)
        expect(error.status).to.be.equal(400)
        expect(errorText.message).to.be.equal(translate.__('Invitation ID is missing or not correct format'))
        expect(errorText.statusCode).to.be.equal(400)

      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })

    it('should cancel and group invitation', async () => {
      try {

        const groupInvites = await GroupInvite.find()
        const fGInvite = groupInvites[2]

        let authorId = fGInvite.author
        let author = authors.find(a => a._id == authorId)
        let invitationId = fGInvite.id

        let token = generateToken(author['email'])

        let response = await chai.request(server)
          .post(`/v1/group/cancel/${invitationId}`)
          .set('Authorization', `Bearer ${token}`)

        // console.log(JSON.stringify(response.body, null, 2))
        expect(response.body).to.exist
        let res = response.body
        expect(res).to.have.property('status').and.true
        expect(res).to.have.property('message').and.equals('You successfully canceled group invitation')

      } catch (err) {
        expect(err).to.not.exist
        throw err
      }
    })

  })

})
