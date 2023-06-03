const templateSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    fields: {
      type: 'array',
      items: {
        type: 'object'
      }
    },
    body: { type: 'string' }
  },
  required: ['name', 'fields', 'body']
}

module.exports = templateSchema
