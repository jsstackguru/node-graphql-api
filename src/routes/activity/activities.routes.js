// Handles
import activitiesHndl from '../../handles/activities.handles'
// models
import Author from '../../models/author/author.model'
// Services
import utils from '../../lib/utils'
import translate from '../../lib/translate'
import { BadRequest } from '../../lib/errors'

/**
 * Save last activities check
 *
 * @param {function} req
 * @param {function} res
 * @param {function} next
 */
const saveLastActivitiesCheck = async (req, res, next) => {
  try {

    let userId = req.params.id

    // validation for objectid params
    if (!utils.isObjectID(userId)) { // TODO: da li ovo treba, validacija za objId
      throw new BadRequest(translate.__('User Id is not a proper ObjectId'))
    }

    let user = await Author.findOneActiveById(userId, 'throw_err_if_not_found')

    let newActivityCheck = {
      timeline: req.body.timeline,
      social: req.body.social,
      collaboration: req.body.collaboration
    }

    let rules = ['timeline', 'social', 'collaboration']

    rules.forEach(rule => {

      let minDate = new Date(user.lastActivityCheck[rule])
      let clientDate = new Date(newActivityCheck[rule])
      let dateValidation = typeof new Date(newActivityCheck[rule]).getMonth !== 'function' || clientDate <= minDate || clientDate > new Date() // TODO: proveri ovo!!!!

      if (!newActivityCheck[rule]) {

        delete newActivityCheck[rule]

      } else if (dateValidation) {

        throw new BadRequest(translate.__('Something is wrong with the dates')) // TODO: error messages

      }
    })

    await activitiesHndl.saveLastActivitiesCheck(userId, newActivityCheck)

    res.send({
      status: true,
      message: 'You successfully update activities' //TODO: message
      // TODO: mozda da vratimo activity checkove u data?
    })


    return
  } catch (err) {
    next(err)
  }
}

export default {
  saveLastActivitiesCheck
}

