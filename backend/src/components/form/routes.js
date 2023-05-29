const express = require('express')
const FormController = require('./controller')
const router = express.Router()

router.get('/', (req, res, next) => {
  try {
    return FormController.getAllForms(req, res, next)
  } catch (err) {
    console.log(err)
  }
})

router.get('/:id', (req, res, next) => {
  return FormController.getFormById(req, res, next)
})

router.post('/', (req, res, next) => {
  return FormController.postForm(req, res, next)
})

router.put('/:id', (req, res, next) => {
  return FormController.putForm(req, res, next)
})

router.delete('/:id', (req, res, next) => {
  return FormController.deleteForm(req, res, next)
})

module.exports = router
