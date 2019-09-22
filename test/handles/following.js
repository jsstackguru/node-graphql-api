/**
 * @file Tests for following handles
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

const should = require('should')
const assert = require('chai').assert
// services
import { initBefore, initAfter } from '../setup'
// handles
import followingHndl from '../../src/handles/following.handles'

describe('Following handles tests...', () => {

  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  // before((done) => {
  //   require('../setup').initBefore(() => {
  //     followingHndl = require('../../src/handles/following.handles')
  //     done()
  //   })
  // })

  // after((done) => {
  //   require('../setup').initAfter(done)
  // })

  describe('follow', () => {

    it('should not follow the author, already following', async () => {
      try {
        let author = '58eb78b94b432a21008c2346'
        let follows = '58eb78b94b432a21008c2347'

        await followingHndl.follow(author, follows)
      } catch (err) {
        err.should.exist
        assert.equal(err.message, 'User is following this author already')
        assert.equal(err.statusCode, 422)
      }
    })

    it('should not follow the author, author not found', async () => {
      try {
        let author = '58eb78b94b432a21008c2346'
        let follows = '58eb78b94b432a21008c2388'

        await followingHndl.follow(author, follows)
      } catch (err) {
        err.should.exist
        assert.equal(err.message, 'Author not found')
        assert.equal(err.statusCode, 422)
      }
    })

    it('should follow the author', async () => {
      try {
        let author = '58eb78b94b432a21008c2346'
        let follows = '58eb78b94b432a21008c2348'

        let result = await followingHndl.follow(author, follows)

        should(result).be.type('object')
        result.should.have.property('id')
        result.should.have.property('username')
        result.should.have.property('name')
        result.should.have.property('avatar')
        assert.equal(result.id, follows)
      } catch (err) {
        err.should.not.exist
      }
    })

  })

  describe('unfollow', () => {

    it('should not unfollow the author, author not found', async () => {
      try {
        let author = '58eb78b94b432a21008c2346'
        let follows = '58eb78b94b432a21008c2349'

        await followingHndl.unfollow(author, follows)
      } catch (err) {
        err.should.exist
        assert.equal(err.message, 'Author is not found')
        assert.equal(err.statusCode, 422)
      }
    })

    it('should not unfollow the author, user did not following author', async () => {
      try {
        let author = '58eb78b94b432a21008c2346'
        let follows = '5a538361ea64260e00eb7546'

        await followingHndl.unfollow(author, follows)
      } catch (err) {
        err.should.exist
        assert.equal(err.message, 'User don\'t follow this author')
        assert.equal(err.statusCode, 422)
      }
    })

    it('should unfollow the author', async () => {
      try {
        let author = '58eb78b94b432a21008c2346'
        let follows = '58eb78b94b432a21008c2347'

        let result = await followingHndl.unfollow(author, follows)

        should(result).be.type('object')
        result.should.have.property('id')
        result.should.have.property('username')
        result.should.have.property('name')
        result.should.have.property('avatar')
        assert.equal(result.id, follows)
      } catch (err) {
        err.should.not.exist
      }
    })

  })

})
