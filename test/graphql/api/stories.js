// assertions
import chai from 'chai'
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'
import server from '../../setup/server'
import {initAfter, initBefore} from '../../setup'
// config
import config from '../../../src/config'
// services
import { generateToken } from '../../../src/services/auth'
// fixtures
import fixtures from '../../fixtures'
// expected
import myStoriesExpected from '../../fixtures/other/GQL_tests/stories/myStories.json'
import myStoriesExpected_deleted from '../../fixtures/other/GQL_tests/stories/myStories_deleted.json'
import myCollaborationExpected from '../../fixtures/other/GQL_tests/stories/myCollaboration.json'
import myFeedExpected_shared from '../../fixtures/other/GQL_tests/stories/myFeed_shared.json'
import myFeedExpected_followed from '../../fixtures/other/GQL_tests/stories/myFeed_followed.json'
import authorsStoriesExpected_author from '../../fixtures/other/GQL_tests/stories/authorsStory_author.json'
import authorsStoriesExpected_collaborator from '../../fixtures/other/GQL_tests/stories/authorsStory_collaborator.json'
// fakers
import {
  authorFaker,
  collaborationInviteFaker,
  storyFaker
} from '../../fixtures/faker'

const authors = fixtures.collections.authors

describe('Story based queries', () => {

  before(async () => {
    await initAfter()
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('myStories', () => {
    it('should return proper stories data for authors stories', async () => {
      try {

        let author = authors[0]
        let token = generateToken(author.email)

        const query = `
          query {
            myStories(sort: "views:-1") {
              docs {
                title
                slug
                views
              }
              total
              limit
              page
              pages
            }
          }`
        let response = await chai.request(server)
          .post('/graphql')
          .set('Authorization', `Bearer ${token}`)
          .send({query})

        should.exist(response.body.data)
        expect(response.status).to.equal(200)
        expect(response.body).to.deep.equals(myStoriesExpected)

      } catch (err) {
        expect(err).to.not.exist
      }
    })
    it('should return proper stories data for authors deleted stories', async () => {
      try {

        let author = authors[0]
        let token = generateToken(author.email)

        const query = `
          query {
            myStories(deleted: "true", sort: "views:-1") {
              docs {
                title
                slug
                views
                deleted
              }
              total
              limit
              page
              pages
            }
          }
          `
        let response = await chai.request(server)
          .post('/graphql')
          .set('Authorization', `Bearer ${token}`)
          .send({query})

        should.exist(response.body.data)
        expect(response.status).to.equal(200)
        expect(response.body).to.deep.equals(myStoriesExpected_deleted)

      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('myCollaboration', () => {
    it('should return proper stories where user is collaborator', async () => {
      try {

        let author = authors[1]
        let token = generateToken(author.email)

        const query = `
          query {
            myCollaboration(sort: "views:-1") {
              docs {
                title
                slug
                views
                deleted
              }
              total
              limit
              page
              pages
            }
          }
          `
        let response = await chai.request(server)
          .post('/graphql')
          .set('Authorization', `Bearer ${token}`)
          .send({
            query
          })

        should.exist(response.body.data)
        expect(response.status).to.equal(200)
        expect(response.body).to.deep.equals(myCollaborationExpected)

      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('myFeed', () => {
    it('should return proper stories', async () => {
      try {

        let author = authors[0]
        let token = generateToken(author.email)

        const query = `
          query {
            myFeed(sort: "title:-1") {
              docs {
                title
                slug
                views
                deleted
              }
              total
              limit
              page
              pages
            }
          }
          `
        let response = await chai.request(server)
          .post('/graphql')
          .set('Authorization', `Bearer ${token}`)
          .send({
            query
          })

        should.exist(response.body.data)
        expect(response.status).to.equal(200)
        expect(response.body).to.deep.equals(myFeedExpected_followed)

      } catch (err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('authorsStories', () => {
    it('should return error if selection arg is not correct', async () => {
      try {

        let author = authors[1]
        let token = generateToken(author.email)
        let id = author['id']

        const query = `
          query {
            authorsStories(sort: "title:-1", selection: "false", id: "${id}") {
              docs {
                title
                slug
                created
                deleted
              }
              total
              limit
              page
              pages
            }
          }
          `
        let response = await chai.request(server)
          .post('/graphql')
          .set('Authorization', `Bearer ${token}`)
          .send({ query })

        should.exist(response.body.errors);
        expect(response.status).to.equal(200);
        expect(response.body.errors[0]["message"]).to.equals('Allowed parameter names for selection are "author" and "collaborator"');

      } catch (err) {
        expect(err).to.not.exist
      }
    })
    it("should return proper stories if selection arg is author", async () => {
      try {
        let author = authors[1];
        let token = generateToken(author.email);
        let id = author["id"];

        const query = `
          query {
            authorsStories(sort: "title:-1", selection: "author", id: "${id}") {
              docs {
                author {
                  name
                }
                title
                slug
                views
                deleted
              }
              total
              limit
              page
              pages
            }
          }
          `;
        let response = await chai
          .request(server)
          .post("/graphql")
          .set("Authorization", `Bearer ${token}`)
          .send({ query });

        should.exist(response.body)
        expect(response.status).to.equal(200)
        expect(response.body).to.deep.equals(authorsStoriesExpected_author)
      } catch (err) {
        expect(err).to.not.exist;
      }
    })
    it("should return proper stories if selection arg is collaborator", async () => {
      try {
        let author = authors[1]
        let token = generateToken(author.email)
        let id = author["id"]

        const query = `
          query {
            authorsStories(sort: "title:-1", selection: "collaborator", id: "${id}") {
              docs {
                author {
                  name
                }
                title
                slug
                views
                deleted
              }
              total
              limit
              page
              pages
            }
          }
          `
        let response = await chai
          .request(server)
          .post("/graphql")
          .set("Authorization", `Bearer ${token}`)
          .send({ query });

        should.exist(response.body)
        expect(response.status).to.equal(200)
        expect(response.body).to.deep.equals(authorsStoriesExpected_collaborator)
      } catch (err) {
        expect(err).to.not.exist;
      }
    })
  })

  describe('searchCollaborators', () => {
    let fakeAuthors
    let req
    let collaborators = []
    let story

    before(async () => {
      await initAfter()
      fakeAuthors = await authorFaker({
        n: 17
      })
      const targetAuthorsPromise = []
      targetAuthorsPromise.push(
        authorFaker({
          single: true,
          username: 'neverused',
          name: 'Neverused Doe',
          email: 'johndoe@gmail.com'
        })
      )
      targetAuthorsPromise.push(
        authorFaker({
          single: true,
          username: 'neverusedtoo',
          name: 'Neverused Trapper',
          email: 'johndoetoo@gmail.com'
        })
      )
      const targetAuthors = await Promise.all(targetAuthorsPromise)
      fakeAuthors = fakeAuthors.concat(targetAuthors)
      fakeAuthors.forEach((author, index) => {
        if (index > 0) {
          let edit = false
          if (index > 3) {
            edit = true
          }
          collaborators.push({
            author: author._id,
            edit
          })
        }
      })
      story = await storyFaker({
        single: true,
        author: fakeAuthors[0]._id,
        collaborators
      })

      req = {
        user: fakeAuthors[0]
      }
    })

    after(async () => {
      await initAfter()
    })

    it("should not return search collaborators on the story, unauthorized user", async () => {
      try {
        const id = story.id

        const query = `
          query {
            searchCollaborators(id: "${id}") {
              docs {
                _id
                edit
                name
                username
                email
                avatar
                canInvite
              }
              total
              limit
              page
              pages
            }
          }
          `
        const response = await chai
          .request(server)
          .post("/graphql")
          .set("Authorization", `Bearer`)
          .send({ query });

        const { error } = response
        should.exist(error)
        expect(response.status).to.equal(401)
      } catch (err) {
        expect(err).to.not.exist;
      }
    })

    it("should return search collaborators on the story", async () => {
      try {
        const author = fakeAuthors[1]
        const token = generateToken(author.email)
        const id = story.id

        const query = `
          query {
            searchCollaborators(id: "${id}") {
              docs {
                _id
                edit
                name
                username
                email
                avatar
                canInvite
              }
              total
              limit
              page
              pages
            }
          }
          `
        const response = await chai
          .request(server)
          .post("/graphql")
          .set("Authorization", `Bearer ${token}`)
          .send({ query });

        should.exist(response.body)
        expect(response.status).to.equal(200)
        const { body: { data } } = response
        const { searchCollaborators } = data
        expect(searchCollaborators).to.have.property('docs')
        const { docs } = searchCollaborators
        docs.forEach(collaborator => {
          expect(collaborator).to.have.property('_id')
          expect(collaborator).to.have.property('name')
          expect(collaborator).to.have.property('username')
          expect(collaborator).to.have.property('avatar')
          expect(collaborator).to.have.property('email')
          expect(collaborator).to.have.property('edit')
          expect(collaborator).to.have.property('canInvite')
        })
        expect(searchCollaborators).to.have.property('total')
        expect(searchCollaborators).to.have.property('limit')
        expect(searchCollaborators).to.have.property('page')
        expect(searchCollaborators).to.have.property('pages')
        const { page, pages, total } = searchCollaborators
        assert.equal(docs.length, 10)
        assert.equal(total, 15)
        assert.equal(pages, 2)
        assert.equal(page, 1)
      } catch (err) {
        console.log(err.stack)
        expect(err).to.not.exist;
      }
    })

    it("should not return search collaborators on the story, story not found", async () => {
      try {
        const author = await authorFaker({
          single: true
        })
        const token = generateToken(author.email)
        const id = story.id

        const query = `
          query {
            searchCollaborators(id: "${id}") {
              docs {
                _id
                edit
                name
                username
                email
                avatar
                canInvite
              }
              total
              limit
              page
              pages
            }
          }
          `
        const response = await chai
          .request(server)
          .post("/graphql")
          .set("Authorization", `Bearer ${token}`)
          .send({ query });

        expect(response.status).to.equal(200)
      } catch (err) {
        console.log(err.stack)
        expect(err).to.not.exist;
      }
    })

    it("should return search collaborators on the story by search", async () => {
      try {
        const author = fakeAuthors[1]
        const token = generateToken(author.email)
        const id = story.id

        const query = `
          query {
            searchCollaborators(id: "${id}", search: "neveru") {
              docs {
                _id
                edit
                name
                username
                email
                avatar
                canInvite
              }
              total
              limit
              page
              pages
            }
          }
          `
        const response = await chai
          .request(server)
          .post("/graphql")
          .set("Authorization", `Bearer ${token}`)
          .send({ query });

        // console.log(JSON.stringify(response.body, null, 2))
        should.exist(response.body)
        expect(response.status).to.equal(200)
        const { body: { data } } = response
        const { searchCollaborators } = data
        expect(searchCollaborators).to.have.property('docs')
        const { docs } = searchCollaborators
        docs.forEach(collaborator => {
          expect(collaborator).to.have.property('_id')
          expect(collaborator).to.have.property('name')
          expect(collaborator).to.have.property('username')
          expect(collaborator).to.have.property('avatar')
          expect(collaborator).to.have.property('email')
          expect(collaborator).to.have.property('edit')
          expect(collaborator).to.have.property('canInvite')
        })
        expect(searchCollaborators).to.have.property('total')
        expect(searchCollaborators).to.have.property('limit')
        expect(searchCollaborators).to.have.property('page')
        expect(searchCollaborators).to.have.property('pages')
        const { page, pages, total } = searchCollaborators
        assert.equal(docs.length, 2)
        assert.equal(total, 2)
        assert.equal(pages, 1)
        assert.equal(page, 1)
      } catch (err) {
        console.log(err.stack)
        expect(err).to.not.exist;
      }
    })
  })

  describe('pendingCollaborators', () => {
    let fakeAuthors
    let req
    let collaborators = []
    let story

    before(async () => {
      await initAfter()
      fakeAuthors = await authorFaker({
        n: 17
      })
      const targetAuthorsPromise = []
      targetAuthorsPromise.push(
        authorFaker({
          single: true,
          username: 'neverused',
          name: 'Neverused Doe',
          email: 'johndoe@gmail.com'
        })
      )
      targetAuthorsPromise.push(
        authorFaker({
          single: true,
          username: 'neverusedtoo',
          name: 'Neverused Trapper',
          email: 'johndoetoo@gmail.com'
        })
      )
      const targetAuthors = await Promise.all(targetAuthorsPromise)
      fakeAuthors = fakeAuthors.concat(targetAuthors)
      fakeAuthors.forEach((author, index) => {
        if (index > 0) {
          let edit = false
          if (index > 3) {
            edit = true
          }
          collaborators.push({
            author: author._id,
            edit
          })
        }
      })
      story = await storyFaker({
        single: true,
        author: fakeAuthors[0]._id,
        collaborators
      })

      const fakeAuthorsToInvite = await authorFaker({
        n: 3
      })
      fakeAuthorsToInvite.push(
        await authorFaker({
          single: true,
          username: 'pendinguser1',
          name: 'User Pading1'
        })
      )
      fakeAuthorsToInvite.push(
        await authorFaker({
          single: true,
          username: 'pendinguser2',
          name: 'User Pading2'
        })
      )

      for (const fakeAuthor of fakeAuthorsToInvite) {
        await collaborationInviteFaker({
          author: fakeAuthor._id,
          active: true,
          story: story._id,
          edit: true
        })
      }

      req = {
        user: fakeAuthors[0]
      }
    })
    after(async () => {
      await initAfter()
    })

    it("should not return search collaborators on the story, unauthorized user", async () => {
      try {
        const id = story.id

        const query = `
          query {
            pendingCollaborators(id: "${id}") {
              docs {
                _id
                edit
                name
                username
                email
                avatar
                canInvite
              }
              total
              limit
              page
              pages
            }
          }
          `
        const response = await chai
          .request(server)
          .post("/graphql")
          .set("Authorization", `Bearer`)
          .send({ query });

        const { error } = response
        should.exist(error)
        expect(response.status).to.equal(401)
      } catch (err) {
        expect(err).to.not.exist;
      }
    })

    it("should return search collaborators on the story", async () => {
      try {
        const author = fakeAuthors[1]
        const token = generateToken(author.email)
        const id = story.id

        const query = `
          query {
            pendingCollaborators(id: "${id}") {
              docs {
                _id
                edit
                name
                username
                email
                avatar
                canInvite
              }
              total
              limit
              page
              pages
            }
          }
          `
        const response = await chai
          .request(server)
          .post("/graphql")
          .set("Authorization", `Bearer ${token}`)
          .send({ query });
        should.exist(response.body)
        expect(response.status).to.equal(200)
        const { body: { data } } = response
        const { pendingCollaborators } = data
        expect(pendingCollaborators).to.have.property('docs')
        const { docs } = pendingCollaborators
        docs.forEach(collaborator => {
          expect(collaborator).to.have.property('_id')
          expect(collaborator).to.have.property('name')
          expect(collaborator).to.have.property('username')
          expect(collaborator).to.have.property('avatar')
          expect(collaborator).to.have.property('email')
          expect(collaborator).to.have.property('edit')
          expect(collaborator).to.have.property('canInvite')
        })
        expect(pendingCollaborators).to.have.property('total')
        expect(pendingCollaborators).to.have.property('limit')
        expect(pendingCollaborators).to.have.property('page')
        expect(pendingCollaborators).to.have.property('pages')
        const { page, pages, total } = pendingCollaborators
        assert.equal(docs.length, 5)
        assert.equal(total, 5)
        assert.equal(pages, 1)
        assert.equal(page, 1)
      } catch (err) {
        console.log(err.stack)
        expect(err).to.not.exist;
      }
    })

    it("should not return search collaborators on the story, story not found", async () => {
      try {
        const author = await authorFaker({
          single: true
        })
        const token = generateToken(author.email)
        const id = story.id
        const query = `
          query {
            pendingCollaborators(id: "${id}") {
              docs {
                _id
                edit
                name
                username
                email
                avatar
                canInvite
              }
              total
              limit
              page
              pages
            }
          }
          `
        const response = await chai
          .request(server)
          .post("/graphql")
          .set("Authorization", `Bearer ${token}`)
          .send({ query });
        // console.log(JSON.stringify(response.body, null, 2))
        expect(response.status).to.equal(200)
        const { body: { errors } } = response;
        expect(errors.length).to.equal(1)
        expect(errors[0].message).to.equal('Story not found')
      } catch (err) {
        console.log(err.stack)
        expect(err).to.not.exist;
      }
    })

    it("should return search collaborators on the story by search", async () => {
      try {
        const author = fakeAuthors[1]
        const token = generateToken(author.email)
        const id = story.id

        const query = `
          query {
            pendingCollaborators(id: "${id}", search: "pending") {
              docs {
                _id
                edit
                name
                username
                email
                avatar
                canInvite
              }
              total
              limit
              page
              pages
            }
          }
          `
        const response = await chai
          .request(server)
          .post("/graphql")
          .set("Authorization", `Bearer ${token}`)
          .send({ query });
        // console.log(JSON.stringify(response.body, null, 2))
        should.exist(response.body)
        expect(response.status).to.equal(200)
        const { body: { data } } = response
        const { pendingCollaborators } = data
        expect(pendingCollaborators).to.have.property('docs')
        const { docs } = pendingCollaborators
        docs.forEach(collaborator => {
          expect(collaborator).to.have.property('_id')
          expect(collaborator).to.have.property('name')
          expect(collaborator).to.have.property('username')
          expect(collaborator).to.have.property('avatar')
          expect(collaborator).to.have.property('email')
          expect(collaborator).to.have.property('edit')
          expect(collaborator).to.have.property('canInvite')
        })
        expect(pendingCollaborators).to.have.property('total')
        expect(pendingCollaborators).to.have.property('limit')
        expect(pendingCollaborators).to.have.property('page')
        expect(pendingCollaborators).to.have.property('pages')
        const { page, pages, total } = pendingCollaborators
        assert.equal(docs.length, 2)
        assert.equal(total, 2)
        assert.equal(pages, 1)
        assert.equal(page, 1)
      } catch (err) {
        console.log(err.stack)
        expect(err).to.not.exist;
      }
    })
  })
})
