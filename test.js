const tape = require('tape')
const jsonist = require('jsonist')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')

tape('health', async function (t) {
  const url = `${endpoint}/health`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'should have successful healthcheck')
    t.end()
  })
})

// PUT endpoint test-cases

tape('PUT /:student-id/:propertyName creates a studentId.json file with id as name', async function (t) {
  t.fail('not implemented')
  t.end()
})

tape('PUT /:student-id/:propertyName sets property', async function (t) {
  t.fail('not implemented')
  t.end()
})

tape('PUT /:student-id/:propertyName(/:propertyName) set nested properties ', async function (t) {
  t.fail('not implemented')
  t.end()
})

// GET endpoint test-cases

tape('GET /:student-id/:propertyName retrieves data from studentId.json', async function (t) {
  t.fail('not implemented')
  t.end()
})

tape('GET /:student-id/:propertyName(/:propertyName) retrieves nested property', async function (t) {
  t.fail('not implemented')
  t.end()
})

tape('GET /:student-id/:propertyName returns 404 if the property does not exist', async function (t) {
  t.fail('not implemented')
  t.end()
})

tape('GET /:student-id/:propertyName returns 404 if the file not exist', async function (t) {
  t.fail('not implemented')
  t.end()
})

// DELETE endpoint test-cases

tape('DELETE /:student-id/:propertyName removes data from studentId.json', async function (t) {
  t.fail('not implemented')
  t.end()
})

tape('DELETE /:student-id/:propertyName(/:propertyName) removes nested property from json', async function (t) {
  t.fail('not implemented')
  t.end()
})

tape('DELETE /:student-id/:propertyName returns 404 if the property does not exist', async function (t) {
  t.fail('not implemented')
  t.end()
})

tape('DELETE /:student-id/:propertyName returns 404 if the file not exist', async function (t) {
  t.fail('not implemented')
  t.end()
})

tape('cleanup', function (t) {
  server.close()
  t.end()
})
