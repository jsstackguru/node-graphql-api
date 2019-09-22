//  assertions
import { expect } from 'chai'

// services
import { initBefore, initAfter } from '../setup'
import { ObjectId } from 'mongodb'
import translate from '../../src/lib/translate';

// model
import { Story } from '../../src/models/story'


describe('Story model', () => {

  after(async () => {
    await initAfter()
  })

  describe('Create', () => {

    it('should create new story', async () => {
      try {
        let authorId = ObjectId()
        let member1 = ObjectId()
        let member2 = ObjectId()
        let storyObj = {
          author: authorId,
          title: 'new title',
          title: 'new-title',
          status: 'public',
          collaborators: [
            {
              edit: true, author: member1
            }
          ]
        }

        await Story.create(storyObj)

        let newStory = await Story.findOne({author: authorId})

        expect(newStory).to.be.an('object')
        expect(newStory).to.have.property('created')
        expect(newStory).to.have.property('updated')

        // all props must be the same as in storyObj
        for (let key in storyObj) {
          let prop = storyObj[key]
          expect(JSON.stringify(prop)).to.deep.equal(JSON.stringify(newStory[key]))
        }

      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('should fail story validations required', async () => {
      try {
        let storyObj = {}

        let story = await Story.create(storyObj)
        expect(story).to.not.exist
      } catch (err) {
        let rules = ['stories validation failed', 'Author is required', 'Title is required']
        for (let rule of rules) {
          expect(err.message).to.includes(rule)
        }
      }
    })

    it('should fail collaborators and pages cast validation', async () => {
      try {

        let authorId = ObjectId()
        let member1 = ObjectId()
        let member2 = ObjectId()
        let storyObj = {
          author: authorId,
          title: 'new title',
          title: 'new-title',
          status: 'public',
          collaborators: [{
            edit: true,
            author: '1234'
          }],
          pages: ['1234']
        }

        let story = await Story.create(storyObj)
        expect(story).to.not.exist

      } catch (err) {
        let rules = ['stories validation failed', 'Cast to ObjectID failed', 'Cast to Array failed']
        for (let rule of rules) {
          expect(err.message).to.includes(rule)
        }
      }
    })

  })

  describe('Update', () => {

    let authorId = ObjectId()
    let member1 = ObjectId()
    let page1 = ObjectId()
    let storyObj = {
      author: authorId,
      title: 'new title',
      title: 'new-title',
      status: 'public',
      collaborators: [{
        edit: true,
        author: member1
      }],
      pages: [ page1 ]
    }

    before( async () => {
      await Story.create(storyObj)
    })

    it('should update story', async () => {
      try {
        const query = { author: authorId }
        const update = { title: 'updated title', status: 'updated status' }
        const options = { new: true }

        let updatedStory = await Story.findOneAndUpdate(query, update, options)

        expect(updatedStory).to.exist.and.be.an('object')
        for (let key in storyObj) {
          // check if props exist
          expect(updatedStory[key]).to.exist
          // check if props updated
          if (update[key]) {
            expect(updatedStory[key]).to.equals(update[key])
          }
        }
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('Delete', () => {

    let authorId = ObjectId()
    let member1 = ObjectId()
    let page1 = ObjectId()

    let storyObj = {
      author: authorId,
      title: 'new title',
      title: 'new-title',
      status: 'public',
      collaborators: [{
        edit: true,
        author: member1
      }],
      pages: [page1]
    }

    before(async () => {
      await Story.create(storyObj)
    })

    it('should delete story', async () => {
      try {
        const query = { author: authorId }
        await Story.findOneAndRemove(query)
        let after = await Story.findOne(query)

        expect(after).to.be.null
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

})
