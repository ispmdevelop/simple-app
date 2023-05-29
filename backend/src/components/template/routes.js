const express = require('express')
const TemplateController = require('./controller')
const router = express.Router()

router.get('/', (req, res, next) => {
  return TemplateController.getAllTemplates(req, res, next)
})

router.get('/:id', (req, res, next) => {
  return TemplateController.getTemplateById(req, res, next)
})

router.post('/', (req, res, next) => {
  return TemplateController.postTemplate(req, res, next)
})

router.put('/:id', (req, res, next) => {
  return TemplateController.putTemplate(req, res, next)
})

router.delete('/:id', (req, res, next) => {
  return TemplateController.deleteTemplate(req, res, next)
})

module.exports = router
