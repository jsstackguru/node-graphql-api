// assertions
import chai from 'chai'
import chaiHttp from 'chai-http'
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'

import { GQLPaginateType, paginateOptions, sortConverter, filterContent, splitSortParams  } from '../../src/GQLSchema/GQLHandles'
import { StoryType } from '../../src/GQLSchema/GQLTypes/storyType'

describe('Testing GQL handles', () => {

  describe('GQLPaginateType()', ()=> {
    it('should return GQL Object type with dynamic name and type withing docs property', () => {
      let response = GQLPaginateType('test', StoryType).getFields()
      expect(response).to.have.all.keys('docs', 'total', 'limit', 'pages', 'pages')
    })
  })

  describe('PaginateOptions()', () => {
    it('should return options for mongoose pagination', () => {
      let response = paginateOptions(1, 2, 'sort')
      expect(response).to.have.all.keys('page', 'limit', 'sort', 'select', 'lean')
    })
  })

  describe('sortConverter()', () => {
    it('should split given string at ":" and make key value pair', () => {
      let response = sortConverter('author:ascending')
      expect(response).to.be.an('object')
      assert.equal(response['author'], 'ascending')
    })
  })

  describe('filterContent()', () => {
    it('should return proper array of values based on input', () => {
      let response = filterContent(["audios", "images", "videos"])
      let expected = ['audio', 'recording', 'video', 'gif', 'image', 'gallery']
      expect(response).to.deep.equal(expected)

      let response2 = filterContent(["audios", "videos", "fake"])
      let expected2 = ['audio', 'recording', 'video', 'gif']
      expect(response2).to.deep.equal(expected2)
    })
    it('should return empty array if no input data', () => {
      let response = filterContent([])
      expect(response).to.have.lengthOf(0)

    })
  })

  describe('splitSortParams()', () => {
    it('should return undefined if sort params is falsy', () => {
      let sort = ""
      let response = splitSortParams(sort)
      expect(response).to.be.an('object')
      expect(response.order).to.be.undefined
      expect(response.prop).to.be.undefined
      expect(response.subProp).to.be.undefined
    })
    it('should return prop, subprop, order', () => {
      let sort = "author.username:desc"
      let response = splitSortParams(sort)
      expect(response).be.an('object')
      expect(response.order).to.equal('desc')
      expect(response.prop).to.equal('author')
      expect(response.subProp).to.equal('username')
    })
    it('should return only prop, order and subProp undefined', () => {
      let sort = "author:desc"
      let response = splitSortParams(sort)
      expect(response).be.an('object')
      expect(response.order).to.equal('desc')
      expect(response.prop).to.equal('author')
      expect(response.subProp).to.be.undefined
    })
  })
})
