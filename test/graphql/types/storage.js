// assertions
import chai from 'chai'
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'
import chaiArrays from 'chai-arrays'
chai.use(chaiArrays)
// GQL Types
import {
  StorageType,
  StorageTypeAuthor,
  StorageTypeMembers,
  FormatBytesType
} from '../../../src/GQLSchema/GQLTypes/StorageType'

// GQL objects types
import {
  GraphQLString,
  GraphQLInt
} from 'graphql'
import { initAfter, initBefore } from '../../setup'

describe('Storage types', () => {
  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('StorageType', () => {
    it('should have author field of type StorageTypeAuthor', () => {
      expect(StorageType.getFields()).to.have.property('author')
      expect(StorageType.getFields().author.type).to.deep.equals(StorageTypeAuthor)
    })
    it('should have members field of type StorageTypeMembers', () => {
      expect(StorageType.getFields()).to.have.property('members')
      expect(StorageType.getFields().members.type).to.deep.equals(StorageTypeMembers)
    })
  })

  describe('StorageTypeAuthor', () => {
    it('should have total field of type FormatBytesType', () => {
      expect(StorageTypeAuthor.getFields()).to.have.property('total')
      expect(StorageTypeAuthor.getFields().total.type).to.deep.equals(FormatBytesType)
    })
    it('should have used field of type FormatBytesType', () => {
      expect(StorageTypeAuthor.getFields()).to.have.property('used')
      expect(StorageTypeAuthor.getFields().used.type).to.deep.equals(FormatBytesType)
    })
    it('should have left field of type FormatBytesType', () => {
      expect(StorageTypeAuthor.getFields()).to.have.property('left')
      expect(StorageTypeAuthor.getFields().left.type).to.deep.equals(FormatBytesType)
    })
  })

  describe('StorageTypeMembers', () => {
    it('should have you field of type FormatBytesType', () => {
      expect(StorageTypeMembers.getFields()).to.have.property('you')
      expect(StorageTypeMembers.getFields().you.type).to.deep.equals(FormatBytesType)
    })
    it('should have others field of type FormatBytesType', () => {
      expect(StorageTypeMembers.getFields()).to.have.property('others')
      expect(StorageTypeMembers.getFields().others.type).to.deep.equals(FormatBytesType)
    })
    it('should have left field of type FormatBytesType', () => {
      expect(StorageTypeMembers.getFields()).to.have.property('left')
      expect(StorageTypeMembers.getFields().left.type).to.deep.equals(FormatBytesType)
    })
    it('should have total field of type FormatBytesType', () => {
      expect(StorageTypeMembers.getFields()).to.have.property('total')
      expect(StorageTypeMembers.getFields().total.type).to.deep.equals(FormatBytesType)
    })
  })

  describe('FormatBytesType', () => {
    it('should have bytes field of type Int', () => {
      expect(FormatBytesType.getFields()).to.have.property('bytes')
      expect(FormatBytesType.getFields().bytes.type).to.deep.equals(GraphQLInt)
    })
    it('should have format field of type String', () => {
      expect(FormatBytesType.getFields()).to.have.property('format')
      expect(FormatBytesType.getFields().format.type).to.deep.equals(GraphQLString)
    })
  })

})
