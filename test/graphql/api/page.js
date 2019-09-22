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

// expected fixtures
import repliesExpected from '../../fixtures/other/GQL_tests/comments/replies.json'
import commentsExpected from '../../fixtures/other/GQL_tests/comments/comments.json'
import pageExpected from '../../fixtures/other/GQL_tests/page/page.json'

const authors = fixtures.collections.authors
const pages = fixtures.collections.pages

chai.use(chaiHttp)

describe('Page based queries', () => {

  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('page', () => {
    it('should return proper page data', async () => {
      try {
        let author = authors[1]
        let token = generateToken(author.email)
        let pageId = pages[0]['_id']
        const query = `query {
            page(id: "${pageId}") {
              title
              slug
              comments (sort: "created:1" limit: 2) {
                docs {
                  comment {
                    text
                    author {
                      name
                      stories (sort:"title:desc") {
                        docs {
                          title
                        }
                      }
                    }
                  }
                  replies (sort: "text:asc") {
                    docs {
                      text
                    }
                    total
                    pages
                  }
                }
                total
                pages
              }
            }
          }`

      let response = await chai.request(server)
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({query})

      // console.log(JSON.stringify(response.body, null, 2))
      should.exist(response.body.data)
      expect(response.status).to.equal(200)
      expect(response.body).to.deep.equals(pageExpected)
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })
  })

  describe('comments', () => {
    it('should return proper comments data', async () => {
      try {
        let author = authors[1]
        let token = generateToken(author.email)
        let pageId = pages[0]['_id']
        const query = `query {
          comments(pageId: "${pageId}" limit: 3 sort:"text:asc") {
              docs {
                text
                id
                deleted
                author {
                  name
                }
              }
            }
          }`

      let response = await chai.request(server)
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({query})

      should.exist(response.body.data)
      expect(response.status).to.equal(200)
      expect(response.body).to.deep.equals(commentsExpected)
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })
  })

  describe('replies', () => {
    it('should return proper author data', async () => {
      try {
        let author = authors[1]
        let token = generateToken(author.email)
        let commentId = "5b29f711d216c70e00c357b7"
        const query = `query {
          replies(commentId: "${commentId}" limit: 3 sort:"text:asc") {
              docs {
                text
                id
                deleted
                author {
                  name
                }
              }
            }
          }`

      let response = await chai.request(server)
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({query})

      // console.log(JSON.stringify(response.body))
      should.exist(response.body.data)
      expect(response.status).to.equal(200)
      expect(response.body).to.deep.equals(repliesExpected)
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })
  })


})
