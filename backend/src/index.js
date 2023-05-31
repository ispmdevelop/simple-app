const express = require('express')
const cors = require('cors')
const Database = require('./db/Database')
const app = express()
const Response = require('./utils/Response')

Database.init()

Database.setUpSchema()
  .then(() => {
    console.log('Database schema setup successfully')
    Database.populate()
  })
  .catch(err => {
    console.error(err)
  })

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/template', require('./components/template/routes'))
app.use('/form', require('./components/form/routes'))

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json(Response.generate(500, err.message, null))
})

// Server
app.listen(4000, () => {
  console.log('Server listening on port 3000')
})
