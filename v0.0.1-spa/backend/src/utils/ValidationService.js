const Ajv = require('ajv')
const ajv = new Ajv({
  allErrors: true,
  verbose: false
})

class ValidationService {
  static validate (schema, data) {
    const validate = ajv.compile(schema)
    const valid = validate(data)
    if (!valid) return validate.errors
    return []
  }
}

module.exports = ValidationService
