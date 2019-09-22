//  assertions
import { expect } from 'chai'

// models
import { Author } from '../../src/models/author'

// handles
import syncHndl from '../../src/handles/synchronize.handles'

// faker
import authorFaker from '../fixtures/faker/author/author.faker'
import pageFaker from '../fixtures/faker/page/page.faker'
import storyFaker from '../fixtures/faker/story/story.faker'

// utils
import { ObjectId } from 'mongodb'

// hooks
import { initAfter } from '../setup/'

describe('synchronization tests', () => {
  const authorId = ObjectId()
  // author
  const authorParams = {
    id: authorId,
    username: 'Kostaricic',
  }
  // pages
  const page1 = { // in story1
    pageParams: {
      n: 1,
      id: ObjectId(),
      author: authorId,
      title: 'my page title',
      status: 'public',
      matchId: 'customMatchId'
    },
    contentParams: {
      image: {
        n: 1,
        size: 123999,
      },
      audio: {
        n: 1,
        size: 342984,
      },
    }
  }
  const page2 = { // in story2
    pageParams: {
      id: ObjectId(),
      title: 'page 2'
    }
  }
  const page3 = { // in story3
    pageParams: {
      id: ObjectId(),
      title: 'page 3'
    }
  }
  const page4 = { // in story4
    pageParams: {
      id: ObjectId(),
      title: 'page 4'
    }
  }
  const page5 = { // in story4 - not to be foun durin sync
    pageParams: {
      id: ObjectId(),
      title: 'page 5',
      created: new Date('2019-03-04')
    }
  }
  // storys
  const story1 = {
    id: ObjectId(),
    author: authorId,
    pages: [page1.pageParams.id, page2.pageParams.id]
  }
  const story2 = {
    id: ObjectId(),
    author: authorId,
    pages: [page3.pageParams.id, page4.pageParams.id]
  }
  const story3 = {
    id: ObjectId(),
    author: authorId,
    pages: [ObjectId()],
    deleted: true,
    deletedAt: new Date('2019-03-09')
  }

  const pages = [page1, page2, page3, page4, page5]
  const stories = [story1, story2, story3]

  before(async () => {
    // create author
    await authorFaker(authorParams)
    // create pages
    for (let page of pages) {
      await pageFaker(page.pageParams, page.contentParams)
    }
    // create stories
    for (let story of stories) {
      await storyFaker(story)
    }
  })

  after(async () => {
    await initAfter()
  })

  it('should not return data, if syncDate is bigger', async () => {
    const author = await Author.findById(authorId)

    const syncDate = new Date()
    const plan = {
      level: 'BASIC',
      expires: new Date()
    }
    const res = await syncHndl.synchronize(author, syncDate, null, plan)

    let keys = [
      'stories',
      'deletedStories',
      'pages',
      'deletedPages',
      'groups',
    ]
    keys.forEach(key => {
      expect(res[key]).to.be.an('array').and.have.lengthOf(0)
    })

  })

  it('should return all docs regarding syncDate', async () => {
    const author = await Author.findById(authorId)

    let syncDate = new Date('2019-03-08')
    let storyIds = stories.map(r => r.id)
    let plan = {
      level: 'BASIC',
      expires: new Date()
    }
    let res = await syncHndl.synchronize(author, syncDate, storyIds, plan)

    // stories
    let expectedStoryIds = JSON.stringify([story1.id, story2.id].sort())
    let actualStoryIds = JSON.stringify(res.stories.map(r => r.id).sort())
    expect(res.stories).to.have.lengthOf(2)
    expect(expectedStoryIds).to.equals(actualStoryIds)
    // deleted stories
    let expectedDeletedStoryIds = JSON.stringify([story3.id])
    let actualDeletedStoryIds = JSON.stringify(res.deletedStories.map(r => r.id))
    expect(res.deletedStories).to.have.lengthOf(1)
    expect(expectedDeletedStoryIds).to.equals(actualDeletedStoryIds)
    // pages
    let expectedPagesIds = JSON.stringify([page1.pageParams.id, page2.pageParams.id, page3.pageParams.id, page4.pageParams.id].sort())
    let actualPagesIds = JSON.stringify(res.pages.map(p => p.id).sort())
    expect(res.pages).to.have.lengthOf(4)
    expect(expectedPagesIds).to.equals(actualPagesIds)
    // deleted pages
    expect(res.deletedPages).to.have.lengthOf(0)
    // groups
    expect(res.groups).to.have.lengthOf(0)

  })

})
