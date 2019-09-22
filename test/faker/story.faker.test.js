//  assertions
import { expect } from 'chai'

// models
import { Story } from '../../src/models/story'

// faker
import storyFaker from '../fixtures/faker/story/story.faker'

// after hooks
import { initAfter } from '../setup'

// libs
import {ObjectId} from 'mongodb'

describe('story faker', () => {
  const expectedKeys = ['_id', 'theme', 'share', 'pages', 'views', 'active', 'author', 'title', 'slug', 'status', 'deleted', 'banInPublic', 'featured', 'collaborators', 'created', 'updated']

  afterEach(async () => {
    await initAfter()
  })

  it('should create stories with default params if no args', async () => {
    await storyFaker({})

    let stories = await Story.find({})

    expect(stories).to.be.an('array').and.have.lengthOf(1)
    stories.forEach(story => {
      expectedKeys.forEach(key => {
        expect(story[key]).to.exist
      })
    })
  })

  it('should create stories with only number of story arg', async () => {
    let storyNum = 3
    await storyFaker({n: storyNum})

    let stories = await Story.find({})
    expect(stories).to.be.an('array').and.have.lengthOf(storyNum)
    stories.forEach(story => {
      expectedKeys.forEach(key => {
        expect(story[key]).to.exist
      })
    })
  })

  it('should create stories with all args', async () => {
    let collaborator1 = {edit: true, author: ObjectId()}
    let collaborator2 = {edit: false, author: ObjectId()}
    let pages = [ObjectId(), ObjectId()]
    let author = ObjectId()
    let params = {
      n: 2,
      author,
      status: 'private',
      views: 12,
      collaborators: [collaborator1, collaborator2],
      pages
    }
    await storyFaker(params)

    let stories = await Story.find({})
    expect(stories).to.be.an('array').and.have.lengthOf(params.n)
    stories.forEach(story => {
      expect(story.collaborators).to.have.lengthOf(2)
      expect(story.pages).to.have.lengthOf(2)
      expectedKeys.forEach(key => {
        expect(story[key]).to.exist
      })
    })
  })


})
