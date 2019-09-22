//  assertions
import { expect } from 'chai'
// services
import { initBefore, initAfter } from '../setup'
// fixtures
import fixtures from '../fixtures'
// model
import {GroupInvite } from '../../src/models/group-invite'

const authors = fixtures.collections.authors

describe('Group invite statics tests...', async () => {

  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('findOneActiveById', () => {

    it('should not find group invite by id, throw err', async () => {
      try {
        const author = authors[0]

        const groupInvite = await GroupInvite.findOneActiveById(author.id, 'throw_err')

        expect(groupInvite).to.not.exist

      } catch (err) {
        expect(err).to.exist
        expect(err.name).to.equals('UnprocessableEntity')
        expect(err.message).to.equals('There is no requested invitation')
        expect(err.statusCode).to.equals(422)
        expect(err.errorCode).to.equals(422)

      }
    })

    it('should find group invite by id', async () => {
      try {
        // get all invitations
        const groupInvites = await GroupInvite.find()

        const invitationBefore = groupInvites[0]
        const invitationId = invitationBefore['id']
        const invitationAfter = await GroupInvite.findOneActiveById(invitationId, 'throw_err')

        expect(invitationAfter).to.exist
        expect(invitationAfter).to.have.property('active').and.true
        expect(JSON.stringify(invitationBefore)).to.equal(JSON.stringify(invitationAfter))
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('findAllPendingInvitations', () => {

    it('should not find any invitations, throw err', async () => {
      try {
        const author = authors[7]

        const pendingInvitations = await GroupInvite.findAllPendingInvitations(author.id, 'throw_err')

        expect(pendingInvitations).to.not.exist

      } catch (err) {
        expect(err).to.exist
        expect(err.name).to.equals('UnprocessableEntity')
        expect(err.message).to.equals('There are no pending invitations')
        expect(err.statusCode).to.equals(422)
        expect(err.errorCode).to.equals(422)

      }
    })

    it('should find group invite by id', async () => {
      try {
        // get all invitations
        const groupInvites = await GroupInvite.find()

        const invitation = groupInvites[2]
        const authorId = invitation['author']

        const invitationAfter = await GroupInvite.findAllPendingInvitations(authorId, 'throw_err')

        invitationAfter.forEach(invitation => {
          expect(invitation).to.exist
          expect(invitation).to.have.property('active').and.true
          expect(invitation).to.have.property('accepted').and.null
          expect(invitation).to.have.property('author').and.deep.equals(authorId)
        })

      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

})
