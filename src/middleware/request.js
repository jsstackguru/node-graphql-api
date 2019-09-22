/**
 * Cors middleware
 * 
 * @param {Function} req Request
 * @param {Function} res Response
 * @param {Function} next Middleware
 */
export const cors = (req, res, next) => {
  //intercepts OPTIONS method
  if ('OPTIONS' === req.method) {
    //respond with 200
    res.sendStatus(200)
  } else {
    next()
  }
}
