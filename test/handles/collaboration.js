/**
 * @file Tests for collaboration handles
 * @author Nikola Miljkovic <mnikson@storyr.com>
 * @version 1.0
 */
//TODO: srediti ovo da bude lepo :) kao i u ostalim testovima

import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'
import mongoose from 'mongoose'
import fixtures from '../fixtures'
import { ObjectId } from 'mongodb'

// Handlers
import collabHndl from '../../src/handles/collaboration.handles'

// Models
import CollaborationInvite from '../../src/models/collaboration-invite'

// Services
import { initBefore, initAfter } from '../setup'
 
// Fakers
import { authorFaker, storyFaker, collaborationInviteFaker } from '../fixtures/faker'

// Libs
import translate from '../../src/lib/translate';

const authors = fixtures.collections.authors
const stories = fixtures.collections.stories
let fakeAuthors
let fakeStories

describe('Collaboration handles tests...', () => {

  describe('New collaborators', () => {

    beforeEach(async () => {
      await initBefore()
    })

    afterEach(async () => {
      await initAfter()
    })

    describe('AddCollaborator', () => {
      let story // story of the author below
      let user // Author of the story above
      let collaborator // collaborator wannabe co-author :)
      let edit = false // give collaborator edit possibilities on the story


      it('return error if story is not found', async () => {
        try {
          let storyId = mongoose.Types.ObjectId()
          user = fixtures.collections.authors[1]
          collaborator = fixtures.collections.authors[0]

          const response = await collabHndl.addCollaborator(collaborator._id, storyId, user, edit)
          expect(response).to.not.exist

        } catch (err) {
          assert.equal(err instanceof Error, true)
          err.message.should.be.equal('Story not found')
        }
      })

      it('return error if user don\'t have permission to add collaborator',  async () => {
        try {
          story = fixtures.collections.stories[5]
          user = fixtures.collections.authors[1]
          collaborator = fixtures.collections.authors[2]
          edit = true
          const response = await collabHndl.addCollaborator(collaborator._id, story._id, user, edit)
          expect(response).to.not.exist

        } catch (err) {
          assert.equal(err instanceof Error, true)
          err.message.should.be.equal('You don\'t have permission for this Story')
        }
      })

      it('return error if user is already collaborator', async () => {
        try {
          story = fixtures.collections.stories[3]
          user = fixtures.collections.authors[1]
          collaborator = fixtures.collections.authors[0]

          const response = await collabHndl.addCollaborator(collaborator._id, story._id, user, edit)
          expect(response).not.exist

        } catch (err) {
          assert.equal(err instanceof Error, true)
          err.message.should.be.equal('User is already collaborator on this Story')
        }
      })

      it('return error if user is not found', async () => {
        try {
          story = fixtures.collections.stories[3]
          user = fixtures.collections.authors[1]
          collaborator = { _id: mongoose.Types.ObjectId() } // fake id

          const response = await collabHndl.addCollaborator(collaborator._id, story._id, user, edit)
        } catch (err) {
          assert.equal(err instanceof Error, true)
          err.message.should.be.equal('User not found')
        }
      })

      it('return collaborator and write collaborator in DB', async () => {
        story = fixtures.collections.stories[2]
        user = fixtures.collections.authors[1]
        collaborator = fixtures.collections.authors[3]
        const edit = true;

        const response = await collabHndl.addCollaborator(collaborator._id, story._id, user, edit)
        
        assert.equal(response.id, collaborator.id)
        assert.equal(response.name, collaborator.name)
        assert.equal(response.username, collaborator.username)
        assert.equal(response.avatar, collaborator.avatar)
        assert.equal(response.edit, edit)
      })
    })

    describe('AddCollaboratorByEmail', () => {

        let emailAdress // collaborator wannabe co-author :)
        let story // story of the author below
        let user // Author of the story above
        let edit = false // give collaborator edit possibilities on the story
        let name = 'NotSure'

        it('return error if story is not found', async () => {
          try {
            emailAdress = 'sasateodorovic57@storyr.com'
            let storyId = mongoose.Types.ObjectId()
            user = fixtures.collections.authors[1]

            const response = await collabHndl.addCollaboratorByEmail(emailAdress, storyId, user, edit, name)

            assert.equal(response instanceof Error, true)
            response.message.should.be.equal('Story not found')
          } catch (err) {
            expect(err).to.not.exist
          }
        })

        it('return error if user don\'t have permission to invite', async () => {
          try {
            emailAdress = fixtures.collections.authors[2]["email"]
            story = fixtures.collections.stories[5]
            user = fixtures.collections.authors[1]
            edit = true
            const response = await collabHndl.addCollaboratorByEmail(emailAdress, story._id, user, edit)

            assert.equal(response instanceof Error, true)
            response.message.should.be.equal('You don\'t have permission for this Story')
          } catch (err) {
            expect(err).to.not.exist
          }
        })

        it('return null, user is found', async () => {
          try {
            emailAdress = 'manualtester79@gmail.com'
            let storyId = fixtures.collections.stories[1].id
            user = fixtures.collections.authors[0]

            const response = await collabHndl.addCollaboratorByEmail(emailAdress, storyId, user, edit, name)
            
            assert.equal(response, null)
          } catch (err) {
            expect(err).to.not.exist
          }
        })

        it('return collaborator and write invitation in DB', async () => {
          try {
            emailAdress = 'testauthor1@istoryapp.com'
            let storyId = fixtures.collections.stories[1].id
            user = fixtures.collections.authors[1]

            const response = await collabHndl.addCollaboratorByEmail(emailAdress, storyId, user, edit, name)
            const invitations = await CollaborationInvite.find({
              email: emailAdress,
              story: storyId,
              active: true,
              edit: edit
            })

            expect(invitations).to.have.lengthOf(1)
            assert.equal(emailAdress, invitations[0].email)
            assert.equal(storyId, invitations[0].story)
          } catch (err) {
            expect(err).to.not.exist
          }

        })
    })

    describe('InviteColaborators', () => {
      it('return invited authors', async () => {
        try {
          const author1 = fixtures.collections.authors[3]
          const author2 = fixtures.collections.authors[2]
          let invitations = [{
              id: author1._id,
              "edit": false
            },
            {
              id: author2._id,
              "edit": false
            }
          ]
          let storyId = fixtures.collections.stories[0]._id
          let authorUser = fixtures.collections.authors[0]

          let invitedAuthors = await collabHndl.addCollaborators(invitations, storyId, authorUser)
          
          expect(invitedAuthors).to.have.lengthOf(2)
          const invAuthor1 = invitedAuthors[0]
          expect(invAuthor1).to.contain({
            name: author2.name,
            avatar: author2.avatar,
            username: author2.username,
            email: author2.email
          })
          const invAuthor2 = invitedAuthors[1]
          expect(invAuthor2).to.contain({
            name: author1.name,
            avatar: author1.avatar,
            username: author1.username,
            email: author1.email
          })

        } catch (err) {
          expect(err).to.not.exist
        }
      })
    })

    describe('InviteColaboratorByEmails', () => {
      it('return invited authors', async () => {
        try {
          let invitations = [{
              email: 'nidzoliki@istoryapp.com',
              edit: false,
              name: 'Nikola'
            },
            {
              email: 'testauthor1@istoryapp.com',
              edit: false,
              name: 'Tester'
            }
          ]
          let storyId = fixtures.collections.stories[0]._id
          let authorUser = fixtures.collections.authors[0]

          let invitedAuthors = await collabHndl.addCollaboratorsByEmail(invitations, storyId, authorUser)

          let invited1 = invitedAuthors.find(author => {
            return author.email === invitations[0].email
          })
          let invited2 = invitedAuthors.find(author => {
            return author.email === invitations[1].email
          })

          // TODO: mozada jos neka provera
          expect(invitedAuthors).to.have.lengthOf(2)
          expect(invited1).to.have.property("email").and.equal(invitations[0].email)
          expect(invited2).to.have.property("email").and.equal(invitations[1].email)
        } catch (err) {
          console.log(err.stack)
          expect(err).to.not.exist
        }

      })
    })

    describe('removeFromCollaboration', () => {
      let storyId // story ID
      let userId // targeted user (collaborator) id
      let effectiveUser // user who owns the story, one who wants to kick out other

      it('return error for remove permission', async () => {
        try {
          storyId = fixtures.collections.stories[4]._id
          userId = fixtures.collections.authors[1]._id
          effectiveUser = fixtures.collections.authors[0]

          let response = await collabHndl.removeFromCollaboration(storyId, userId, effectiveUser)

          assert.equal(response instanceof Error, true)
          assert.equal(response.message, 'You don\'t have permission for this action.')
        } catch (err) {
          should.not.exist(err)
        }
      })
      it('return error if user is not collaborator', async () => {
        try {
          storyId = fixtures.collections.stories[5]._id
          userId = fixtures.collections.authors[2]._id
          effectiveUser = fixtures.collections.authors[0]

          let response = await collabHndl.removeFromCollaboration(storyId, userId, effectiveUser)

          assert.equal(response instanceof Error, true)
          assert.equal(response.message, 'This user is not collaborator on story.')
        } catch (err) {
          should.not.exist(err)
        }
      })
      it('return copied story', async () => {
        try {
          storyId = fixtures.collections.stories[5]._id
          userId = fixtures.collections.authors[1]._id
          effectiveUser = fixtures.collections.authors[0]

          let response = await collabHndl.removeFromCollaboration(storyId, userId, effectiveUser)

          assert.equal(response instanceof Error, false)
          response.should.be.type('object').and.have.property('author')
          assert.equal(response.author.toString(), userId)
        } catch (err) {
          should.not.exist(err)
        }
      })
    })

    describe('leaveCollaboration', () => {
      it('author should not leave collaboration, story not found', async() => {
        try {
          const user = authors[0]
          const storyId = '593f94bd17d85a0e003d3c38'
          await collabHndl.leaveCollaboration(user, storyId, false)
        } catch (err) {
          should(err).exist
          assert.equal(err.message, 'Story not found')
          assert.equal(err.statusCode, 422)
        }
      })

      it('author should leave collaboration, without story', async() => {
        try {
          const user = authors[0]
          const storyId = stories[3]['id']

          let result = await collabHndl.leaveCollaboration(user, storyId, false)
          assert.equal(result, null)
        } catch (err) {
          console.log(err.stack)
          expect(err).to.not.exist
        }
      })

      it('should return err if author is not collaborator', async () => {
        try {
          const user = authors[1]
          const storyId = stories[3]['id']

          let result = await collabHndl.leaveCollaboration(user, storyId, false)
          expect(result).to.not.exist

        } catch (err) {
          expect(err.name).to.equals('UnprocessableEntity')
          expect(err.message).to.equals('You are not collaborator on this story')

        }
      })

      it('author should leave collaboration, with story', async() => {
        try {
          const user = fixtures.collections.authors[1]
          const storyId = '5939503417d85a0e003d3c22'
          let result = await collabHndl.leaveCollaboration(user, storyId, true)

          should(result).be.type('object')
          should(result).have.property('title')
          assert.equal(result.title, 'Collaboration Story #2 - your pages')
          assert.equal(result.status, 'private')
          should(result).have.property('pages')
          assert.equal(result.pages.length, 1)
        } catch (err) {
          console.log(err.stack)
          expect(err).to.not.exist
        }
      })
    })
  })

  describe('updateCollaborator', () => {
    before(async () => {
      await initAfter()
      fakeAuthors = await authorFaker({
        n: 5
      })
      const storyAuthor = fakeAuthors[0]
      const collaborators = [
        {
          author: fakeAuthors[1],
          edit: true
        },
        {
          author: fakeAuthors[2],
          edit: true
        },
        {
          author: fakeAuthors[3],
          edit: false
        }
      ]
      fakeStories = await storyFaker({
        n: 1,
        author: storyAuthor,
        collaborators
      })
    })

    after(async () => {
      await initAfter()
    })

    it('should not update collaborator, story not found', async () => {
      try {
        await collabHndl.updateCollaborator(fakeAuthors[0], ObjectId())
      } catch (err) {
        should.exist(err)
        assert.equal(err.statusCode, 422)
        assert.equal(err.message, translate.__('Story not found'))
        assert.equal(err.name, 'UnprocessableEntity')
      }
    })

    it('should not update collaborator, author not found', async () => {
      try {
        await collabHndl.updateCollaborator(fakeAuthors[0], fakeStories[0].id, ObjectId())
      } catch (err) {
        should.exist(err)
        assert.equal(err.statusCode, 422)
        assert.equal(err.message, translate.__('Author not found'))
        assert.equal(err.name, 'UnprocessableEntity')
      }
    })

    it('should not update collaborator, user has no access', async () => {
      try {
        await collabHndl.updateCollaborator(fakeAuthors[4], fakeStories[0].id, fakeAuthors[1])
      } catch (err) {
        should.exist(err)
        assert.equal(err.statusCode, 403)
        assert.equal(err.message, translate.__('You don\'t have permission to this Story'))
        assert.equal(err.name, 'Forbidden')
      }
    })

    it('should update collaborator by author, edit false', async () => {
      try {
        const collaborator = fakeAuthors[1]
        const result = await collabHndl.updateCollaborator(
          fakeAuthors[0],
          fakeStories[0].id,
          collaborator.id
        )
        assert.equal(result.author._id, collaborator.id)
        assert.equal(result.edit, false)
      } catch (err) {
        should.not.exist(err)
        console.log(err.stack)
      }
    })

    it('should update collaborator by author, edit true', async () => {
      try {
        const collaborator = fakeAuthors[1]
        const result = await collabHndl.updateCollaborator(
          fakeAuthors[0],
          fakeStories[0].id,
          collaborator.id,
          true
        )
        assert.equal(result.author._id, collaborator.id)
        assert.equal(result.edit, true)
      } catch (err) {
        should.not.exist(err)
        console.log(err.stack)
      }
    })

    it('should update collaborator by other collaborator, edit false', async () => {
      try {
        const collaborator = fakeAuthors[1]
        const result = await collabHndl.updateCollaborator(
          fakeAuthors[2],
          fakeStories[0].id,
          collaborator.id
        )
        assert.equal(result.author._id, collaborator.id)
        assert.equal(result.edit, false)
      } catch (err) {
        should.not.exist(err)
        console.log(err.stack)
      }
    })

    it('should update collaborator by other collaborator, edit true', async () => {
      try {
        const collaborator = fakeAuthors[1]
        const result = await collabHndl.updateCollaborator(
          fakeAuthors[2],
          fakeStories[0].id,
          collaborator.id,
          true
        )
        assert.equal(result.author._id, collaborator.id)
        assert.equal(result.edit, true)
      } catch (err) {
        should.not.exist(err)
        console.log(err.stack)
      }
    })
  })

  describe('cancelInvitation', () => {
    let fakeAuthors
    let fakeStory
    let fakeInvitations

    before(async () => {
      await initAfter()
      fakeAuthors = await authorFaker({
        n: 3
      })
      fakeStory = await storyFaker({
        single: true,
        author: fakeAuthors[0]._id
      })
      fakeInvitations = await Promise.all([
        collaborationInviteFaker({
          single: true,
          invited: null,
          author: fakeAuthors[0]._id,
          email: 'test1@istoryapp.com',
          story: fakeStory._id
        }),
        collaborationInviteFaker({
          single: true,
          invited: null,
          author: fakeAuthors[0]._id,
          email: 'test2@istoryapp.com',
          story: fakeStory._id
        })
      ])
    })

    it('should not cancel invitation, user not found', async () => {
      try {
        await collabHndl.cancelInvitation(null, fakeStory._id, ['test1@email.com'])
      } catch (err) {
        should.exist(err)
        assert.equal(err.name, 'UnprocessableEntity')
        assert.equal(err.statusCode, 422)
      }
    })

    it('should not cancel invitation, emails not found', async () => {
      try {
        const author = fakeAuthors[0]
        await collabHndl.cancelInvitation(author, fakeStory._id, null)
      } catch (err) {
        should.exist(err)
        assert.equal(err.name, 'BadRequest')
        assert.equal(err.statusCode, 400)
      }
    })

    it('should not cancel invitation, story not found', async () => {
      try {
        const author = fakeAuthors[0]
        await collabHndl.cancelInvitation(author, ObjectId(), ['test1@email.com'])
      } catch (err) {
        should.exist(err)
        assert.equal(err.name, 'UnprocessableEntity')
        assert.equal(err.statusCode, 422)
      }
    })

    it('should not cancel invitation, user don\'t have a permission', async () => {
      try {
        const author = fakeAuthors[1]
        await collabHndl.cancelInvitation(author, fakeStory._id, ['test1@email.com'])
      } catch (err) {
        should.exist(err)
        assert.equal(err.name, 'Forbidden')
        assert.equal(err.statusCode, 403)
      }
    })

    it('should cancel invitation', async () => {
      try {
        const author = fakeAuthors[0]
        const results = await collabHndl.cancelInvitation(author, fakeStory._id, ['test1@istoryapp.com'])
        
        should.exist(results)
        should(results).be.type('object')
        assert.equal(results.ok, 1)
        assert.equal(results.deletedCount, 1)
      } catch (err) {
        should.not.exist(err)
      }
    })
  })

})
