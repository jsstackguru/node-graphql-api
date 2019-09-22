// assertions
import chai from 'chai'
import chaiHttp from 'chai-http'
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'
// GQL Types
import {
  AuthorType,
  AuthorLastActivityCheckType,
  AuthorLocationType,
  AuthorNotifType,
  AuthorProfileType,
  AuthorPushNotifType,
  AuthorStorageType,
  AuthorPlanType,
} from '../../../src/GQLSchema/GQLTypes/authorType'

import { StoryType } from '../../../src/GQLSchema/GQLTypes/storyType'
// fixtures
import fixtures from '../../fixtures'
// GQL handles
import { GQLPaginateType } from '../../../src/GQLSchema/GQLHandles'
// GQL objects types
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLInt
} from 'graphql'
import { initAfter, initBefore } from '../../setup'

const authors = fixtures.collections.authors

describe('Authors types', () => {
  before(async () => {
    await initBefore()
  })

  after(async () => {
    await initAfter()
  })

  describe('AuthorType', () => {
    it('should have id field of type ID', () => {
      expect(AuthorType.getFields()).to.have.property('id')
      expect(AuthorType.getFields().id.type).to.deep.equals(GraphQLID)
    })
    it('should have name field of type String', () => {
      expect(AuthorType.getFields()).to.have.property('name')
      expect(AuthorType.getFields().name.type).to.deep.equals(GraphQLString)
    })
    it('should have username field of type String', () => {
      expect(AuthorType.getFields()).to.have.property('username')
      expect(AuthorType.getFields().username.type).to.deep.equals(GraphQLString)
    })
    it('should have email field of type String', () => {
      expect(AuthorType.getFields()).to.have.property('email')
      expect(AuthorType.getFields().email.type).to.deep.equals(GraphQLString)
    })
    it('should have avatar field of type String', () => {
      expect(AuthorType.getFields()).to.have.property('avatar')
      expect(AuthorType.getFields().avatar.type).to.deep.equals(GraphQLString)
    })
    it('should have bio field of type String', () => {
      expect(AuthorType.getFields()).to.have.property('bio')
      expect(AuthorType.getFields().bio.type).to.deep.equals(GraphQLString)
    })
    it('should have admin field of type String', () => {
      expect(AuthorType.getFields()).to.have.property('admin')
      expect(AuthorType.getFields().admin.type).to.deep.equals(GraphQLString)
    })
    it('should have active field of type String', () => {
      expect(AuthorType.getFields()).to.have.property('active')
      expect(AuthorType.getFields().active.type).to.deep.equals(GraphQLString)
    })
    it('should have location field of type AuthorLocationType', () => {
      expect(AuthorType.getFields()).to.have.property('location')
      expect(AuthorType.getFields().location.type).to.deep.equals(AuthorLocationType)
    })
    it('should have notif field of type AuthorNotifType', () => {
      expect(AuthorType.getFields()).to.have.property('notif')
      expect(AuthorType.getFields().notif.type).to.deep.equals(AuthorNotifType)
    })
    it('should have firstTime field of type String', () => {
      expect(AuthorType.getFields()).to.have.property('firstTime')
      expect(AuthorType.getFields().firstTime.type).to.deep.equals(GraphQLString)
    })
    it('should have deleted field of type String', () => {
      expect(AuthorType.getFields()).to.have.property('deleted')
      expect(AuthorType.getFields().deleted.type).to.deep.equals(GraphQLString)
    })
    it('should have pushNotif field of type AuthorPushNotifType', () => {
      expect(AuthorType.getFields()).to.have.property('pushNotif')
      expect(AuthorType.getFields().pushNotif.type).to.deep.equals(AuthorPushNotifType)
    })
    it('should have lastActivityCheck field of type AuthorLastActivityCheckType', () => {
      expect(AuthorType.getFields()).to.have.property('lastActivityCheck')
      expect(AuthorType.getFields().lastActivityCheck.type).to.deep.equals(AuthorLastActivityCheckType)
    })
    it('should have storage field of type AuthorStorageType', () => {
      expect(AuthorType.getFields()).to.have.property('storage')
      expect(AuthorType.getFields().storage.type).to.deep.equals(AuthorStorageType)
    })
    it('should have plan field of type AuthorPlanType', () => {
      expect(AuthorType.getFields()).to.have.property('plan')
      expect(AuthorType.getFields().plan.type).to.deep.equals(AuthorPlanType)
    })
    it('should have stories field', () => {
      expect(AuthorType.getFields()).to.have.property('stories') //TODO: type check
    })
    it('should have follow field of type String', () => {
      expect(AuthorType.getFields()).to.have.property('follow')
      expect(AuthorType.getFields().follow.type).to.deep.equals(GraphQLString)
    })
    it('should have following field', () => {
      expect(AuthorType.getFields()).to.have.property('following') //TODO: type check
    })
    it('should have followers field', () => {
      expect(AuthorType.getFields()).to.have.property('followers') //TODO: type check
    })

    describe('stories resolver', () => {
      const stories = AuthorType.getFields().stories.resolve
      it('should work', async () => {
        let user = authors[0]
        let author = authors[1]
        let args = {}
        let req = {user: author}
        let response = await stories(user, args, req)

        response.should.have.property('limit').and.have.type('number')
        response.should.have.property('page').and.have.type('number')
        response.should.have.property('pages').and.have.type('number')
        response.should.have.property('docs')
        expect(response.docs).to.be.an('array').that.is.not.empty
      })
    })

    describe('following resolver', () => {
      const following = AuthorType.getFields().following.resolve
      it('should work', async () => {
        let user = authors[0]
        let args = {}
        let response = await following(user, {})

        response.should.have.property('limit').and.have.type('number')
        response.should.have.property('page').and.have.type('number')
        response.should.have.property('pages').and.have.type('number')
        response.should.have.property('docs')
        expect(response.docs).to.be.an('array').that.is.not.empty
      })
    })

    describe('followers resolver', () => {
      const followed = AuthorType.getFields().followers.resolve
      it('should work', async () => {
        let user = authors[0]
        let args = {}
        let response = await followed(user, {})

        response.should.have.property('limit').and.have.type('number')
        response.should.have.property('page').and.have.type('number')
        response.should.have.property('pages').and.have.type('number')
        response.should.have.property('docs')
        expect(response.docs).to.be.an('array').that.is.not.empty
      })
    })
  })

  describe('AuthorLastActivityCheckType', () => {
    it('should have collaboration field of type String', () => {
      expect(AuthorLastActivityCheckType.getFields()).to.have.property('collaboration')
      expect(AuthorLastActivityCheckType.getFields().collaboration.type).to.deep.equals(GraphQLString)
    })
    it('should have social field of type String', () => {
      expect(AuthorLastActivityCheckType.getFields()).to.have.property('social')
      expect(AuthorLastActivityCheckType.getFields().social.type).to.deep.equals(GraphQLString)
    })
    it('should have timeline field of type String', () => {
      expect(AuthorLastActivityCheckType.getFields()).to.have.property('timeline')
      expect(AuthorLastActivityCheckType.getFields().timeline.type).to.deep.equals(GraphQLString)
    })
  })

  describe('AuthorLocationType', () => {
    it('should have name field of type String', () => {
      expect(AuthorLocationType.getFields()).to.have.property('name')
      expect(AuthorLocationType.getFields().name.type).to.deep.equals(GraphQLString)
    })
    it('should have lon field of type String', () => {
      expect(AuthorLocationType.getFields()).to.have.property('lon')
      expect(AuthorLocationType.getFields().lon.type).to.deep.equals(GraphQLString)
    })
    it('should have lat field of type String', () => {
      expect(AuthorLocationType.getFields()).to.have.property('lat')
      expect(AuthorLocationType.getFields().lat.type).to.deep.equals(GraphQLString)
    })
  })

  describe('AuthorPushNotifType', () => {
    it('should have newStoryShare field of type String', () => {
      expect(AuthorPushNotifType.getFields()).to.have.property('newStoryShare')
      expect(AuthorPushNotifType.getFields().newStoryShare.type).to.deep.equals(GraphQLString)
    })
    it('should have newStoryPublic field of type String', () => {
      expect(AuthorPushNotifType.getFields()).to.have.property('newStoryPublic')
      expect(AuthorPushNotifType.getFields().newStoryPublic.type).to.deep.equals(GraphQLString)
    })
    it('should have newFollower field of type String', () => {
      expect(AuthorPushNotifType.getFields()).to.have.property('newFollower')
      expect(AuthorPushNotifType.getFields().newFollower.type).to.deep.equals(GraphQLString)
    })
    it('should have newComment field of type String', () => {
      expect(AuthorPushNotifType.getFields()).to.have.property('newComment')
      expect(AuthorPushNotifType.getFields().newComment.type).to.deep.equals(GraphQLString)
    })
  })

  describe('AuthorNotifType', () => {
    it('should have collaboration field with nested type and fields', () => {
      expect(AuthorNotifType.getFields()).to.have.property('collaboration')
    })
    it('collaboration should have field userLeavesStory of type String', () => {
      let collaboration = AuthorNotifType.getFields().collaboration.type.getFields()
      expect(collaboration).to.have.property('userLeavesStory')
      expect(collaboration.userLeavesStory.type).to.deep.equals(GraphQLString)
    })
    it('collaboration should have field removedFromStory of type String', () => {
      let collaboration = AuthorNotifType.getFields().collaboration.type.getFields()
      expect(collaboration).to.have.property('removedFromStory')
      expect(collaboration.removedFromStory.type).to.deep.equals(GraphQLString)
    })
    it('collaboration should have field storyUpdates of type String', () => {
      let collaboration = AuthorNotifType.getFields().collaboration.type.getFields()
      expect(collaboration).to.have.property('storyUpdates')
      expect(collaboration.storyUpdates.type).to.deep.equals(GraphQLString)
    })
    it('collaboration should have field newCollaborator of type String', () => {
      let collaboration = AuthorNotifType.getFields().collaboration.type.getFields()
      expect(collaboration).to.have.property('newCollaborator')
      expect(collaboration.newCollaborator.type).to.deep.equals(GraphQLString)
    })
    it('collaboration should have field invitations of type String', () => {
      let collaboration = AuthorNotifType.getFields().collaboration.type.getFields()
      expect(collaboration).to.have.property('invitations')
      expect(collaboration.invitations.type).to.deep.equals(GraphQLString)
    })
    // social
    it('should have social field with nested type and fields', () => {
      expect(AuthorNotifType.getFields()).to.have.property('social')
    })
    it('social should have field newFollower of type String', () => {
      let social = AuthorNotifType.getFields().social.type.getFields()
      expect(social).to.have.property('newFollower')
      expect(social.newFollower.type).to.deep.equals(GraphQLString)
    })
    it('social should have field comments of type String', () => {
      let social = AuthorNotifType.getFields().social.type.getFields()
      expect(social).to.have.property('comments')
      expect(social.comments.type).to.deep.equals(GraphQLString)
    })
    it('social should have field favoriteYourStory of type String', () => {
      let social = AuthorNotifType.getFields().social.type.getFields()
      expect(social).to.have.property('favoriteYourStory')
      expect(social.favoriteYourStory.type).to.deep.equals(GraphQLString)
    })
    it('social should have field sharedStory of type String', () => {
      let social = AuthorNotifType.getFields().social.type.getFields()
      expect(social).to.have.property('sharedStory')
      expect(social.sharedStory.type).to.deep.equals(GraphQLString)
    })
    it('social should have field friendStoryUpdates of type String', () => {
      let social = AuthorNotifType.getFields().social.type.getFields()
      expect(social).to.have.property('friendStoryUpdates')
      expect(social.friendStoryUpdates.type).to.deep.equals(GraphQLString)
    })
    it('social should have field friendNewStory of type String', () => {
      let social = AuthorNotifType.getFields().social.type.getFields()
      expect(social).to.have.property('friendNewStory')
      expect(social.friendNewStory.type).to.deep.equals(GraphQLString)
    })
    it('social should have field newFriend of type String', () => {
      let social = AuthorNotifType.getFields().social.type.getFields()
      expect(social).to.have.property('newFriend')
      expect(social.newFriend.type).to.deep.equals(GraphQLString)
    })
  })

  describe('AuthorProfileType', () => {
    it('should have id field of type ID', () => {
      expect(AuthorProfileType.getFields()).to.have.property('id')
      expect(AuthorProfileType.getFields().id.type).to.deep.equals(GraphQLID)
    })
    it('should have name field of type string', () => {
      expect(AuthorProfileType.getFields()).to.have.property('name')
      expect(AuthorProfileType.getFields().name.type).to.deep.equals(GraphQLString)
    })
    it('should have avatar field of type string', () => {
      expect(AuthorProfileType.getFields()).to.have.property('avatar')
      expect(AuthorProfileType.getFields().avatar.type).to.deep.equals(GraphQLString)
    })
    it('should have bio field of type string', () => {
      expect(AuthorProfileType.getFields()).to.have.property('bio')
      expect(AuthorProfileType.getFields().bio.type).to.deep.equals(GraphQLString)
    })
    it('should have username field of type string', () => {
      expect(AuthorProfileType.getFields()).to.have.property('username')
      expect(AuthorProfileType.getFields().username.type).to.deep.equals(GraphQLString)
    })
    it('should have followers field of type string', () => {
      expect(AuthorProfileType.getFields()).to.have.property('followers')
      expect(AuthorProfileType.getFields().followers.type).to.deep.equals(GraphQLInt)
    })
    it('should have following field of type string', () => {
      expect(AuthorProfileType.getFields()).to.have.property('following')
      expect(AuthorProfileType.getFields().following.type).to.deep.equals(GraphQLInt)
    })
  })

})
