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
import { GroupInvite } from '../../src/models/group-invite'


describe('Group invite model', () => {

  after(async () => {
    await initAfter()
  })

  describe('Create', () => {

    it('should create new group invite', async () => {
      try {

        const author = ObjectId()
        const invited = ObjectId()
        let fgObj = {
          author,
          invited: {
            author: invited
            // email: 'asdf'
          },
          token: 'token1234',
        }

        await GroupInvite.create(fgObj)

        let newFG = await GroupInvite.findOne({author})

        expect(newFG).to.be.an('object')
        expect(newFG).to.have.property('created')
        expect(newFG).to.have.property('updated')

        // all props must be the same as in fgObj
        for (let key in fgObj) {
          let prop = fgObj[key]
          expect(JSON.stringify(prop)).to.deep.equal(JSON.stringify(newFG[key]))
        }

      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('should fail group invite props validations required', async () => {
      try {
        let fgObj = {}

        let groupInvite = await GroupInvite.create(fgObj)
        expect(groupInvite).to.not.exist

      } catch (err) {
        let errors = [
          'group_invites validation failed',
          'Token is required',
          'Email is required if not invited via user ID',
          'Invited ID is required if not invited via email',
          'Author ID is required'
        ]

        for (let error of errors) {
          expect(err.message).to.includes(error)
        }
      }
    })

    it('should fail group invite props validation for cast to OID ', async () => {
      let fgObj
      try {
        fgObj = {
          author: '1234',
          invited: {
            author: 1234,
            email: 'asdf'
          },
          token: 'token1234',
        }

        let groupInvite = await GroupInvite.create(fgObj)
        expect(groupInvite).to.not.exist

      } catch (err) {
        let errors = [
          'group_invites validation failed',
          `Cast to ObjectID failed for value "${fgObj.author}"`
        ]

        for (let error of errors) {
          expect(err.message).to.includes(error)
        }
      }
    })

  })

  describe('Update', () => {
    const author = ObjectId()
    const invited = ObjectId()
    let fgObj = {
      author,
      invited: {
        author: invited
        // email: 'asdf'
      },
      token: 'token1234',
    }


    before( async () => {
      await GroupInvite.create(fgObj)
    })

    it('should update group invite', async () => {
      try {
        const query = { author }
        const update = { token: 'updated token' }

        const options = { new: true }
        let updatedFG = await GroupInvite.findOneAndUpdate(query, update, options)

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

    const author = ObjectId()
    const invited = ObjectId()
    let fgObj = {
      author,
      invited: {
        author: invited,
        email: 'asdf'
      },
      token: 'token1234',
    }

    before(async () => {
      await GroupInvite.create(fgObj)
    })

    it('should delete invite', async () => {
      try {
        const query = { author }
        await GroupInvite.findOneAndRemove(query)
        let after = await GroupInvite.findOne(query)

        expect(after).to.be.null
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

})

