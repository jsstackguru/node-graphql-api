// assertions
import chai from 'chai'
import chaiHttp from 'chai-http'
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'
import server from '../../setup/server'
import {initAfter, initBefore} from '../../setup'
// services
import { generateToken } from '../../../src/services/auth'
// fixtures
import fixtures from '../../fixtures'
// expected
import groupAccountExpected from '../../fixtures/other/GQL_tests/group/group-account.json'

const authors = fixtures.collections.authors

chai.use(chaiHttp)

describe('group based queries', () => {

  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('groupAccount', () => {
    it('should return proper activities data', async () => {
      try {
        let author = authors[0]
        let token = generateToken(author.email)
        const query = `
          query {
            accountStatus {
              id,
              members {
                name
                storage {
                  usage
                },
                plan {
                  level
                }
              },
              isOwner
              pending {
                author {
                  name
                },
                email
              }
            }
          }
          `
      let response = await chai.request(server)
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({query})

      // console.log(JSON.stringify(response.body, "", 2))
      expect(response.body.data).to.exist
      expect(response.status).to.equal(200)
      expect(response.body).to.deep.equal(groupAccountExpected)

      } catch (err) {
        expect(err).to.not.exist
        throw err
      }
    })
  })

})
