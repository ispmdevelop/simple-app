const FormService = require('./service')
const Response = require('../../utils/Response')
const ValidationService = require('../../utils/ValidationService')
const FormSchema = require('./schemas')

class FormController {
  static async postForm (req, res, next) {
    try {
      const form = req.body
      const errors = ValidationService.validate(FormSchema, form)
      if (errors.length)
        return res.json(
          Response.generate(
            400,
            'Invalid form',
            errors.map(e => e.message)
          )
        )
      const formCreated = await FormService.postForm(form)
      return res.json(Response.generate(200, 'Form created', formCreated))
    } catch (err) {
      next(err)
    }
  }

  static async putForm (req, res, next) {
    try {
      const form = req.body
      const errors = ValidationService.validate(FormSchema, form)
      if (errors.length)
        return res.json(
          Response.generate(
            400,
            'Invalid form',
            errors.map(e => e.message)
          )
        )
      const formUpdated = await FormService.putForm(req.params.id, form)
      return res.json(Response.generate(200, 'Form updated', formUpdated))
    } catch (err) {
      next(err)
    }
  }

  static async deleteForm (req, res, next) {
    try {
      await FormService.deleteFormById(req.params.id)
      return res.json(Response.generate(200, 'Form deleted', null))
    } catch (err) {
      next(err)
    }
  }

  static async getFormById (req, res, next) {
    try {
      const forms = await FormService.getFormById(req.params.id)
      return res.json(Response.generate(200, 'Form retrieved', forms))
    } catch (err) {
      next(err)
    }
  }

  static async getAllForms (req, res, next) {
    try {
      const forms = await FormService.getForms()
      return res.json(Response.generate(200, 'Forms retrieved', forms))
    } catch (err) {
      next(err)
    }
  }
}

module.exports = FormController
