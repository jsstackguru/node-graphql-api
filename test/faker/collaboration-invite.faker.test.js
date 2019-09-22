//  assertions
import { expect } from 'chai'

// models
import CollaborationInvite from '../../src/models/collaboration-invite'

// faker
import collaborationInviteFaker from '../fixtures/faker/collaboration-invite/collaboration-invite.faker'

// after hooks
import { initAfter } from '../setup/'

// utils
import { ObjectId } from 'mongodb'

describe('collaboration invite faker', () => {

  const expectedKeys = [
    '_id', 'author', 'story', 'email', 'invited', 'edit', 'active', 'accepted'
   ]

  afterEach(async () => {
    await initAfter()
  })

  it('should create invites with default params if no args', async () => {
    await collaborationInviteFaker({})

    let invites = await CollaborationInvite.find({})

    expect(invites).to.be.an('array').and.have.lengthOf(1)

    invites.forEach(invite => {
      expectedKeys.forEach(key => {
        expect(invite[key]).to.exist
      })
    })
  })

  it('should create invites with only number of author arg', async () => {
    let params = {
      n: 2,
    }
    await collaborationInviteFaker(params)
    let invites = await CollaborationInvite.find({})

    expect(invites).to.have.lengthOf(params.n)
    invites.forEach(invite => {
      expectedKeys.forEach(key => {
        expect(invite[key]).to.exist
      })
    })
  })

  it('should create authors with all args', async () => {
    let params = {
      n: 2,
      author: ObjectId(),
      invited: ObjectId(),
      active: false,
      email: 'something@as.as',
    }
    await collaborationInviteFaker(params)
    let invites = await CollaborationInvite.find({})
    expect(invites).to.have.lengthOf(params.n)
    invites.forEach(invite => {
      expectedKeys.forEach(key => {
        expect(invite[key]).to.exist
      })
      expect(invite.author).to.deep.equals(params.author)
      expect(invite.invited).to.deep.equals(params.invited)
      expect(invite.email).to.equals(params.email)
      expect(invite.active).to.equals(params.active)
    })
  })

})
