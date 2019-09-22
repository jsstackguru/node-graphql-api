//  assertions
import { expect } from 'chai'

// services
import { initAfter } from '../setup'
import { ObjectId } from 'mongodb'

// model
import { StorySpam } from '../../src/models/story-spam'

describe('Story spam models', () => {

  after(async () => {
    await initAfter()
  })

  describe('Create', () => {

    it('should create new page spam', async () => {
      try {

        const author = ObjectId()
        const storyId = ObjectId()
        let spamObj = {
          author,
          storyId: storyId,
          ipAddress: '1:2:3',
          message: 'some message',
        }

        await StorySpam.create(spamObj)

        let newSpam = await StorySpam.findOne({author})

        expect(newSpam).to.be.an('object')
        expect(newSpam).to.have.property('created')
        expect(newSpam).to.have.property('updated')

        // all props must be the same as in spamObj
        for (let key in spamObj) {
          let prop = spamObj[key]
          expect(prop).to.deep.equal(newSpam[key])
        }

      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('should fail device props validations required', async () => {
      try {
        let spamObj = {}

        let spam = await StorySpam.create(spamObj)

        expect(spam).to.not.exist
      } catch (err) {
        let errors = [
          'story_spam validation failed',
          'Message is required',
          'IP address is required',
          'Story ID is required',
          'Author ID is required'
        ]

        for (let error of errors) {
          expect(err.message).to.include(error)
        }
      }
    })

    it('should fail device props validation for cast to OID ', async () => {
      let spamObj
      try {
        spamObj = {
          author: 'fakeID1',
          storyId: 'fakeID2',
          ipAddress: '1:3:4',
          message: 'mess',
        }

        let spam = await StorySpam.create(spamObj)
        expect(spam).to.not.exist

      } catch (err) {
        let errors = [
          'story_spam validation failed',
          `Cast to ObjectID failed for value "${spamObj.author}"`,
          `Cast to ObjectID failed for value "${spamObj.storyId}"`
        ]

        for (let error of errors) {
          expect(err.message).to.include(error)
        }
      }
    })

  })

  describe('Update', () => {

    const author = ObjectId()
    const storyId = ObjectId()
    let spamObj = {
      author,
      storyId: storyId,
      ipAddress: '1:@:3',
      message: 'mess'
    }

    before( async () => {
      await StorySpam.create(spamObj)
    })

    it('should update device', async () => {
      try {
        const query = { author }
        const update = {
          ipAddress: '2:@:2',
          message: 'updated message',
        }
        const options = { new: true }
        let updatedSpam = await StorySpam.findOneAndUpdate(query, update, options)

        expect(updatedSpam).to.exist.and.be.an('object')

        for (let key in spamObj) {
          // check if props exist
          expect(updatedSpam[key]).to.exist
          // check if props updated
          if (update[key]) {
            expect(updatedSpam[key]).to.equals(update[key])
          }
        }
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('Delete', () => {

    const author = ObjectId()
    const storyId = ObjectId()
    let spamObj = {
      author,
      storyId: storyId,
      ipAddress: '1:@:3',
      message: 'mess'
    }

    before(async () => {
      await StorySpam.create(spamObj)
    })

    it('should delete invite', async () => {
      try {
        const query = { author }
        await StorySpam.findOneAndRemove(query)
        let after = await StorySpam.findOne(query)

        expect(after).to.be.null
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

})

