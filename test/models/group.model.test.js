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
import { Group } from '../../src/models/group'


describe('Group model', () => {

  after(async () => {
    await initAfter()
  })

  describe('Create', () => {

    it('should create new group', async () => {
      try {

        const member1 = ObjectId()
        const owner = ObjectId()
        let fgObj = {
          owner,
          active: true,
          members: [member1],
        }

        await Group.create(fgObj)

        let newSpam = await Group.findOne({owner})

        expect(newSpam).to.be.an('object')
        expect(newSpam).to.have.property('created')
        expect(newSpam).to.have.property('updated')

        // all props must be the same as in fgObj
        for (let key in fgObj) {
          let prop = fgObj[key]
          expect(prop).to.deep.equal(newSpam[key])
        }

      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('should fail group props validations required', async () => {
      try {
        let fgObj = {}

        let group = await Group.create(fgObj)
        expect(group).to.not.exist
      } catch (err) {
        let errors = [
          'group validation failed',
          'If no members owner is required'
        ]
        for (let error of errors) {
          expect(err.message).to.includes(error)
        }
      }
    })

    it('should fail group props validation for cast to OID ', async () => {
      let fgObj
      try {
        fgObj = {
          owner: 'fakeID1',
          members: ['fakeID2', 'fakeID3']
        }

        let group = await Group.create(fgObj)
        expect(group).to.not.exist

      } catch (err) {
        let errors = [
          'group validation failed',
          `Cast to ObjectID failed for value "${fgObj.owner}"`,
          `members: Cast to Array failed for value`
        ]

        for (let error of errors) {
          expect(err.message).to.includes(error)
        }
      }
    })

  })

  describe('Update', () => {

    const owner = ObjectId()
    const member1 = ObjectId()
    const member2 = ObjectId()
    let fgObj = {
      owner,
      members: [member1, member2]
    }

    before( async () => {
      await Group.create(fgObj)
    })

    it('should update group', async () => {
      try {
        const newMember = ObjectId()
        const query = { owner }
        const update = { $push: {members: newMember} }

        const options = { new: true }
        let updatedFG = await Group.findOneAndUpdate(query, update, options)

        expect(updatedFG).to.exist.and.be.an('object')

        for (let key in fgObj) {
          // check if props exist
          expect(updatedFG[key]).to.exist
          // check if props updated
          if (update[key]) {
            expect(updatedFG[key]).to.equals(update[key])
          }
        }
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('Delete', () => {

    const owner = ObjectId()
    const member1 = ObjectId()
    const member2 = ObjectId()
    let fgObj = {
      owner,
      members: [member1, member2]
    }

    before(async () => {
      await Group.create(fgObj)
    })

    it('should delete group', async () => {
      try {
        const query = { owner }
        await Group.findOneAndRemove(query)
        let after = await Group.findOne(query)

        expect(after).to.be.null
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

})

