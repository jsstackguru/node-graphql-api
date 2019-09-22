
// GQL objects types
import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLInt
} from 'graphql'


// Dynamically makes paginate GQL object type
export const GQLPaginateType = (name, type) => {
  return new GraphQLObjectType({
    name: name,
    fields: {
      docs: { type: new GraphQLList(type) },
      total: { type: GraphQLInt },
      limit: { type: GraphQLInt },
      page: { type: GraphQLInt },
      pages: { type: GraphQLInt },
    }
  })
}

// Dynamically change paginate options
export const paginateOptions = (page, limit, sort, select) => {
  return {
    page: page ? page : 1,
    limit: limit ? limit : 10,
    sort: sort,
    select: select ? select : '',
    // populate: 'author',
    lean: true
  }
}
// split string where ":" is, and make it to object e.g. "a:1" => {a: 1}
export const sortConverter = (sort) => {

  if (sort) {
    // validation for mongoose sort options
    let rules = {'asc': true, 'desc': true, 'ascending': true, 'descending': true, '1': true, '-1': true}
    let key = sort.split(':')[0]
    let value = sort.split(':')[1]
    // if correct value is inputed return object, otherwise undefined
    return rules[value] ? { [ key ]: value } : undefined
  }
  return
}

/**
 * Split sorting parameters to prop, subProp and order, eg. "author.name:desc" => {prop: author, subProp: name, order: desc}
 *
 * @param {string} sort
 * @returns {Object}
 */
export const splitSortParams = (sort) => {

  let order, prop, subProp

  if (sort && sort.includes(':')) {
    order = sort.split(':')[1]
    let tempProp = sort.split(':')[0]
    prop = tempProp.includes('.') ? tempProp.split('.')[0] : tempProp
    subProp = tempProp.includes('.') ? tempProp.split('.')[1] : undefined
  }
  return {
    order, prop, subProp
  }
}


/**
 * Filter content, return right filter values based on input
 *
 * @param {array} clientFilter
 * @returns {array}
 */
export const filterContent = (clientFilter) => {

  let types = {
    audios: ['audio', 'recording'],
    videos: ['video', 'gif'],
    images: ['image', 'gallery']
  }

  let final = ['audios', 'videos', 'images']
    .filter(item => clientFilter.includes(item))
    .map(c => types[c])
    .reduce((prev, curr) => prev.concat(curr), [])

  return final
}

