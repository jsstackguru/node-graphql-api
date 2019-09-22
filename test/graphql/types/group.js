// assertions
import chai from 'chai'
import { assert } from 'chai'
import { expect } from 'chai'
import chaiArrays from 'chai-arrays'

// GQL Types
import { AuthorType } from '../../../src/GQLSchema/GQLTypes/authorType'
import {
  GroupType,
  GroupAccountType,
  GroupInvitationType,
  GroupInvitedType
} from '../../../src/GQLSchema/GQLTypes/groupType'

// GQL objects types
import {
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLInt
} from 'graphql'

// fixtures
import fixtures from '../../fixtures'

// hooks
import { initAfter, initBefore } from '../../setup'

chai.use(chaiArrays)

const authors = fixtures.collections.authors

describe('Group types', () => {
  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('GroupType', () => {
    it('should have id field of type ID', () => {
      expect(GroupType.getFields()).to.have.property('id')
      expect(GroupType.getFields().id.type).to.deep.equals(GraphQLID)
    })
    it('should have active field of type String', () => {
      expect(GroupType.getFields()).to.have.property('active')
      expect(GroupType.getFields().active.type).to.deep.equals(GraphQLString)
    })
    it('should have created field of type String', () => {
      expect(GroupType.getFields()).to.have.property('created')
      expect(GroupType.getFields().created.type).to.deep.equals(GraphQLString)
    })
    it('should have updated field of type String', () => {
      expect(GroupType.getFields()).to.have.property('updated')
      expect(GroupType.getFields().updated.type).to.deep.equals(GraphQLString)
    })
    it('should have owner field of type Author', () => {
      expect(GroupType.getFields()).to.have.property('owner')
      expect(GroupType.getFields().owner.type).to.deep.equals(AuthorType)
    })
    describe('owner resolver', () => {
      const ownerResolve = GroupType.getFields().owner.resolve

      it('should return group owner', async () => {
        try {
          let group = {
            owner: authors[0]['id']
          }

          let res = await ownerResolve(group)

          expect(res).to.have.property('_id')
          assert.equal(res._id.toString() === group.owner, true)
          expect(res).to.have.property('name')
          expect(res).to.have.property('bio')
          expect(res).to.have.property('username')
        } catch (err) {
          expect(err).to.not.exist
        }
      })
    })
    it('should have members field of type Author[]', () => {
      expect(GroupType.getFields()).to.have.property('members')
      expect(GroupType.getFields().members.type).to.deep.equals(new GraphQLList(AuthorType))
    })
    describe('members resolver', () => {
      const membersResolve = GroupType.getFields().members.resolve

      it('should return group members', async () => {
        try {
          let group = {
            members: [authors[0]['id'], authors[2]['id'], authors['4']['id']]
          }

          let res = await membersResolve(group)

          expect(res).to.exist.and.be.an('array')
          expect(res).to.have.lengthOf(3)
          res.forEach(item => {
            expect(item).to.have.property('_id')
            expect(item).to.have.property('name')
            expect(item).to.have.property('bio')
            expect(item).to.have.property('username')
          })
        } catch (err) {
          expect(err).to.not.exist
        }


      })
    })
  })

  describe('GroupAccountType', () => {
    it('should have id field of type String', () => {
      expect(GroupAccountType.getFields()).to.have.property('id')
      expect(GroupAccountType.getFields().id.type).to.deep.equals(GraphQLID)
    })
    it('should have members field of type Author[]', () => {
      expect(GroupAccountType.getFields()).to.have.property('members')
      expect(GroupAccountType.getFields().members.type).to.deep.equals(new GraphQLList(AuthorType))
    })

    describe('members resolver', () => {
      const membersResolve = GroupAccountType.getFields().members.resolve
      it('should return group members', async () => {
        try {
          let group = {
            members: [authors[0]['id'], authors[2]['id'], authors['4']['id']]
          }

          let res = await membersResolve(group)

          expect(res).to.exist.and.be.an('array')
          expect(res).to.have.lengthOf(3)
          res.forEach(item => {
            expect(item).to.have.property('_id')
            expect(item).to.have.property('name')
            expect(item).to.have.property('bio')
            expect(item).to.have.property('username')
          })
        } catch (err) {
          expect(err).to.not.exist
        }
      })
    })

    it('should have isOwner field of type String', () => {
      expect(GroupAccountType.getFields()).to.have.property('isOwner')
      expect(GroupAccountType.getFields().isOwner.type).to.deep.equals(GraphQLString)
    })
    it('should have pending field of type GroupInvitedType[]', () => {
      expect(GroupAccountType.getFields()).to.have.property('pending')
      expect(GroupAccountType.getFields().pending.type).to.deep.equals(new GraphQLList(GroupInvitedType))
    })
    it('should have active field of type String', () => {
      expect(GroupAccountType.getFields()).to.have.property('active')
      expect(GroupAccountType.getFields().active.type).to.deep.equals(GraphQLString)
    })
    it('should have created field of type String', () => {
      expect(GroupAccountType.getFields()).to.have.property('created')
      expect(GroupAccountType.getFields().created.type).to.deep.equals(GraphQLString)
    })
    it('should have updated field of type String', () => {
      expect(GroupAccountType.getFields()).to.have.property('updated')
      expect(GroupAccountType.getFields().updated.type).to.deep.equals(GraphQLString)
    })
  })

  describe('GroupInvitationType', () => {
    it('should have id field of type ID', () => {
      expect(GroupInvitationType.getFields()).to.have.property('id')
      expect(GroupInvitationType.getFields().id.type).to.deep.equals(GraphQLID)
    })
    it('should have author field of type Author', () => {
      expect(GroupInvitationType.getFields()).to.have.property('author')
      expect(GroupInvitationType.getFields().author.type).to.deep.equals(AuthorType)
    })
    it('should have invited field of type GroupInvited[]', () => {
      expect(GroupInvitationType.getFields()).to.have.property('invited')
      expect(GroupInvitationType.getFields().invited.type).to.deep.equals(GroupInvitedType)
    })
    it('should have token field of type String', () => {
      expect(GroupInvitationType.getFields()).to.have.property('token')
      expect(GroupInvitationType.getFields().token.type).to.deep.equals(GraphQLString)
    })
    it('should have active field of type String', () => {
      expect(GroupInvitationType.getFields()).to.have.property('active')
      expect(GroupInvitationType.getFields().active.type).to.deep.equals(GraphQLString)
    })
    it('should have accepted field of type String', () => {
      expect(GroupInvitationType.getFields()).to.have.property('accepted')
      expect(GroupInvitationType.getFields().accepted.type).to.deep.equals(GraphQLString)
    })
    it('should have created field of type String', () => {
      expect(GroupInvitationType.getFields()).to.have.property('created')
      expect(GroupInvitationType.getFields().created.type).to.deep.equals(GraphQLString)
    })
    it('should have updated field of type String', () => {
      expect(GroupInvitationType.getFields()).to.have.property('updated')
      expect(GroupInvitationType.getFields().updated.type).to.deep.equals(GraphQLString)
    })
    describe('author resolver', () => {
      const authorResolve = GroupInvitationType.getFields().author.resolve

      it('should return author', async () => {
        try {
          let invitation = {
            author: authors[0]['id']
          }

          let res = await authorResolve(invitation)

          expect(res).to.have.property('_id')
          assert.equal(res._id.toString() === invitation.author, true)
          expect(res).to.have.property('name')
          expect(res).to.have.property('bio')
          expect(res).to.have.property('username')
        } catch (err) {
          expect(err).to.not.exist
        }
      })
    })
  })

  describe('GroupInvitedType', () => {
    it('should have author field of type String', () => {
      expect(GroupInvitedType.getFields()).to.have.property('author')
      expect(GroupInvitedType.getFields().author.type).to.deep.equals(AuthorType)
    })
    it('should have email field of type String', () => {
      expect(GroupInvitedType.getFields()).to.have.property('email')
      expect(GroupInvitedType.getFields().email.type).to.deep.equals(GraphQLString)
    })
    describe('author resolver', () => {
      const authorResolve = GroupInvitedType.getFields().author.resolve

      it('should return author', async () => {
        try {
          let invited = {
            author: authors[0]['id']
          }

          let res = await authorResolve(invited)

          expect(res).to.have.property('_id')
          assert.equal(res._id.toString() === invited.author, true)
          expect(res).to.have.property('name')
          expect(res).to.have.property('bio')
          expect(res).to.have.property('username')
        } catch (err) {
          expect(err).to.not.exist
        }
      })
    })
  })

})
