/**
 * @file Tests for group sharing handles
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

//  assertions
import chai from 'chai'
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'
// services
import mongoose from 'mongoose'
const ObjectId = mongoose.Types.ObjectId
import log from '../../src/services/log'
// fixtures
import fixtures from '../fixtures'
// models
import { Group } from '../../src/models/group'
import { GroupInvite } from '../../src/models/group-invite'
// handles
import groupHndl from '../../src/handles/group.handles'
import { initBefore, initAfter } from '../setup'
import translate from '../../src/lib/translate'

const authors = fixtures.collections.authors
const groups = fixtures.collections.group
let groupInvitations

describe('Group handles tests...', async () => {

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

  describe('is group open', () => {

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

    it('should return boolean, true if limit is in config', async () => {
      try {
        let authorId = authors[4]['id']

        let result = await groupHndl.isGroupOpen(authorId)
        expect(result).to.be.a('boolean')
        expect(result).to.be.true

      } catch (err) {
        expect(err).to.not.exist
      }
    })
    it('should return boolean, true if limit is arg', async () => {
      try {
        let authorId = authors[4]['id']

        let result = await groupHndl.isGroupOpen(authorId, 3)
        expect(result).to.be.a('boolean')
        expect(result).to.be.false

      } catch (err) {
        expect(err).to.not.exist
      }
    })
    it('should return boolean, false if limit is in config', async () => {
      try {
        let authorId = authors[0]['id']

        let result = await groupHndl.isGroupOpen(authorId)
        expect(result).to.be.a('boolean')
        expect(result).to.be.false

      } catch (err) {
        expect(err).to.not.exist
      }
    })
    it('should return boolean, false if limit is arg', async () => {
      try {
        let authorId = authors[0]['id']

        let result = await groupHndl.isGroupOpen(authorId, 8)
        expect(result).to.be.a('boolean')
        expect(result).to.be.true

      } catch (err) {
        expect(err).to.not.exist
      }
    })

  })

  describe('group invites', () => {

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

    it('should not send invitation, email not found', async () => {
      try {
        const author = authors[0]
        let result = await groupHndl.inviteUser(author.id, '')
        expect(result).to.not.exist
      } catch (err) {
        should.exist(err)
        assert.strictEqual(err.statusCode, 400)
        assert.strictEqual(err.name, 'BadRequest')
        assert.strictEqual(err.message, translate.__('Email is required'))
      }
    })
    it('should not send invitation, user not found', async () => {
      try {
        let result = await groupHndl.inviteUser(null, 'aas@as.sd')
        expect(result).to.not.exist
      } catch (err) {
        should.exist(err)
        assert.strictEqual(err.statusCode, 422)
        assert.strictEqual(err.name, 'UnprocessableEntity')
        assert.strictEqual(err.message, translate.__('Author not found'))
      }
    })
    it('should not send invitation, invitation already sent', async () => {
      try {
        const author = authors[1]
        const email = 'fakemail2@istoryapp.com'
        let result = await groupHndl.inviteUser(author.id, email)
        expect(result).to.not.exist
      } catch (err) {
        should.exist(err)
        assert.strictEqual(err.statusCode, 422)
        assert.strictEqual(err.name, 'UnprocessableEntity')
        assert.strictEqual(err.message, translate.__('Invitation already sent'))
      }
    })

    it('should not send invitation, limit exceeded', async () => {
      try {
        const author = authors[0]
        let result = await groupHndl.inviteUser(author.id, 'newinvitation@istoryapp.com')
        expect(result).to.not.exist
      } catch (err) {
        should.exist(err)
        assert.strictEqual(err.statusCode, 422)
        assert.strictEqual(err.name, 'UnprocessableEntity')
        assert.strictEqual(err.message, translate.__('There is no place for another member right now'))
      }
    })

    it('should not send invitation, author already in group', async () => {
      try {
        const author = authors[0]
        const email = authors[1]['email']
        let result = await groupHndl.inviteUser(author.id, email)
        expect(result).to.not.exist
      } catch (err) {
        should.exist(err)
        assert.strictEqual(err.statusCode, 422)
        assert.strictEqual(err.name, 'UnprocessableEntity')
        assert.strictEqual(err.message, translate.__('There is no place for another member right now'))
      }
    })

    it('should send invitation to existing user', async () => {
      try {
        // const author = authors.find(a => a.email === 'group3@istoryapp.com')
        const author = authors[6]
        // const email = 'group4@istoryapp.com'
        const email = authors[7]['email']
        const invitation = await groupHndl.inviteUser(author.id, email)

        should(invitation).be.type('object')
        should(invitation).have.property('token')
        should(invitation.token).be.type('string')
        assert.strictEqual(invitation.email, email)
        should(invitation).have.property('invited')
        assert.strictEqual(invitation.invited.email, email)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should send invitation to non existing user', async () => {
      try {
        const author = authors.find(a => a.email === 'group3@istoryapp.com')
        const email = 'group1234@istoryapp.com'
        const invitation = await groupHndl.inviteUser(author.id, email)

        should(invitation).be.type('object')
        should(invitation).have.property('token')
        should(invitation.token).be.type('string')
        assert.strictEqual(invitation.email, email)
        should(invitation).have.property('invited')
        assert.strictEqual(invitation.invited, null)

      } catch (err) {
        should.not.exist(err)
      }
    })

  })

  describe('accept group invitation', () => {

    before(async () => {
      await initAfter()
    })

    beforeEach(async () => {
      try {
        await initBefore()
      } catch (e) {
        throw e
      }
    })

    afterEach(async () => {
      try {
        await initAfter()
      } catch (e) {
        throw e
      }
    })

    it('should not accept invitation, does not exist', async () => {
      try {
        await groupHndl.acceptInvitation('1234', false)
      } catch (e) {
        should.exist(e)
        should(e).be.type('object')
        should(e).have.property('statusCode')
        assert.strictEqual(e.statusCode, 422)
        should(e).have.property('message')
        assert.strictEqual(e.message, translate.__('Invitation does not exist or has been expired'))
        should(e).have.property('name')
        assert.strictEqual(e.name, 'UnprocessableEntity')
      }
    })

    it('should not accept invitation, user does not exist', async () => {
      try {
        await groupHndl.acceptInvitation('invitation1', false)
      } catch (e) {
        should.exist(e)
        should(e).be.type('object')
        should(e).have.property('statusCode')
        assert.strictEqual(e.statusCode, 422)
        should(e).have.property('message')
        assert.strictEqual(e.message, translate.__('User not found'))
        should(e).have.property('name')
        assert.strictEqual(e.name, 'UnprocessableEntity')
      }
    })

    it('should not accept invitation, inactive invitation', async () => {
      try {
        await groupHndl.acceptInvitation('invitation2', false)
      } catch (e) {
        should.exist(e)
        should(e).be.type('object')
        should(e).have.property('statusCode')
        assert.strictEqual(e.statusCode, 422)
        should(e).have.property('message')
        assert.strictEqual(e.message, translate.__('Invitation does not exist or has been expired'))
        should(e).have.property('name')
        assert.strictEqual(e.name, 'UnprocessableEntity')
      }
    })

    it('should denied invitation, by author', async () => {
      try {
        const result = await groupHndl.acceptInvitation('invitation3', false)

        should(result).be.type('object')
        should(result).have.property('accepted')
        assert.strictEqual(result.accepted, false)
        should(result).have.property('group')
        assert.strictEqual(result.group, null)

      } catch (e) {
        should.not.exist(e)
      }
    })

    it('should accept invitation, by author', async () => {
      try {
        const result = await groupHndl.acceptInvitation('invitation3', true)

        should(result).be.type('object')
        should(result).have.property('accepted')
        assert.strictEqual(result.accepted, true)
        should(result).have.property('group')
        should(result.group).be.type('string')

      } catch (e) {
        should.not.exist(e)
      }
    })

  })

  describe('group leave', () => {

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

    it('should throw err, user not found', async () => {
      try {
        let authorId = ObjectId()
        let result = await groupHndl.leaveGroup(authorId)
        expect(result).to.not.exist
      } catch (err) {
        expect(err).to.exist
        expect(err.statusCode).to.exist.and.equals(422)
        expect(err.message).to.exist.and.equals('Author not found')
        expect(err.name).to.exist.and.equals('UnprocessableEntity')
      }
    })

    it('should throw err, group not found', async () => {

      const author = authors[7]
      const authorId = author._id
      const email = author.email

      try {

        let result = await groupHndl.leaveGroup(authorId)
        expect(result).to.not.exist

      } catch (err) {
        expect(err).to.exist
        expect(err.statusCode).to.exist.and.equals(422)
        expect(err.message).to.exist.and.equals(`There is no group with specified author`)
        expect(err.name).to.exist.and.equals('UnprocessableEntity')
      }
    })

    it('should leave group, member', async () => {
      try {

        const authorId = '5a538361ea64260e00eb7548'

        //BEFORE
        let groupBefore = await Group.findForAuthor(authorId)

        expect(groupBefore).to.exist.and.be.an('object').that.have.property('_id')
        expect(groupBefore).to.have.property('owner')
        expect(groupBefore).to.have.property('active')
        let membersBefore = groupBefore.members
        expect(membersBefore).to.have.lengthOf(2)
        // find specific member before he leaves :)
        expect(membersBefore).to.include(authorId)

        const groupAfter = await groupHndl.leaveGroup(authorId)

        // AFTER
        expect(groupAfter).to.exist.and.be.an('object').that.have.property('_id')
        expect(groupAfter).to.have.property('owner')
        expect(groupAfter).to.have.property('active')
        let membersAfter = groupAfter.members
        expect(membersAfter).to.have.lengthOf(1)
        // do not find member with specific email after
        expect(membersAfter).to.not.include(authorId)

      } catch (err) {
        expect(err).to.not.exist
      }
    })
    it('should leave group, owner', async () => {
      try {

        const authorId = '5a538361ea64260e00eb7547'

        //BEFORE
        let groupBefore = await Group.findForAuthor(authorId)

        expect(groupBefore).to.exist.and.be.an('object').that.have.property('_id')
        expect(groupBefore).to.have.property('owner')
        expect(groupBefore).to.have.property('active')
        expect(groupBefore.owner).to.exist

        const groupAfter = await groupHndl.leaveGroup(authorId)

        // AFTER
        expect(groupAfter).to.exist.and.be.an('object').that.have.property('_id')
        expect(groupAfter).to.have.property('owner')
        expect(groupAfter).to.have.property('active')
        expect(groupBefore.members).to.deep.equals(groupAfter.members)
        expect(groupAfter.owner).to.be.null

      } catch (err) {
        console.log(err)
        expect(err).to.not.exist
      }
    })

  })

  describe('group remove', () => {

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

    it('should throw err, group not found', async () => {
      try {
        let ownerId = ObjectId()
        let groupUserId = ObjectId()
        let groupId = ObjectId()

        let result = await groupHndl.removeFromGroup(ownerId, groupUserId, groupId)

        expect(result).to.not.exist
      } catch (err) {
        expect(err).to.exist
        expect(err.statusCode).to.exist.and.equals(422)
        expect(err.message).to.exist.and.equals('Group not found')
        expect(err.name).to.exist.and.equals('UnprocessableEntity')
      }
    })

    it('should throw err, user don\'t have permission', async () => {
      try {
        const group = groups[0]
        const ownerId = authors[0]['id']
        const groupUserId = group.members[0]
        const groupId = group['_id']

        let result = await groupHndl.removeFromGroup(ownerId, groupUserId, groupId)

        expect(result).to.not.exist
      } catch (err) {
        expect(err).to.exist
        expect(err.statusCode).to.exist.and.equals(400)
        expect(err.message).to.exist.and.equals('You don\'t have permission for this action')
        expect(err.name).to.exist.and.equals('BadRequest')
      }
    })
    it('should remove user', async () => {
      try {
        const group = groups[0]
        const ownerId = group.owner
        const groupUserId = group.members[0]
        const groupId = group['_id']

        let result = await groupHndl.removeFromGroup(ownerId, groupUserId, groupId)

        expect(result).to.be.an('object')
        expect(result).to.have.property('_id').and.deep.equals(ObjectId(groupId))
        expect(result).to.have.property('owner').and.deep.equals(ObjectId(ownerId))
        expect(result).to.have.property('active').and.true
        expect(result.members).to.not.include(groupUserId)
      } catch (err) {
        expect(err).to.not.exist
      }
    })


  })

  describe('group cancel', () => {

    before(async () => {
      try {
        await initAfter()
        await initBefore()
        // get all invitations before this test block
        groupInvitations = await GroupInvite.find()
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

    it('should throw err, group not found', async () => {
      try {
        let authorId = ObjectId()
        let invitationId = ObjectId()

        let result = await groupHndl.cancelGroupInvitation(authorId, invitationId)

        expect(result).to.not.exist
      } catch (err) {
        expect(err).to.exist
        expect(err.statusCode).to.exist.and.equals(422)
        expect(err.message).to.exist.and.equals('There is no requested invitation')
        expect(err.name).to.exist.and.equals('UnprocessableEntity')
      }
    })

    it('should throw err, user don\'t have permission', async () => {
      try {
        const groupInvitation = groupInvitations[0]

        // fake author
        let authorId = ObjectId()
        let invitationId = groupInvitation.id

        let result = await groupHndl.cancelGroupInvitation(authorId, invitationId)

        expect(result).to.not.exist
      } catch (err) {
        expect(err).to.exist
        expect(err.statusCode).to.exist.and.equals(400)
        expect(err.message).to.exist.and.equals('You don\'t have permission for this action')
        expect(err.name).to.exist.and.equals('BadRequest')
      }
    })
    it('should remove user', async () => {
      try {
        const groupInvitation = groupInvitations[0]

        // real author
        let authorId = groupInvitation.author
        let invitationId = groupInvitation.id

        let result = await groupHndl.cancelGroupInvitation(authorId, invitationId)

        expect(JSON.stringify(groupInvitation)).to.equals(JSON.stringify(result))

        // Check if invitation's removed
        let invitationAfter = await GroupInvite.findOneActiveById(invitationId)
        expect(invitationAfter).to.be.null

      } catch (err) {
        expect(err).to.not.exist
      }
    })

  })


})
