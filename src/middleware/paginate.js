/**
 * @file Paginate middleware
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */
const extend = require('extend')

module.exports = (server, opts) => {
  const defaults = {
    paramsNames: {
      number: 'page',
      limit: 'size'
    },
    defaults: {
      number: 1,
      limit: 50
    },
    numbersOnly: false,
    hostname: true
  }
  opts = extend(true, defaults, opts)

  return (req, res, next) => {
    let page = req.params[opts.paramsNames.number] ? req.params[opts.paramsNames.number].number : defaults.defaults.number
    let perPage = req.params[opts.paramsNames.number] ? req.params[opts.paramsNames.number].size : defaults.defaults.limit
    req.paginate = {
      page: parseInt(page),
      perPage: parseInt(perPage)
    }

    let isPerPageSet = req.params[opts.paramsNames.number] && typeof req.params[opts.paramsNames.number].limit !== 'undefined'

    delete req.params[opts.paramsNames.number]

    page = req.paginate.number
    perPage = req.paginate.limit || 20
    let params = {}
    let baseUrl = ''

    if (opts.hostname) {
      baseUrl = req.connection.encrypted ? 'https://' : 'http://'
      baseUrl += req.headers.host
    }

    // Copy the params object
    extend(params, req.params)

    // Add perPage param to params obejct in case it's been set originally
    if (isPerPageSet) {
      params[opts.paramsNames.limit] = perPage
    }

    let paginate = {}

    /**
     * Generates the first, prev, next, last links
     * @param  {Integer} [count]    The total number of elements to paginate. If no count is provided, no last page is added
     * @return {Object}             A Hash like object with the links name as key and links as values
     */
    paginate.getLinks = (count) => {
      let links = {}

      if (opts.numbersOnly) {
        // The current page is not the first one so we generate the first and prev links
        if (page !== defaults.defaults.number) {
          links.prev = page - 1
          links.first = defaults.defaults.number
        }
        if (count !== undefined && page * perPage < count) {
          links.last = Math.floor(count / perPage) + defaults.defaults.number
        }
        if (count === undefined || page * perPage < count) {
          links.next = page + 1
        }

        return links
      }

      // The current page is not the first one so we generate the first and prev links
      if (page !== defaults.defaults.number) {
        params.number = defaults.defaults.number
        links.first = baseUrl + server.router.render(req.route.name, params, params)

        params.number = page - 1
        links.prev = baseUrl + server.router.render(req.route.name, params, params)

        params.number = page
        links.self = baseUrl + server.router.render(req.route.name, params, params)
      }
      if (count !== undefined && page * perPage < count) {
        params.number = count % perPage === 0 ? count / perPage : Math.floor(count / perPage + defaults.defaults.number)
        links.last = baseUrl + server.router.render(req.route.name, params, params)

        params.number = page
        links.self = baseUrl + server.router.render(req.route.name, params, params)
      }

      if (count === undefined || page * perPage < count) {
        params.number = page + 1
        links.next = baseUrl + server.router.render(req.route.name, params, params)
      }

      return links
    }

    /**
     * Generates the first, prev, next, last links
     * @param  {Integer}    count  The total number of elements to paginate
     * @return {undefined}
     */
    paginate.addLinks = (count) => {
      var links = paginate.getLinks(count)
      links = Object.keys(links).map(function (key) {
        return '<' + links[key] + '>; rel="' + key + '"'
      })
      res.header('Link', links.join(', '))
    }

    /**
     * Generates a response, containing the given data and links to the other pages
     * @param  {Array<Object>} data     an array of Objects
     * @param  {Integer} [count]        the total count of data. If count is not provided, the link to the last page won't be generated
     * @return {Object}                 an Object containing the data, and links to the other pages
     */
    paginate.getResponse = (data, count) => {
      return {
        'data': data,
        'links': res.paginate.getLinks(count),
        'meta': {
          'total-pages': paginate.getMaxPages(count)
        }
      }
    }

    /**
     * Generates a paginated response. The data will be paginated, and links to the other pages will be generated
     * @param  {Array<Object>}  an array of Objects, to be paginated
     * @return {Object}         an Object containing the paginated data, and links to the other pages
     */
    paginate.getPaginatedResponse = (data) => {
      var index = (page - 1) * perPage

      if (data.length <= index || page <= 0) {
        return {
          error: 'page ' + page + ' not found'
        }
      }

      paginate.addLinks(data)

      return paginate.getResponse(data.slice(index, index + perPage), data.length)
    }

    /**
     * Sends a response, generated by the getResponse() method
     * @param  {Array<Object>} data     an array of Objects, to be paginated
     * @param  {Integer} [count]        the total count of data. If count is not provided, the link to the last page won't be generated
     */
    paginate.send = (data, count) => {
      res.send(paginate.getResponse(data, count))
    }

    /**
     * Sends a paginated response, generated by the getPaginatedResponse() method
     * @param  {Array<Object>} data     an array of Objects, to be paginated
     */
    paginate.sendPaginated = (data) => {
      var paginatedResponse = paginate.getPaginatedResponse(data)

      if (paginatedResponse.error) {
        res.status(404)
      }
      res.send(paginatedResponse)
    }

    /**
     * Get maximum number of pages
     * @param {Integer} count
     * @return {Integer}
     */
    paginate.getMaxPages = (count) => {
      return (count > perPage) ? Math.round(count / perPage) : 1
    }

    res.paginate = paginate
    next()
  }
}
