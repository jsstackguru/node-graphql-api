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
import { Author } from '../../src/models/author'


describe('Author model', () => {

  after(async () => {
    await initAfter()
  })

  describe('Create', () => {

    it('should create new author', async () => {
      try {

        let authorObj = {
          username: 'sajko username',
          name: 'sajko',
          email: 'email@email.com',
          location: {
            name: 'nis'
          },
          plan: {
            level: 'PREMIUM'
          }
        }

        await Author.create(authorObj)

        let newAuthor = await Author.findOne({name: 'sajko'})

        expect(newAuthor).to.be.an('object')
        expect(newAuthor).to.have.property('created')
        expect(newAuthor).to.have.property('updated')

        // all props must be the same as in authorObj
        for (let key in authorObj) {
          let prop = authorObj[key]
          expect(JSON.stringify(prop)).to.deep.equal(JSON.stringify(newAuthor[key]))
        }

      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('should fail author validations required', async () => {
      try {
        let authorObj = {}

        let author = await Author.create(authorObj)
        expect(author).to.not.exist
      } catch (err) {
        let rules = ['authors validation failed', 'Username is required', 'Email is required']
        for (let rule of rules) {
          expect(err.message).to.includes(rule)
        }
      }
    })

    it('should fail email and plan props custom validation', async () => {
      try {

        let authorObj = {
          username: 'sajko username',
          name: 'sajko',
          email: 'bademail@format',
          location: {
            name: 'nis'
          },
          plan: {
            level: 'NOTVALID'
          }
        }

        let author = await Author.create(authorObj)
        expect(author).to.not.exist

      } catch (err) {
        let rules = ['authors validation failed', 'Email must be a valid format', 'Plan level not recognized']
        for (let rule of rules) {
          expect(err.message).to.includes(rule)
        }
      }
    })
  })

  describe('Update', () => {

    let authorObj = {
      username: 'sajko',
      name: 'sajko',
      email: 'email@email.com',
      location: {
        name: 'nis'
      },
      plan: {
        level: 'PREMIUM'
      }
    }

    before( async () => {
      await Author.create(authorObj)
    })

    it('should update author', async () => {
      try {
        const query = { username: 'sajko' }
        const update = { name: 'updated sajko', email: 'hoj@hoj.hoj' }
        const options = { new: true }

        let updatedAuthor = await Author.findOneAndUpdate(query, update, options)

        expect(updatedAuthor).to.exist.and.be.an('object')

        for (let key in authorObj) {
          // check if props exist
          expect(updatedAuthor[key]).to.exist
          // check if props updated
          if (update[key]) {
            expect(updatedAuthor[key]).to.equals(update[key])
          }
        }
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('Delete', () => {

    let authorObj = {
      username: 'sajkouser',
      name: 'sajko',
      email: 'email@email.com',
      location: {
        name: 'nis'
      },
      plan: {
        level: 'PREMIUM'
      }
    }

    before(async () => {
      await Author.create(authorObj)
    })

    it('should delete author', async () => {
      try {
        const query = { username: 'sajkouser' }
        await Author.findOneAndRemove(query)
        let after = await Author.findOne(query)

        expect(after).to.be.null
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

})
