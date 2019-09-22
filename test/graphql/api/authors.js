// assertions
import chai from 'chai'
import chaiHttp from 'chai-http'
import should from 'should'
import { expect } from 'chai'
import server from '../../setup/server'
import { initAfter, initBefore } from '../../setup'

// services
import { generateToken } from '../../../src/services/auth'

// fixtures
import fixtures from '../../fixtures'

// expected fixtures
import authorExpected from '../../fixtures/other/GQL_tests/author/author.json'
import authorsSearchExpected from '../../fixtures/other/GQL_tests/authorsSearch/authorsSearch.json'
import profileExpected from '../../fixtures/other/GQL_tests/profile/profile.json'
import profileUsernameExpected from '../../fixtures/other/GQL_tests/profile/profileUsername.json'
import storageExpected from '../../fixtures/other/GQL_tests/storage/storage.json'
import storageJsonExpected from '../../fixtures/other/GQL_tests/storage/storageJson.json'

const authors = fixtures.collections.authors

chai.use(chaiHttp)

describe('Author based queries', () => {

  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('author', () => {
    it('should return proper author data', async () => {
      try {
        let author = authors[0]
        let token = generateToken(author.email)
        const query = `query {
          author(id: "${author._id}"){
            id
            name
            following {
              docs{
                name
              }
              total
            }
            followers {
              docs {
                name
              }
              total
            }
          }
        }`

      let response = await chai.request(server)
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({query})

      should.exist(response.body.data)
      expect(response.status).to.equal(200)
      expect(response.body).to.deep.equals(authorExpected)
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })
  })


  describe('authorsSearch', () => {
    it('should return proper authorSearch data', async () => {
      try {
        const query = `query {
            authorsSearch(search:"s", sort: "name:desc") {
              docs {
                name
                username
                email
                avatar
                bio
                firstTime
                location {
                  name
                  lon
                  lat
                }
                pushNotif{
                  newFollower
                }
                notif {
                  collaboration{
                    newCollaborator
                  }
                  social {
                    comments
                    newFollower
                  }
                }
              }
              limit
              page
              total
            }
          }`

        let user = authors[0]
        let token = generateToken(user.email)

        let response = await chai.request(server)
          .post('/graphql')
          .set('Authorization', `Bearer ${token}`)
          .send({query})
        // console.log(JSON.stringify(response.body, null, 2))
        should.exist(response.body.data)
        expect(response.status).to.equal(200)
        expect(response.body).to.deep.equals(authorsSearchExpected)
      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })
  })

  describe('profile', () => {
    it('should return proper profile data', async () => {
      try {
        let author = authors[0]
        let token = generateToken(author.email)
        const query = `query {
            profile(id: "${author['_id']}") {
              name
              username
              stories (sort:"title:desc"){
                docs {
                  title
                }
              }
              avatar
              following
              followers
            }
          }`

        let response = await chai.request(server)
          .post('/graphql')
          .set('Authorization', `Bearer ${token}`)
          .send({
            query
          })
        // console.log(JSON.stringify(response.body, null, 2))
        should.exist(response.body.data)
        expect(response.status).to.equal(200)
        expect(response.body).to.deep.equals(profileExpected)

      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })
  })

  describe('storageJson', () => {
    it('should return proper storageJson data', async () => {
      try {
        let author = authors[0]
        let token = generateToken(author.email)
        const query = `query {
            storageJson
          }`

        let response = await chai.request(server)
          .post('/graphql')
          .set('Authorization', `Bearer ${token}`)
          .send({
            query
          })

        // console.log(JSON.stringify(response.body, "", 2))
        expect(response.body.data).to.exist
        expect(response.status).to.equal(200)
        expect(response.body).to.deep.equals(storageJsonExpected)

      } catch (err) {
        should.not.exist(err)
        throw err
      }
    })
  })

  describe('storage', () => {
    it('should return proper storage data', async () => {
      try {

        let author = authors[0]
        let token = generateToken(author.email)

        const query = `query {
            storage {
              author {
                total {
                  bytes
                  format
                }
                used {
                  bytes
                  format
                }
                left {
                  bytes
                  format
                }
              }
              members {
                you {
                  bytes
                  format
                }
                others {
                  bytes
                  format
                }
                left {
                  bytes
                  format
                }
                total {
                  bytes
                  format
                }
              }
            }
          }`

        let response = await chai.request(server)
          .post('/graphql')
          .set('Authorization', `Bearer ${token}`)
          .send({
            query
          })

        // console.log(JSON.stringify(response.body, "", 2))
        expect(response.body.data).to.exist
        expect(response.status).to.equal(200)
        expect(response.body).to.deep.equals(storageExpected)

      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('profileUsername', () => {
    it('should return proper profile data by username', async () => {
      try {
        let author = authors[0]
        let token = generateToken(author.email)
        const query = `query {
            profileUsername(username: "${author.username}") {
              name
              username
              stories {
                docs {
                  title
                }
              }
              avatar
              following
              followers
            }
          }`

        let response = await chai.request(server)
          .post('/graphql')
          .set('Authorization', `Bearer ${token}`)
          .send({
            query
          })
        // console.log(JSON.stringify(response.body, null, 2))
        should.exist(response.body.data)
        expect(response.status).to.equal(200)
        expect(response.body).to.deep.equals(profileUsernameExpected)

      } catch (err) {
        console.log(err.stack)
        should.not.exist(err)
        throw err
      }
    })
  })

})
