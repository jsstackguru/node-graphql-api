/**
 * @file Response middleware
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

// export const getSelfLink = async (req) => {
//   let baseUrl = req.connection.encrypted ? 'https://' : 'http://'
//   baseUrl += req.headers.host
//   let params = req.params
//   return baseUrl + server.router.render(req.route.name, params, params)
// }

/**
 * Middleware for API response i.e. headers, versions
 * This is for V3
 * @param {Object} req Request
 * @param {Object} req Response
 * @param {Function} next Callback function
 */
const sendV3 = (req, res, next) => {
  let baseUrl = req.connection.encrypted ? 'https://' : 'http://'
  baseUrl += req.headers.host

  let response = {}

  response.links = {
    self: baseUrl + req.url
  }

  res.response = response
  return next()
}

/**
 * Reponse for fetching data
 * @param {Object} req Request
 * @param {Object} req Response
 * @param {Object} data Data for response
 */
const fetchingResponseV3 = (req, res, data) => {
  res.send({
    links: {
      self: res.response.links.self
    },
    data: data || []
  })
}

/**
 * Paginate response for V3
 *
 * @param {Function} req Request
 * @param {Function} res Response
 * @param {Object} data
 */
const paginateV3 = (req, res, data) => {
  res.paginate.sendPaginated(data)
}

module.exports = {
  fetchingResponseV3,
  paginateV3,
  sendV3
}
