//  assertions
import chai from 'chai'
import { assert } from 'chai'
import should from 'should'
import { expect } from 'chai'
// models
import { Author } from '../../src/models/author'
import { Page } from '../../src/models/page'
// faker
import pageFaker, {
  replaceObjProps,
  contentMakerFaker,
  textContent,
  imageContent,
  audioContent,
  recordingContent,
  gifContent,
  videoContent,
  gallerySectionsMaker,
  galleryContent
} from '../fixtures/faker/page/page.faker'
// utils
import { ObjectId } from 'mongodb'
// after hooks
import { initAfter } from '../setup/'

describe('page faker handlers', () => {

  describe('contentMakerFaker', () => { //TODO: finish this
    it('should return list of all content types', () => {
      let args = {
        text: {},
        image: {},
        audio: {},
        recording: {},
        gif: {},
        video: {},
        gallery: {}
      }
      let result = contentMakerFaker(args)

      expect(result).to.be.an('array').and.have.lengthOf(7)
      const mapTypes = result.map(item => item.type).sort()
      const expectedTypes = Object.keys(args).sort()
      expect(mapTypes).to.deep.equals(expectedTypes)

    })
  })

  describe('sections maker', () => {
    const expectedSectionKeys = [
      'id', 'itemProportionWidth', 'itemProportionHeight', 'position', 'images'
    ]
    const expectedImagesKeys = [
      'image', 'id', 'size'
    ]

    it('should create 1 section if no args provided', () => {
      let args = {}
      let sections = gallerySectionsMaker(args)

      expect(sections).to.be.an('array').and.have.lengthOf(1)

      sections.forEach(section => {
        expectedSectionKeys.forEach(key => {
          expect(section[key]).to.exist
        })
        section.images.forEach(image => {
          expectedImagesKeys.forEach(key => {
            expect(image[key]).to.exist
          })
        })
      })
    })

    it('should create section with custom args', () => {
      let args = {
        nImages: 3,
        nSections: 2
      }
      let sections = gallerySectionsMaker(args)
      // console.log(JSON.stringify(sections, null, 2))

      expect(sections).to.be.an('array').and.have.lengthOf(args.nSections)

      sections.forEach(section => {
        expectedSectionKeys.forEach(key => {
          expect(section[key]).to.exist
        })
        section.images.forEach(image => {
          expectedImagesKeys.forEach(key => {
            expect(image[key]).to.exist
          })
        })
      })
    })

  })

  describe('textContent', () => {
    const expectedKeys = ['created', 'updated', 'type', 'style', 'contentId', 'matchId']

    it('should create default text content without args', () => {
      let result = textContent({})

      result.forEach(item => {
        expectedKeys.forEach(key => {
          expect(item[key]).to.exist
        })
      })
    })
    it('should create text content with custom args', () => {
      let args = {n: 1, matchId: 'customMatchId'}
      let result = textContent(args)

      result.forEach(item => {
        expectedKeys.forEach(key => {
          expect(item[key]).to.exist
        })
        expect(item['matchId']).to.equal(args.matchId)
      })
    })
    it('should create text content with partial args', () => {
      let args = {n: 3}
      let result = textContent(args)

      expect(result).to.have.lengthOf(args.n)
      result.forEach(item => {
        expectedKeys.forEach(key => {
          expect(item[key]).to.exist
        })
      })
    })
  })

  describe('imageContent', () => {
    const expectedKeys = ['created', 'updated', 'type', 'image', 'contentId', 'matchId', 'size', 'caption', 'place', 'url', 'date']
    const expectedPlaceKeys = ['lat', 'lon', 'name', 'addr']

    it('should create default image content without args', () => {
      let result = imageContent({})

      result.forEach(item => {
        // test place nested keys
        expectedPlaceKeys.forEach(key => {
          expect(item['place'][key]).to.exist
        })
        // test all keys
        expectedKeys.forEach(key => {
          expect(item[key]).to.exist
        })
      })
    })

    it('should create image content with custom args', () => {
      let args = {n: 1, matchId: 'customMatchId', size: 1234567}
      let result = imageContent(args)

      result.forEach(item => {
        // test place nested keys
        expectedPlaceKeys.forEach(key => {
          expect(item['place'][key]).to.exist
        })
        // test all keys
        expectedKeys.forEach(key => {
          expect(item[key]).to.exist
        })
        expect(item['matchId']).to.equals(args['matchId'])
        expect(item['size']).to.equals(args['size'])
      })
    })

    it('should create image content with partial args', () => {
      let args = {n: 3, size: 1234}
      let result = imageContent(args)

      expect(result).to.have.lengthOf(args.n)
      result.forEach(item => {
        // test place nested keys
        expectedPlaceKeys.forEach(key => {
          expect(item['place'][key]).to.exist
        })
        // test all keys
        expectedKeys.forEach(key => {
          expect(item[key]).to.exist
        })
      })
    })
  })

  describe('galleryContent', () => {
    const expectedKeys = [
      'created', 'updated', 'type', 'contentId', 'matchId', 'size', 'caption', 'place', 'sections', 'date']
    const expectedPlaceKeys = ['lat', 'lon', 'name', 'addr']

    it('should create default gif content without args', () => {
      let result = galleryContent({})
      // console.log(JSON.stringify(result, null, 2))

      result.forEach(item => {
        // test place nested keys
        expectedPlaceKeys.forEach(key => {
          expect(item['place'][key]).to.exist
        })
        // test all keys
        expectedKeys.forEach(key => {
          expect(item[key]).to.exist
        })
      })
    })

    it('should create gallery content with custom args', () => {
      let args = {
        n: 2,
        matchId: 'customMatchId',
        sectionsArgs: { nImages: 3, nSections: 2 }
      }
      let result = galleryContent(args)

      expect(result).be.an('array').and.have.lengthOf(args.n)

      result.forEach(item => {
        // test place nested keys
        expectedPlaceKeys.forEach(key => {
          expect(item['place'][key]).to.exist
        })
        // test all keys
        expectedKeys.forEach(key => {
          expect(item[key]).to.exist
        })

        expect(item.matchId).to.equal(args.matchId)
        expect(item.sections).to.be.an('array').and.and.lengthOf(args.sectionsArgs.nSections)

        item.sections.forEach(section => {
          expect(section.images).to.to.an('array').and.have.lengthOf(args.sectionsArgs.nImages)
        })
      })
    })

  })

  describe('audioContent', () => {
    const expectedKeys = ['created', 'updated', 'type', 'image', 'contentId', 'matchId', 'size', 'caption', 'place', 'url', 'date', 'title', 'duration']
    const expectedPlaceKeys = ['lat', 'lon', 'name', 'addr']

    it('should create default audio content without args', () => {
      let result = audioContent({})

      result.forEach(item => {
        // test place nested keys
        expectedPlaceKeys.forEach(key => {
          expect(item['place'][key]).to.exist
        })
        // test all keys
        expectedKeys.forEach(key => {
          expect(item[key]).to.exist
        })
      })
    })

    it('should create audio content with custom args', () => {
      let args = {n: 1, matchId: 'customMatchId', size: 1234567}
      let result = audioContent(args)

      result.forEach(item => {
        // test place nested keys
        expectedPlaceKeys.forEach(key => {
          expect(item['place'][key]).to.exist
        })
        // test all keys
        expectedKeys.forEach(key => {
          expect(item[key]).to.exist
        })
        expect(item['matchId']).to.equals(args['matchId'])
        expect(item['size']).to.equals(args['size'])
      })
    })

    it('should create audio content with partial args', () => {
      let args = {n: 3, size: 1234}
      let result = audioContent(args)

      expect(result).to.have.lengthOf(args.n)
      result.forEach(item => {
        // test place nested keys
        expectedPlaceKeys.forEach(key => {
          expect(item['place'][key]).to.exist
        })
        // test all keys
        expectedKeys.forEach(key => {
          expect(item[key]).to.exist
        })
      })
    })
  })

  describe('recordingContent', () => {
    const expectedKeys = ['created', 'updated', 'type', 'image', 'contentId', 'matchId', 'size', 'caption', 'place', 'url', 'date', 'title', 'duration']
    const expectedPlaceKeys = ['lat', 'lon', 'name', 'addr']

    it('should create default recording content without args', () => {
      let result = recordingContent({})

      result.forEach(item => {
        // test place nested keys
        expectedPlaceKeys.forEach(key => {
          expect(item['place'][key]).to.exist
        })
        // test all keys
        expectedKeys.forEach(key => {
          expect(item[key]).to.exist
        })
      })
    })

    it('should create recording content with custom args', () => {
      let args = {n: 1, matchId: 'customMatchId', size: 1234567}
      let result = recordingContent(args)

      result.forEach(item => {
        // test place nested keys
        expectedPlaceKeys.forEach(key => {
          expect(item['place'][key]).to.exist
        })
        // test all keys
        expectedKeys.forEach(key => {
          expect(item[key]).to.exist
        })
        expect(item['matchId']).to.equals(args['matchId'])
        expect(item['size']).to.equals(args['size'])
      })
    })

    it('should create recording content with partial args', () => {
      let args = {n: 3, size: 1234}
      let result = recordingContent(args)

      expect(result).to.have.lengthOf(args.n)
      result.forEach(item => {
        // test place nested keys
        expectedPlaceKeys.forEach(key => {
          expect(item['place'][key]).to.exist
        })
        // test all keys
        expectedKeys.forEach(key => {
          expect(item[key]).to.exist
        })
      })
    })

  })

  describe('gifContent', () => {
    const expectedKeys = ['created', 'updated', 'type', 'image', 'contentId', 'matchId', 'size', 'caption', 'place', 'url', 'date']
    const expectedPlaceKeys = ['lat', 'lon', 'name', 'addr']

    it('should create default gif content without args', () => {
      let result = gifContent({})

      result.forEach(item => {
        // test place nested keys
        expectedPlaceKeys.forEach(key => {
          expect(item['place'][key]).to.exist
        })
        // test all keys
        expectedKeys.forEach(key => {
          expect(item[key]).to.exist
        })
      })
    })

    it('should create gif content with custom args', () => {
      let args = {n: 1, matchId: 'customMatchId', size: 1234567}
      let result = gifContent(args)

      result.forEach(item => {
        // test place nested keys
        expectedPlaceKeys.forEach(key => {
          expect(item['place'][key]).to.exist
        })
        // test all keys
        expectedKeys.forEach(key => {
          expect(item[key]).to.exist
        })
        expect(item['matchId']).to.equals(args['matchId'])
        expect(item['size']).to.equals(args['size'])
      })
    })

    it('should create gif content with partial args', () => {
      let args = {n: 3, size: 1234}
      let result = gifContent(args)

      expect(result).to.have.lengthOf(args.n)
      result.forEach(item => {
        // test place nested keys
        expectedPlaceKeys.forEach(key => {
          expect(item['place'][key]).to.exist
        })
        // test all keys
        expectedKeys.forEach(key => {
          expect(item[key]).to.exist
        })
      })
    })

  })

  describe('videoContent', () => {
    const expectedKeys = [
      'height', 'width', 'duration', 'type', 'image', 'contentId', 'videoId', 'matchId', 'size', 'caption', 'place', 'url', 'date'
    ]
    const expectedPlaceKeys = ['lat', 'lon', 'name', 'addr']
    const expectedDurationKeys = ['seconds', 'raw']

    it('should create default video content without args', () => {
      let result = videoContent({})

      result.forEach(item => {
        // test place nested keys
        expectedPlaceKeys.forEach(key => {
          expect(item['place'][key]).to.exist
        })
        // test duration nested keys
        expectedDurationKeys.forEach(key => {
          expect(item['duration'][key]).to.exist
        })
        // test all keys
        expectedKeys.forEach(key => {
          expect(item[key]).to.exist
        })
      })
    })

    it('should create video content with custom args', () => {
      let args = {n: 1, matchId: 'customMatchId', size: 1234567}
      let result = videoContent(args)

      result.forEach(item => {
        // test place nested keys
        expectedPlaceKeys.forEach(key => {
          expect(item['place'][key]).to.exist
        })
        // test duration nested keys
        expectedDurationKeys.forEach(key => {
          expect(item['duration'][key]).to.exist
        })
        // test all keys
        expectedKeys.forEach(key => {
          expect(item[key]).to.exist
        })
        expect(item['matchId']).to.equals(args['matchId'])
        expect(item['size']).to.equals(args['size'])
      })
    })

    it('should create video content with partial args', () => {
      let args = {n: 3, size: 1234}
      let result = videoContent(args)

      expect(result).to.have.lengthOf(args.n)
      result.forEach(item => {
        // test place nested keys
        expectedPlaceKeys.forEach(key => {
          expect(item['place'][key]).to.exist
        })
        // test duration nested keys
        expectedDurationKeys.forEach(key => {
          expect(item['duration'][key]).to.exist
        })
        // test all keys
        expectedKeys.forEach(key => {
          expect(item[key]).to.exist
        })
      })
    })

  })

})

describe('page faker', () => {
  const expectedKeys = ['_id', 'author', 'theme', 'place', 'content', 'deleted', 'title', 'slug', 'status', 'dateFrom', 'dateTo', 'active', 'matchId', 'created', 'updated'].sort()
  afterEach(async () => {
    await initAfter()
  })

  it('should create pages with default params if no args', async () => {

    await pageFaker({})

    let pages = await Page.find({})
    // console.log(JSON.stringify(pages, null, 2))
    expect(pages).to.be.an('array').and.have.lengthOf(1)

    pages.forEach(page => {
      expectedKeys.forEach(key => {
        expect(page[key]).to.exist
      })
    })
  })

  it('should create pages with only number of pages arg', async () => {
    const params = {n: 4}
    await pageFaker(params)

    let pages = await Page.find({})
    expect(pages).to.be.an('array').and.have.lengthOf(params.n)

    pages.forEach(page => {
      expectedKeys.forEach(key => {
        expect(page[key]).to.exist
      })
    })
  })

  it('should create pages with all args', async () => {

    const pageParams = {
      n: 1,
      author: ObjectId(),
      id: ObjectId(),
      title: 'my page title',
      status: 'public',
      active: false,
      matchId: 'customMatchId'
    }
    const contentParams = {
      text: {
        n: 2,
        contentId: 'hoj',
        matchId: 'mathId'
      },
      image: {
        n: 1,
        size: 123999,
        contentId: 'imageContent',
        matchId: 'imageMatch'
      },
      audio: {
        n: 1,
        size: 342984,
        contentId: 'audioContent',
        matchId: 'audioMatch'
      },
      recording: {
        n: 1,
        matchId: 'recordingMatch',
        contentId: 'recordingConent',
        size: 123399
      },
      video: {
        n: 1,
        matchId: 'videoMatch',
        contentId: 'VideoContent',
        size: 1111
      },
      gif: {
        n: 1,
        contentId: 'contentId',
        matchId: 'matchIdGif',
        size: 24441
      },
      gallery: {
        n: 1,
        matchId: 'galleryMatchId',
        contentId: 'galleryContentId',
        sectionsArgs: {
          nImages: 2,
          nSections: 2
        }
      }
    }

    await pageFaker(pageParams, contentParams)

    let pages = await Page.find({})
    // console.log(JSON.stringify(pages, null, 2))
    expect(pages).to.be.an('array').and.have.lengthOf(pageParams.n)
    let expectedContentKeys = ['text', 'text', 'image', 'audio', 'recording', 'video', 'gif', 'gallery'].sort()

    pages.forEach(page => {
      expectedKeys.forEach(key => {
        expect(page[key]).to.exist
      })
      let contentKeys = page.content.map(content => content.type).sort()
      expect(contentKeys).to.have.lengthOf(8).and.deep.equals(expectedContentKeys)

      // check content
      page['content'].forEach(content => {
        ['contentId', 'matchId'].forEach(key => {
          expect(contentParams[content.type][key]).to.equals(content[key])
        })
      })

      // check page props
      for (let key in pageParams) {
        if (key !== 'n') expect(page[key].toString()).to.equals(pageParams[key].toString())
      }
    })
  })
})
