//  assertions
import { expect } from 'chai'
// services
import { initAfter } from '../setup'
import { ObjectId } from 'mongodb'
// model
import { Favorite } from '../../src/models/favorite'

describe('favorite models', () => {

  after(async () => {
    await initAfter()
  })

  describe('Create', () => {

    it('should create new favorite', async () => {
      try {

        const authorId = ObjectId()
        const storyId = ObjectId()
        let favoriteObj = {
          author: authorId,
          story: storyId
        }

        await Favorite.create(favoriteObj)

        let newFavorite = await Favorite.findOne({author: authorId, story: storyId})
        expect(newFavorite).to.be.an('object')
        expect(newFavorite).to.have.property('created')
        expect(newFavorite).to.have.property('updated')

        // all props must be the same as in comObj
        for (let key in favoriteObj) {
          let prop = favoriteObj[key]
          expect(prop).to.deep.equal(newFavorite[key])
        }

      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('should fail favorite props validations', async () => {
      let favoriteObj
      try {
        favoriteObj = {
          author: '',
          story: ''
        }

        let favorite = await Favorite.create(favoriteObj)
        expect(favorite).to.not.exist
      } catch (err) {
        let errors = [
          'favorites validation failed',
          'Cast to ObjectID failed for value',
          'Cast to ObjectID failed for value "" at path "author"',
          'Cast to ObjectID failed for value "" at path "story"'
        ]

        for (let error of errors) {
          expect(err.message).to.includes(error)
        }
      }
    })

  })

  describe('Update', () => {

    const authorId = ObjectId()
    const storyId = ObjectId()
    let favoriteObj = {
      author: authorId,
      story: storyId
    }

    before( async () => {
      await Favorite.create(favoriteObj)
    })

    it('should update favorite', async () => {
      try {
        const query = { author: authorId, story: storyId}
        const update = {
          story: ObjectId()
        }
        const options = { new: true }
        let updatedFavorite = await Favorite.findOneAndUpdate(query, update, options)

        expect(updatedFavorite).to.exist.and.be.an('object')

        for (let key in favoriteObj) {
          // check if props exist
          expect(updatedFavorite[key]).to.exist
          // check if props updated
          if (update[key]) {
            expect(String(updatedFavorite[key])).to.equals(String(update[key]))
          }
        }
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('Delete', () => {

    const authorId = ObjectId()
    const storyId = ObjectId()
    let favoriteObj = {
      author: authorId,
      story: storyId
    }

    before(async () => {
      await Favorite.create(favoriteObj)
    })

    it('should delete favorite', async () => {
      try {
        const query = { author: authorId, story: storyId }
        await Favorite.findOneAndRemove(query)
        let after = await Favorite.findOne(query)

        expect(after).to.be.null
      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

})

