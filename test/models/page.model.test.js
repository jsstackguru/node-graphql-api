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
import { Page } from '../../src/models/page'


describe('Page model', () => {

  after(async () => {
    await initAfter()
  })

  describe('Create', () => {

    it('should create new page', async () => {
      try {
        let authorId = ObjectId()
        let now = new Date()
        let pageObj = {
          author: authorId,
          title: 'page title',
          slug: 'page-title',
          dateTo: now
        }

        await Page.create(pageObj)

        let newPage = await Page.findOne({author: authorId})

        expect(newPage).to.be.an('object')
        expect(newPage).to.have.property('created')
        expect(newPage).to.have.property('updated')

        // all props must be the same as in pageObj
        for (let key in pageObj) {
          let prop = pageObj[key]
          expect(JSON.stringify(prop)).to.deep.equal(JSON.stringify(newPage[key]))
        }

      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('should fail page validations required', async () => {
      try {
        let pageObj = {}

        let page = await Page.create(pageObj)
        expect(page).to.not.exist
      } catch (err) {
        let rules = ['pages validation failed', 'Author is required']
        for (let rule of rules) {
          expect(err.message).to.includes(rule)
        }
      }
    })

    it('should fail author and original cast validation', async () => {
      try {

        let authorId = ObjectId()
        let now = new Date()
        let pageObj = {
          author: 'fakeid1',
          original: 'fakeid2',
          title: 'page title',
          slug: 'page-title',
          dateTo: now

        }

        let page = await Page.create(pageObj)
        expect(page).to.not.exist

      } catch (err) {
        let rules = ['pages validation failed', 'Cast to ObjectID failed']
        for (let rule of rules) {
          expect(err.message).to.includes(rule)
        }
      }
    })

  })

  describe('Update', () => {

    let authorId = ObjectId()
    let now = new Date()
    let pageObj = {
      author: authorId,
      title: 'page title',
      slug: 'page-title',
      dateTo: now
    }

    before( async () => {
      await Page.create(pageObj)
    })

    it('should update page', async () => {
      try {
        const query = { author: authorId }
        const update = { title: 'updated title', status: 'active' }
        const options = { new: true }

        let updatedPage = await Page.findOneAndUpdate(query, update, options)

        expect(updatedPage).to.exist.and.be.an('object')
        for (let key in pageObj) {
          // check if props exist
          expect(updatedPage[key]).to.exist
          // check if props updated
          if (update[key]) {
            expect(updatedPage[key]).to.equals(update[key])
          }
        }
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('Delete', () => {

    let authorId = ObjectId()
    let now = new Date()
    let pageObj = {
      author: authorId,
      title: 'page title',
      slug: 'page-title',
      dateTo: now
    }

    before(async () => {
      await Page.create(pageObj)
    })

    it('should delete page', async () => {
      try {
        const query = { author: authorId }
        await Page.findOneAndRemove(query)
        let after = await Page.findOne(query)

        expect(after).to.be.null
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

})