const express = require('express')
const bodyParser = require('body-parser')

const api = require('./api')
const middleware = require('./middleware')

const PORT = process.env.PORT || 1337

const app = express()

app.use(bodyParser.json())

app.get('/health', api.getHealth)

// Refer https://expressjs.com/en/guide/routing.html for regex routing

app.route('/:studentId/*')
  .get(api.getStudentProperty)
  .put(api.setStudentProperty)
  .delete(api.deleteStudentProperty)

app.use(middleware.handleError)
app.use(middleware.notFound)

const server = app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
)

if (require.main !== module) {
  module.exports = server
}
