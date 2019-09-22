//  assertions
import chai from 'chai'
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'
// services
import { initBefore, initAfter } from '../setup'
import { ObjectId } from 'mongodb'
import utils from '../../src/lib/utils'
// fixtures
import fixtures from '../fixtures'
// faker
import storyFaker from '../fixtures/faker/story/story.faker'
// model
import { Story } from '../../src/models/story'
// errors
import { UnprocessableEntity } from '../../src/lib/errors'
// static handlers
import { delaySocialQuery } from '../../src/models/activity/activity.model'
import { createOIDs } from '../../src/lib/utils'


describe('Story statics tests...', async () => {

  describe('findOneActiveById', () => {
    let storyId = ObjectId()
    let IDs = [storyId, ...createOIDs(3)]

    beforeEach(async () => {
      for (let id of IDs) {
        await storyFaker({id})
      }
    })
    afterEach(async () => {
      await initAfter()
    })

    it('should find one active story by id', async () => {
      try {
        let result = await Story.findOneActiveById(storyId)
        expect(result).to.exist
        expect(result._id).to.deep.equals(storyId)
      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('should throw err if not found, and 2nd arg provided', async () => {
      try {
        let randomId = ObjectId()
        let result = await Story.findOneActiveById(randomId, 'throw_err_if_not_found')

      } catch (err) {
        expect(err).to.exist
        expect(err.message).to.equals('Story not found')
        expect(err.errorCode).to.equals(422)
      }
    })

    it('should throw err if not found, and 2nd arg provided', async () => {
      try {
        let randomId = ObjectId()
        let result = await Story.findOneActiveById(randomId)
        expect(result).to.be.null

      } catch (err) {
        expect(err).to.not.exist
      }
    })

  })

  describe('deleteAuthorFromCollaborations', () => {
    let numOfDocs = 3
    let collaborators = createOIDs(numOfDocs)
    let IDs = createOIDs(numOfDocs)
    let args = [
      ...collaborators.map((collaborator, index) => {
        return {
          id: IDs[index],
          collaborators: [{
            edit: true,
            author: collaborator
          }]
        }
      }),
      // add one more the same
      { collaborators: {
         edit: true, author: collaborators[0]
      }}
    ]

    beforeEach(async () => {
      for (let arg of args) {
        await storyFaker(arg)
      }
    })
    afterEach(async () => {
      await initAfter()
    })

    it('should delete collaborator from stories', async () => {
      try {
        let authorId = collaborators[0]
        // before
        let storyBefore = await Story.findAuthorsCollaborations(authorId)
        expect(storyBefore).to.have.lengthOf(2)
        // run
        let result = await Story.deleteAuthorFromCollaborations(authorId)
        expect(result.n).to.equals(2)
        expect(result.nModified).to.equals(2)
        // after
        let storyAfter = await Story.findAuthorsCollaborations(authorId)
        expect(storyAfter).to.have.lengthOf(0)

      } catch (err) {
        expect(err).to.not.exist
      }
    })

  })

  describe('findAuthorCollaborations', () => {
    let authorId = ObjectId()
    let numOfDocs = 3
    let collaborators = createOIDs(numOfDocs)
    let IDs = createOIDs(numOfDocs)
    let args = [
      ...collaborators.map((collaborator, index) => {
        return {
          id: IDs[index],
          collaborators: [{
            edit: true,
            author: collaborator
          }]
        }
      }),
      // add two more (the same)
      { collaborators: {
         edit: true, author: collaborators[0]
      }},
      { collaborators: {
         edit: false, author: collaborators[0]
      }},
      // add one where authorId is story author
      { author: authorId },
      // authorId is collaborator on other story
      { collaborators : {
        edit: true, author: authorId
      }}

    ]

    beforeEach(async () => {
      for (let arg of args) {
        await storyFaker(arg)
      }
    })
    afterEach(async () => {
      await initAfter()
    })

    it('should find collaborator in stories', async () => {
      try {
        let authorId = collaborators[0]
        await Story.find({})
        let result = await Story.findAuthorsCollaborations(authorId)
        result.forEach(story => {
          let collaborators = story.collaborators.map(c => c.author.toString())
          expect(collaborators).to.includes(authorId.toString())
        })
      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('should find collaborator edit: false in stories', async () => {
      try {
        let authorId = collaborators[0]

        let result = await Story.findAuthorsCollaborations(authorId, false)
        result.forEach(story => {
          story.collaborators.forEach(coll => {
            if (coll.author.toString() === collaborators[0].toString()) {
              expect(coll.edit).to.be.false
            }
          })
        })
      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('should find author where collaborator and author', async () => {
      try {
        let result = await Story.findAuthorsCollaborations(authorId, true, true)
        // first story (author)
        expect(result[0]['author']).to.deep.equal(authorId)
        // second story (collaborator)
        let collaborators = result[1]['collaborators'].map(c => c.author.toString())
        expect(collaborators).to.include(authorId.toString())
        expect(result[1])
      } catch (err) {
        expect(err).to.not.exist
      }
    })

  })

  let pageId, story1Args, story2Args
  describe('findStoryByPageId', () => {
    pageId = ObjectId()
    story1Args = {
      id: ObjectId(),
      pages: [pageId]
    }
    story2Args = {
      id: ObjectId(),
    }

    beforeEach(async () => {
      await storyFaker(story1Args)
      await storyFaker(story2Args)
    })
    afterEach(async () => {
      await initAfter()
    })

    it('should find story by page id', async () => {
      try {
        let result = await Story.findStoryByPageId(pageId)
        expect(result).to.exist
        expect(result._id).to.deep.equals(story1Args.id)
      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('should not find story by page id, return null', async () => {
      try {
        let randomId = ObjectId()
        let result = await Story.findStoryByPageId(randomId)
        expect(result).to.be.null
      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('should not find story by page id, throw err', async () => {
      try {
        let randomId = ObjectId()
        let result = await Story.findStoryByPageId(randomId, 'throwErr')
        expect(result).to.not.exist
      } catch (err) {
        const expected = {
          name: 'UnprocessableEntity',
          message: 'Story not found',
          statusCode: 422,
          errorCode: 422
        }
        for (let key in expected) {
          let prop = expected[key]
          expect(err).to.have.property(key).and.equal(prop)
        }
      }
    })

  })

})