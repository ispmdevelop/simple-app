const TemplateService = require('./service')
const Response = require('../../utils/Response')
const ValidationService = require('../../utils/ValidationService')
const TemplateSchema = require('./schemas')

class TemplateController {
  static async postTemplate (req, res, next) {
    try {
      const template = req.body
      const errors = ValidationService.validate(TemplateSchema, template)
      if (errors.length)
        return res.json(
          Response.generate(
            400,
            'Invalid template',
            errors.map(e => e.message)
          )
        )
      const templateCreated = await TemplateService.postTemplate(template)
      return res.json(
        Response.generate(200, 'Template created', templateCreated)
      )
    } catch (err) {
      next(err)
    }
  }

  static async putTemplate (req, res, next) {
    try {
      const template = req.body
      const errors = ValidationService.validate(TemplateSchema, template)
      if (errors.length)
        return res.json(
          Response.generate(
            400,
            'Invalid template',
            errors.map(e => e.message)
          )
        )
      const templateUpdated = await TemplateService.putTemplate(
        req.params.id,
        template
      )
      return res.json(
        Response.generate(200, 'Template updated', templateUpdated)
      )
    } catch (err) {
      next(err)
    }
  }

  static async deleteTemplate (req, res, next) {
    try {
      const templates = await TemplateService.deleteTemplateById(req.params.id)
      return res.json(Response.generate(200, 'Template deleted', null))
    } catch (err) {
      next(err)
    }
  }

  static async getTemplateById (req, res, next) {
    try {
      const templates = await TemplateService.getTemplateById(req.params.id)
      return res.json(Response.generate(200, 'Template retrieved', templates))
    } catch (err) {
      next(err)
    }
  }

  static async getAllTemplates (req, res, next) {
    try {
      const templates = await TemplateService.getTemplates()
      return res.json(Response.generate(200, 'Templates retrieved', templates))
    } catch (err) {
      next(err)
    }
  }
}

module.exports = TemplateController
