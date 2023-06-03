const FormSchema = {
  type: 'object',
  properties: {
    body: { type: 'string' },
    fields: {
      type: 'array',
      items: {
        type: 'object'
      }
    },
    templateId: { type: 'string' }
  },
  required: ['body', 'fields', 'templateId']
}

module.exports = FormSchema
