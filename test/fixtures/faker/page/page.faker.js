// models
import { Page } from '../../../../src/models/page'
// faker
import faker from 'faker'
// utils
import uuid from 'node-uuid'
import { ObjectId } from 'mongodb'
import utils from '../../../../src/lib/utils'

const now = new Date()

/**
 * Default content values
 */
const defaultContentValues = () => {
  const obj = {};
  [ 'text', 'image', 'gallery', 'recording', 'audio', 'gif', 'video' ].forEach(item => {
    let prop = {
      [item]: {
        n: item === 'text' ? 1 : 0
      }
    }
    Object.assign(obj, prop)
  })
  return obj
}


/**
 * Page faker
 *
 * factory faker used to make fake pages with content
 *
 * @param {object} contentProps content argument
 * @param {number} [n=1] number of pages
 * @param {string} [title=faker.lorem.words(2)] page title
 * @param {string} [author=ObjectId()] page author
 * @param {string} [status='private'] page status
 * @param {boolean} [deleted=false] is page deleted
 * @param {date} [deletedAt=null] page deleted at
 * @param {boolean} [active=true] page active status
 * @param {string} [matchId=uuid.v1()] page match ID
 * @returns {promise[]}
 */
const pageFaker = async (
  // destructured page arg(s) with default values
  {
    n = 1,
    id,
    title = faker.lorem.words(2),
    author,
    status = 'private',
    deleted = false,
    deletedAt,
    created,
    updated,
    active = true,
    matchId = uuid.v1(),
    single = false
  },
  // content arg
  contentProps
) => {
  const slug = title.replace(' ', '-');
  const now = new Date()
  const pages = [...Array(n)].map(_item => {
    return Page.create({
      _id: id ? id : ObjectId(),
      title,
      slug,
      author: author ? author : ObjectId(),
      status,
      dateFrom: new Date(),
      dateTo: new Date(),
      theme: {
        cover: faker.image.nature()
      },
      deleted,
      deletedAt: deletedAt ? deletedAt : null,
      created: created ? created : now,
      updated: updated ? updated : now,
      active,
      place: {
        name: faker.address.city(),
        lon: faker.address.longitude(),
        lat: faker.address.latitude()
      },
      matchId,
      content: contentMakerFaker(utils.replaceObjProps(defaultContentValues(), contentProps))
    })
  })
  if (single) {
    return await pages[0]
  }
  return await Promise.all(pages)
}



/**
 * create array of various content based on argument props
 *
 * @param {object} { text, image, audio, recording, gif }
 * @returns {array}
 */
export const contentMakerFaker = ({ text, image, audio, recording, gif, video, gallery }) => {
  return [
    ...textContent(text),
    ...imageContent(image),
    ...audioContent(audio),
    ...recordingContent(recording),
    ...gifContent(gif),
    ...videoContent(video),
    ...galleryContent(gallery)
  ]
}

/**
 * create text content
 */
export const textContent = ({
  n = 1,
  matchId,
  contentId
}) => {
  return [...Array(n)].map(_item => {
    return {
      contentId: contentId ? contentId : uuid.v1(),
      created: now,
      updated: now,
      text: faker.lorem.sentences(4),
      type: 'text',
      style: 'normal',
      matchId: matchId ? matchId : uuid.v1()
    }
  })
}

/**
 * create image content
 */
export const imageContent = ({
  n = 1,
  size = 120000,
  matchId,
  contentId
}) => {
  return [...Array(n)].map(_item => {
    return {
      contentId: contentId ? contentId : uuid.v1(),
      image: faker.image.city(),
      url: faker.internet.url(),
      created: now,
      updated: now,
      place: {
        lat: faker.address.latitude(),
        lon: faker.address.longitude(),
        name: faker.address.city(),
        addr: faker.address.streetAddress()
      },
      matchId: matchId ? matchId : uuid.v1(),
      date: now,
      caption: faker.lorem.words(3),
      size,
      type: 'image'
    }
  })
}

/**
 * create gallery sections
 */
export const gallerySectionsMaker = ({
    nImages,
    nSections
  }) => {
  return [...Array(nSections)].map((_item, index) => {
    return {
      id: uuid.v1(),
      itemProportionWidth: faker.random.number(550),
      itemProportionHeight: faker.random.number(550),
      position: index,
      images: [...Array(nImages)].map(_image => {
        return {
          image: faker.image.food(),
          id: uuid.v1(),
          size: faker.random.number(300000)
        }
      })
    }
  })
}

/**
 * create gallery content
 */
export const galleryContent = ({
  n = 1,
  matchId,
  contentId,
  sectionsArgs = { nImages: 1, nSections: 1 }
}) => {
    const sections = gallerySectionsMaker(sectionsArgs)
    return [...Array(n)].map(_item => {
      return {
        contentId: contentId ? contentId : uuid.v1(),
        place: {
          lat: faker.address.latitude(),
          lon: faker.address.longitude(),
          name: faker.address.city(),
          addr: faker.address.streetAddress()
        },
        matchId: matchId ? matchId : uuid.v1(),
        date: now,
        caption: faker.lorem.words(3),
        size: utils.calculateGallerySectionsSize(sections),
        created: now,
        sections,
        updated: now,
        type: 'gallery'
      }
    })

}

/**
 * create audio content
 */
export const audioContent = ({
  n = 1,
  size = 120000,
  matchId,
  contentId
}) => {
  return [...Array(n)].map(_item => {
    return {
      contentId: contentId ? contentId : uuid.v1(),
      image: faker.image.city(),
      url: faker.internet.url(),
      duration: faker.random.number(1000),
      title: faker.lorem.words(2),
      created: now,
      updated: now,
      place: {
        lat: faker.address.latitude(),
        lon: faker.address.longitude(),
        name: faker.address.city(),
        addr: faker.address.streetAddress()
      },
      matchId: matchId ? matchId : uuid.v1(),
      date: now,
      caption: 'caption',
      size,
      type: 'audio'
    }
  })
}

/**
 * create redcording content
 */
export const recordingContent = ({
  n = 1,
  size = 120000,
  matchId,
  contentId
}) => {
  return [...Array(n)].map(_item => {
    return {
      contentId: contentId ? contentId : uuid.v1(),
      image: faker.image.city(),
      url: faker.internet.url(),
      duration: faker.random.number(1000),
      title: faker.lorem.words(2),
      created: now,
      updated: now,
      place: {
        lat: faker.address.latitude(),
        lon: faker.address.longitude(),
        name: faker.address.city(),
        addr: faker.address.streetAddress()
      },
      matchId: matchId ? matchId : uuid.v1(),
      date: now,
      caption: faker.lorem.words(3),
      size,
      type: 'recording'
    }
  })
}

/**
 * create gif content
 */
export const gifContent = ({
  n = 1,
  size = 120000,
  matchId,
  contentId
}) => {
  return [...Array(n)].map(_item => {
    return {
      contentId: contentId ? contentId : uuid.v1(),
      image: faker.image.city(),
      url: faker.internet.url(),
      created: now,
      updated: now,
      place: {
        lat: faker.address.latitude(),
        lon: faker.address.longitude(),
        name: faker.address.city(),
        addr: faker.address.streetAddress()
      },
      matchId: matchId ? matchId : uuid.v1(),
      date: now,
      caption: faker.lorem.words(3),
      size,
      type: 'gif'
    }
  })
}

/**
 * create video content
 */
export const videoContent = ({
  n = 1,
  size = 120000,
  matchId,
  contentId
}) => {
  return [...Array(n)].map(_item => {
    return {
      contentId: contentId ? contentId : uuid.v1(),
      height: 1080,
      width: 1920,
      duration: {
        seconds: 60,
        raw: '00:01:00.10'
      },
      videoId: uuid.v1(),
      image: faker.image.city(),
      url: faker.image.fashion(),
      place: {
        lat: faker.address.latitude(),
        lon: faker.address.longitude(),
        name: faker.address.city(),
        addr: faker.address.streetAddress()
      },
      matchId: matchId ? matchId : uuid.v1(),
      date: now,
      caption: faker.lorem.words(3),
      size,
      type: 'video'
    }
  })
}

export default pageFaker
