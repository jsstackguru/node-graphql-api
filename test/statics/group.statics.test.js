//  assertions
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'

// services
import { initBefore, initAfter } from '../setup'
import { ObjectId } from 'mongodb'

// fixtures
import fixtures from '../fixtures'

// model
import { Group } from '../../src/models/group'

const authors = fixtures.collections.authors
const groups = fixtures.collections.group


describe('Group statics tests...', async () => {

  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('Group for author', () => {

    it('should not find group for author', async () => {
      try {
        const author = authors[7]

        const groupSharing = await Group.findForAuthor(author.id)

        assert.strictEqual(groupSharing, null)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should not find group for author, throw err', async () => {
      try {
        const author = authors[7]

        const groupSharing = await Group.findForAuthor(author.id, 'throw_err')

        expect(groupSharing).to.not.exist

      } catch (err) {
        expect(err).to.exist
        expect(err.name).to.equals('UnprocessableEntity')
        expect(err.message).to.equals('There is no group with specified author')
        expect(err.statusCode).to.equals(422)
        expect(err.errorCode).to.equals(422)

      }
    })

    it('should find group for author', async () => {
      try {
        const owner = authors.find(a => a.id == '5a538361ea64260e00eb7547')
        const author = authors.find(a => a.id == '5a538361ea64260e00eb7548')

        const groupSharing = await Group.findForAuthor(author.id)

        assert.notStrictEqual(groupSharing, null)
        should(groupSharing).be.type('object')
        assert.equal(groupSharing.owner, owner.id)
        assert.strictEqual(groupSharing.active, true)
        const authorMember = groupSharing.members.find(m => m == author.id)
        should.exist(authorMember)

      } catch (err) {
        should.not.exist(err)
      }
    })

  })

  // describe.skip('Find group by members email', () => { //TODO: obrisati!!!

  //   it('should not find group by email', async () => {
  //     try {
  //       const email = 'group111@istoryapp.com'

  //       const groupSharing = await Group.findForEmail(email)

  //       assert.strictEqual(groupSharing, null)

  //     } catch (err) {
  //       should.not.exist(err)
  //     }
  //   })

  //   it('should find group by email', async () => {
  //     try {
  //       const email = 'group19@istoryapp.com'

  //       const groupSharing = await Group.findForEmail(email)

  //       should(groupSharing).be.type('object')
  //       assert.strictEqual(groupSharing.active, true)
  //       const emailMember = groupSharing.members.find(m => m.email === email)
  //       should.exist(emailMember)

  //     } catch (err) {
  //       should.not.exist(err)
  //     }
  //   })

  // })

  describe('Find group by id', () => {

    it('should not find group by id', async () => {
      try {

        const fakeGroupId = authors[0]['_id'] // fake OID

        const group = await Group.findOneActiveById(fakeGroupId)

        assert.strictEqual(group, null)

      } catch (err) {
        should.not.exist(err)
      }
    })

    it('should find group by id', async () => {
      try {
        const groupId = groups[0]['_id']

        const group = await Group.findOneActiveById(groupId)

        expect(group).to.be.an('object')
        expect(group).to.have.property('_id').and.deep.equals(ObjectId(groupId))
        expect(group).to.has.property('members')
        expect(group).to.has.property('active')

      } catch (err) {
        expect(err).to.not.exist
      }
    })

  })
})
