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
import { ForgotPassword } from '../../src/models/forgot-password'


describe('Forgot password model', () => {

  after(async () => {
    await initAfter()
  })

  describe('Create', () => {

    it('should create new Forgot password', async () => {
      try {

        const author = ObjectId()
        let fPObj = {
          author,
          code: 'qwerty§12345',
          // active: true
        }

        await ForgotPassword.create(fPObj)

        let newFP = await ForgotPassword.findOne({author})

        expect(newFP).to.be.an('object')
        expect(newFP).to.have.property('created')
        expect(newFP).to.have.property('updated')

        // all props must be the same as in fPObj
        for (let key in fPObj) {
          let prop = fPObj[key]
          expect(JSON.stringify(prop)).to.deep.equal(JSON.stringify(newFP[key]))
        }

      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('should fail forgot password props validations required', async () => {
      try {
        let fPObj = {}

        let following = await ForgotPassword.create(fPObj)
        expect(following).to.not.exist
      } catch (err) {
        let errors = [
          'forgotpasswords validation failed',
          'Code is required',
          'Author ID is required'
        ]

        for (let error of errors) {
          expect(err.message).to.includes(error)
        }
      }
    })

    it('should fail forgot password props validation for cast to OID ', async () => {
      let fPObj
      try {
        fPObj = {
          author: '1234',
          code: 1234,
          active: true
        }

        let following = await ForgotPassword.create(fPObj)
        expect(following).to.not.exist

      } catch (err) {
        let errors = [
          'forgotpasswords validation failed',
          `Cast to ObjectID failed for value "${fPObj.author}"`
        ]
        for (let error of errors) {
          expect(err.message).to.includes(error)
        }

      }
    })

  })

  describe('Update', () => {

    const author = ObjectId()
    let fPObj = {
      author,
      code: 'qwerty§12345',
      // active: true
    }

    before( async () => {
      await ForgotPassword.create(fPObj)
    })

    it('should update forgot password', async () => {
      try {
        const query = { author }
        const update = { code: 'updated code' }

        const options = { new: true }
        let updatedFG = await ForgotPassword.findOneAndUpdate(query, update, options)

        expect(updatedFG).to.exist.and.be.an('object')

        for (let key in fPObj) {
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
    let fPObj = {
      author,
      code: 'qwerty§12345',
      active: true
    }

    before(async () => {
      await ForgotPassword.create(fPObj)
    })

    it('should delete forgot password', async () => {
      try {
        const query = { author }
        await ForgotPassword.findOneAndRemove(query)
        let after = await ForgotPassword.findOne(query)

        expect(after).to.be.null
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

})