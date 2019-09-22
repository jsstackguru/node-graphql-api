/**
 * @file Author API tests
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

//  assert
import chai from 'chai'
import { assert, expect } from 'chai'
import should from 'should'
import chaiArrays from 'chai-arrays'
chai.use(chaiArrays)

// utils
import utils from '../../src/lib/utils'

// functions
import { repackGQLresponse } from '../../src/routes/graph-rest.gateway'

// faker
import { gallerySectionsMaker } from '../fixtures/faker/page/page.faker'

// fixtures
import sample from '../fixtures/sorting-fixture.json'
import sample2 from '../fixtures/sorting2-fixture.json'
import { initAfter, initBefore } from '../setup'

// fakers
import storyFaker from '../fixtures/faker/story'

// constants
import {
  USERNAME_MAX,
  USERNAME_MIN,
  PASSWORD_MAX,
  PASSWORD_MIN
} from '../../src/constants/app'


describe('should test Utility functions', () => {
  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('isObjEmpty', () => {
    it('should return false if object false', () => {
      let result = utils.isObjEmpty({})
      assert.equal(result, true)
    })

    it('should return true if object true', () => {
      let result = utils.isObjEmpty({a: 1})
      assert.equal(result, false)
    })

    it('should return null if not object', () => {
      let result = utils.isObjEmpty('')
      assert.equal(result, true)
      result = utils.isObjEmpty([])
      assert.equal(result, true)
      result = utils.isObjEmpty(null)
      assert.equal(result, true)
      result = utils.isObjEmpty(undefined)
      assert.equal(result, true)
    })
  })

  describe('isValidDateObj', () => {
    it('should return false if string', () => {
      let date = '12-23-2012'
      let result = utils.isValidDateObj(date)
      expect(result).to.be.false
    })
    it('should return false if obj', () => {
      let date = {}
      let result = utils.isValidDateObj(date)
      expect(result).to.be.false
    })
    it('should return false if falsy', () => {
      let date = undefined
      let result = utils.isValidDateObj(date)
      expect(result).to.be.false

      date = null
      result = utils.isValidDateObj(date)
      expect(result).to.be.false
    })
    it('should return true if Date obj', () => {
      let date = new Date()
      let result = utils.isValidDateObj(date)
      expect(result).to.be.true
    })
  })

  describe('evaluatePropToUpperCaseOrDate', () => {
    it('should return upperCase string if prop is not date', () => {
      let obj = {
        a: 'abc'
      }
      let result = utils.evaluatePropToUpperCaseOrDate(obj, 'a')
      expect(result).to.be.string
      let before = result
      let after = result.toUpperCase()
      expect(before).to.equals(after)
    })
    it('should return number (parsed date) if prop is date obj', () => {
      let obj = {
        a: new Date()
      }
      let result = utils.evaluatePropToUpperCaseOrDate(obj, 'a')
      assert.equal(typeof result, 'number')
    })
  })

  describe('paginate', () => {
    let arr = ["A", "B", "C", "D", "E"]
    it('should return proper values', () => {
      let result = utils.paginate(arr, 1, 1)
      expect(result['docs']).to.be.containingAllOf(["A"])

      result = utils.paginate(arr, 1, 3)
      expect(result['docs']).to.be.containingAllOf(["A", "B", "C"])

      result = utils.paginate(arr, 2, 1)
      expect(result['docs']).to.be.containingAllOf(["B"])

      result = utils.paginate(arr, 2, 4)
      expect(result['docs']).to.be.containingAllOf(["E"])

      result = utils.paginate(arr, 0, 0)
      expect(result['docs']).to.be.containingAllOf(["A", "B", "C", "D"])
    })
    it('should sort ascending properly with prop', () => {
      //name prop
      let result = utils.paginate(sample, 1, 5, undefined, 'name')

      for (let i = 0; i < 4; i++) {
        assert.equal(result['docs'][i]['name'].toUpperCase() < result['docs'][i+1]['name'].toUpperCase(), true)
      }
      // created prop
      result = utils.paginate(sample, 1, 5, null, 'created')
      for (let i = 0; i < 4; i++) {
        assert.equal(result['docs'][0]['created'].toUpperCase() < result['docs'][1]['created'].toUpperCase(), true)
      }
    })
    it('should sort descending properly with prop', () => {
      //name prop
      let result = utils.paginate(sample, 1, 5, 'desc', 'name')
      for (let i = 0; i < 4; i++) {
        assert.equal(result['docs'][i]['name'].toUpperCase() > result['docs'][i+1]['name'].toUpperCase(), true)
      }
      // created prop
      result = utils.paginate(sample, 1, 5, 'descending', 'created')
      for (let i = 0; i < 4; i++) {
        assert.equal(result['docs'][0]['created'].toUpperCase() > result['docs'][1]['created'].toUpperCase(), true)
      }
    })
    it('should sort ascending properly with subProp', () => {
      //name sub prop
      let result = utils.paginate(sample2, 1, 5, 'ascending', 'author', 'name')
      for (let i = 0; i < 4; i++) {
        assert.equal(result['docs'][i]['author']['name'].toUpperCase() < result['docs'][i+1]['author']['name'].toUpperCase(), true)
      }
      // created sub prop
      result = utils.paginate(sample2, 1, 5, '1', 'author', 'created')
      for (let i = 0; i < 4; i++) {
        assert.equal(result['docs'][i]['author']['created'].toUpperCase() < result['docs'][i+1]['author']['created'].toUpperCase(), true)
      }
    })
    it('should sort descending properly with subProp', () => {
      //name sub prop
      let result = utils.paginate(sample2, 1, 5, 'descending', 'author', 'name')
      for (let i = 0; i < 4; i++) {
        assert.equal(result['docs'][i]['author']['name'].toUpperCase() > result['docs'][i+1]['author']['name'].toUpperCase(), true)
      }
      // created sub prop
      result = utils.paginate(sample2, 1, 5, '-1', 'author', 'created')
      for (let i = 0; i < 4; i++) {
        assert.equal(result['docs'][i]['author']['created'].toUpperCase() > result['docs'][i+1]['author']['created'].toUpperCase(), true)
      }
    })
    it('should properly sort descending with date object prop', () => {
      let arr = [
        { created: new Date(2018, 4, 5) },
        { created: new Date(2017, 3, 11) },
        { created: new Date(2017, 5, 11) },
        { created: new Date(2017, 5, 10) },
        { created: new Date(2016, 2, 8) },
      ]
      let result = utils.paginate(arr, 1, 5, 'desc', 'created')
      for (let i = 0; i < arr.length - 1; i++) {
        assert.equal(result['docs'][i]['created'] > result['docs'][i+1]['created'], true)
      }
    })
    it('should properly sort ascending with date object prop', () => {
      let arr = [
        { created: new Date(2018, 4, 5) },
        { created: new Date(2017, 3, 11) },
        { created: new Date(2017, 5, 11) },
        { created: new Date(2017, 5, 10) },
        { created: new Date(2016, 2, 8) },
      ]
      let result = utils.paginate(arr, 1, 5, '1', 'created')
      for (let i = 0; i < arr.length - 1; i++) {
        assert.equal(result['docs'][i]['created'] < result['docs'][i+1]['created'], true)
      }
    })
  })

  describe('generate token', () => {

    it('should generate token', () => {
      try {
        const token = utils.generateToken()

        should(token).be.type('string')
        assert.strictEqual(token.length, 100)

      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('paramBoolean', () => {
    it('should convert values to boolean', () => {

      let arr = [
         utils.paramBoolean('tru'),
         utils.paramBoolean(true),
         utils.paramBoolean(4)
        ]

        arr.forEach(item => {
          expect(item).to.be.true
        })

        let arr2 = [
          utils.paramBoolean(0),
          utils.paramBoolean('false'),
          utils.paramBoolean(false),
          utils.paramBoolean(null)
        ]

        arr2.forEach(item => {
          expect(item).to.be.false
        })
    })
  })

  describe('repackGraphQLresponse', () => {
    it('should return null if not valid array arg', () => {
      let response = {
        data: {}
      }

      let newResponse = repackGQLresponse(response)
      expect(newResponse).to.be.null
    })
    it('should return null if not valid array arg, empty obj', () => {
      let response = {}

      let newResponse = repackGQLresponse(response)
      expect(newResponse).to.be.null
    })
    it('should return new response', () => {
      let response = {
        data: {
          authors: [1,2,3]
        }
      }
      let newResponse = repackGQLresponse(response)
      expect(newResponse.data).to.be.an('array')
      expect(newResponse.data).to.deep.equal(response.data.authors)
    })
  })

  describe('strToArr', () => {
    const expectedArr = ['id', 'name', 'username', 'email']
    it('should return proper array 2', () => {
      let strings = [
        'id name username email',
        '  id    name username    email',
        `
          id   name username     email
        `
      ]
      strings.forEach(str => expect( utils.strToArr(str)).to.deep.equal(expectedArr) )
    })

    it('should return empty array if arg not string', () => {
      let falseStrings = [0, null, undefined, 12, [], {}, '']
      falseStrings.forEach(str => {
        expect(utils.strToArr(str)).to.deep.equal([])
      })
    })

  })

  describe('replaceObjProps', () => {
    it('should replace obj props with new, leaving untouched, props that don\'t match', () => {
      let obj = {
        a: 1,
        b: 2,
        c: 3
      }
      let newObj = {
        b: 20
      }

      let resObj = utils.replaceObjProps(obj, newObj)

      let expectedKeys = Object.keys(obj)
      expectedKeys.forEach(key => {
        expect(resObj).to.have.property(key)
      })
      expect(resObj.a).to.equals(obj.a)
      expect(resObj.c).to.equals(obj.c)
      expect(resObj.b).to.equals(newObj.b)
    })
  })

  describe('calculateGallerySectionsSize', () => {
    it('should sum all section sizes', () => {
      let sections = gallerySectionsMaker({nImages: 3, nSections: 4})
      let result = utils.calculateGallerySectionsSize(sections)
      expect(result).to.be.a('number').and.greaterThan(1)

    })
    it('should return undefined if bad arg', () => {
      let result = utils.calculateGallerySectionsSize({})
      expect(result).to.be.undefined
    })
  })

  describe('calculateDate', () => {

    it('should return "now" in date format if props now valid', () => {
      let date = new Date
      let badParams = [
        '1 asdf hoj',
        '- days min f',
        'day -1',
        'hour date minutes 123',
        '01 23 day mi',
        null,
        undefined,
        'a',
        1
      ]

      badParams.forEach(item => {
        let result = utils.calculateDate(item, date)
        expect(result).to.deep.equals(date)
      })

    })

    let nums = [1, 34, 123, -2, -21, 9]
    it('should return valid date based on day basis', () => {
      let date = new Date()

      nums.forEach(num => {
        let result = utils.calculateDate(`${num} days`, date)
        let actualDay = result.getDate()
        let expectedDay = new Date(new Date().setDate(date.getDate() + num)).getDate()
        expect(actualDay).to.equals(expectedDay)
      })

    })

    it('should return valid date based on hours basis', () => {
      let date = new Date()
      // let nums = [1, 34, 123, -2, -21, 9]

      nums.forEach(num => {
        let result = utils.calculateDate(`${num} hours`, date)
        let actualHour = result.getHours()
        let expectedHour = new Date(new Date().setHours(date.getHours() + num)).getHours()
        expect(actualHour).to.equals(expectedHour)
      })
    })

    it('should return valid date based on minutes basis', () => {
      let date = new Date()
      // let nums = [1, 34, 123, -2, -21, 9]

      nums.forEach(num => {
        let result = utils.calculateDate(`${num} minutes`, date)
        let actualMinut = result.getMinutes()
        let expectedMinute = new Date(new Date().setMinutes(date.getMinutes() + num)).getMinutes()
        expect(actualMinut).to.equals(expectedMinute)
      })
    })

    it('should return same date if 0 is first part of arg', () => {
      let date = new Date('2018-03-01')
      let args = [
        '0 minutes',
        '0 days',
        '0 hours'
      ]
      args.forEach(arg => {
        let result = utils.calculateDate(arg, date)
        expect(date).to.deep.equals(result)
      })
    })

  })

  describe('filerUsersFromStory', () => {
    let authors, story
    before(async () => {
      authors = utils.createOIDs(4)
      story = await storyFaker({
        author: authors[0],
        collaborators: [
          ...authors.map((author, index) => {
            if (index > 0) {
              return {
                edit: true,
                author
              }
            }
          }).filter(a => !!a)
        ]
      })
    })
    after(async () => {
      await initAfter()
    })

    it('should remove specified authors', () => {
      let usersToRemove = [authors[1], authors[2]]
      let result = utils.filterUsersFromStory(story[0], usersToRemove)
      expect(result).to.not.includes(authors[1].toString())
      expect(result).to.not.includes(authors[2].toString())
      expect(result).to.includes(authors[3].toString())
    })
  })

  describe('validateUsername', () => {
    it('should validate username, empty', () => {
      const error = utils.validateUsername('')

      expect(error).to.equals('You didn\'t enter a username')
    })

    it('should validate username, too short', () => {
      const error = utils.validateUsername('us')

      expect(error).to.equals(`Username can not be less then ${USERNAME_MIN} characters`)
    })

    it('should validate username, too long', () => {
      const error = utils.validateUsername('usernameusername')

      expect(error).to.equals(`Username is longer then ${USERNAME_MAX} characters`)
    })

    it('should validate username, too short', () => {
      const error = utils.validateUsername('usern!me')

      expect(error).to.equals('The username contains illegal characters')
    })

    it('should validate username, valid username', () => {
      const error = utils.validateUsername('username')

      expect(error).to.equals(null)
    })
  })

  describe('validatePassword', () => {
    it('should validate password, empty', () => {
      const error = utils.validatePassword('')

      expect(error).to.equals('You didn\'t enter a password')
    })

    it('should validate password, too short', () => {
      const error = utils.validatePassword('passw')

      expect(error).to.equals(`Password must be ${PASSWORD_MIN} characters at least`)
    })

    it('should validate password, too long', () => {
      const error = utils.validatePassword('passwordpassword')

      expect(error).to.equals(`Password is longer then ${PASSWORD_MAX} characters`)
    })
  })

})
