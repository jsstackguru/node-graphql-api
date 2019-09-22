//  assertions
import chai from 'chai'
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'
// services
import { initBefore, initAfter } from '../setup'
import { ObjectId } from 'mongodb'
import translate from '../../src/lib/translate';
// model
import CollaborationInvite from '../../src/models/collaboration-invite'

describe('Collaboration invite models', () => {

  after(async () => {
    await initAfter()
  })

  describe('Create', () => {

    it('should create new collaboration invitation', async () => {
      try {

        const authorId = ObjectId()
        const storyId = ObjectId()
        const invitedId = ObjectId()
        let inviteObj = {
          author: authorId,
          story: storyId,
          invited: invitedId,
          edit: true,
          email: 'iOS@bio.com'
        }

        await CollaborationInvite.create(inviteObj)

        let newInvite = await CollaborationInvite.findOne({author: authorId})

        expect(newInvite).to.be.an('object')
        expect(newInvite).to.have.property('created')
        expect(newInvite).to.have.property('updated')

        // all props must be the same as in comObj
        for (let key in inviteObj) {
          let prop = inviteObj[key]
          expect(prop).to.deep.equal(newInvite[key])
        }

      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('should fail collaboration invite props validations required', async () => {
      try {
        let inviteObj = {}

        let invite = await CollaborationInvite.create(inviteObj)

        expect(invite).to.not.exist
      } catch (err) {
        let rules = [
          'collaboration_invites validation failed',
          'Email is required if not invited via user ID',
          'Edit is required', 'Invited ID is required'
        ]
        for (let rule of rules) {
          expect(err.message).to.include(rule)
        }
      }
    })

    it('should fail collaboration invite props validation for cast to OID ', async () => {
      try {
        let inviteObj = {
          author: 'fakeID1',
          story: 'fakeID2',
          invited: 'fakeID3',
          edit: true,
          email: 'as'
        }

        let invite = await CollaborationInvite.create(inviteObj)
        expect(invite).to.not.exist

      } catch (err) {
        let rules = [
          'collaboration_invites validation failed',
          'Cast to ObjectID failed for value'
        ]
        for (let rule of rules) {
          expect(err.message).to.include(rule)
        }
      }
    })

  })

  describe('Update', () => {

    const authorId = ObjectId()
    const storyId = ObjectId()
    const invitedId = ObjectId()
    let inviteObj = {
      author: authorId,
      story: storyId,
      invited: invitedId,
      edit: true,
      email: 'iOS@bio.com'
    }

    before( async () => {
      await CollaborationInvite.create(inviteObj)
    })

    it('should update collaboration invite', async () => {
      try {
        const query = { author: authorId}
        const update = {
          active: true,
          accpeted: true,
          edit: false
        }
        const options = { new: true }
        let updatedInvite = await CollaborationInvite.findOneAndUpdate(query, update, options)

        expect(updatedInvite).to.exist.and.be.an('object')

        for (let key in inviteObj) {
          // check if props exist
          expect(updatedInvite[key]).to.exist
          // check if props updated
          if (update[key]) {
            expect(updatedInvite[key]).to.equals(update[key])
          }
        }
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('Delete', () => {

    const authorId = ObjectId()
    const storyId = ObjectId()
    const invitedId = ObjectId()
    let inviteObj = {
      author: authorId,
      story: storyId,
      invited: invitedId,
      edit: true,
      email: 'iOS@bio.com'
    }

    before(async () => {
      await CollaborationInvite.create(inviteObj)
    })

    it('should delete invite', async () => {
      try {
        const query = { author: authorId }
        await CollaborationInvite.findOneAndRemove(query)
        let after = await CollaborationInvite.findOne(query)

        expect(after).to.be.null
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

})

