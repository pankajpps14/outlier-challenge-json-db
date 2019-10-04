const tape = require('tape')
const jsonist = require('jsonist')
const path = require('path')
const fs = require('fs')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const server = require('./server')

// Test data
const endpoint = `http://localhost:${port}`
const studentId = 'test-student-id'
const testStudentData = {
  firstName: 'firstName',
  lastName: 'lastName',
  school: {
    name: 'St. Stephens'
  },
  subjects: ['Physics', 'Chemestry']
}
const testFileDir = path.join(__dirname, './test-data')
const testFilePath = `${testFileDir}/${studentId}.json`

tape('health', async function (t) {
  const url = `${endpoint}/health`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'should have successful healthcheck')
    t.end()
  })
})

// PUT endpoint test-cases

tape('PUT /:student-id/:propertyName creates a studentId.json file with studentId as filename', async function (t) {
  const url = `${endpoint}/${studentId}/name`
  const testData = {
    name: 'Jhon Doe'
  }

  deleteTestFile()
  jsonist.put(url, testData, (err, body, res) => {
    if (err) t.error(err)
    t.equal(res.statusCode, 204, 'response code should be 204')
    t.ok(testFIleExists(), 'student file should be created')
    t.end()
    deleteTestFile()
  })
})

tape('PUT /:student-id/:propertyName sets a property', async function (t) {
  const url = `${endpoint}/${studentId}/name`
  const testData = {
    firstName: 'John',
    lastName: 'Doe'
  }

  createTestFile()
  jsonist.put(url, testData, (err, body, res) => {
    if (err) t.error(err)
    t.equal(res.statusCode, 204, 'response code should be 204')
    const studentData = getDataFromTestFile()
    t.deepEqual(studentData.name, testData, 'contact number should be equal')
    t.end()
    deleteTestFile()
  })
})

tape('PUT /:student-id/:propertyName(/:propertyName) set nested properties ', async function (t) {
  const url = `${endpoint}/${studentId}/courses/calculus`
  const testData = {
    score: 98
  }

  createTestFile()
  jsonist.put(url, testData, (err, body, res) => {
    if (err) t.error(err)
    t.equal(res.statusCode, 204, 'response code should be 204')
    const studentData = getDataFromTestFile()
    t.deepEqual(studentData.courses.calculus, testData, 'contact number should be equal')
    t.end()
    deleteTestFile()
  })
})

// GET endpoint test-cases

tape('GET /:student-id/:propertyName retrieves data from studentId.json', async function (t) {
  const url = `${endpoint}/${studentId}/subjects`

  createTestFile()
  jsonist.get(url, (err, body, res) => {
    if (err) t.error(err)
    t.equal(res.statusCode, 200, 'response code should be 200')
    t.deepEqual(body, testStudentData.subjects, 'subjets should be equal')
    t.end()
    deleteTestFile()
  })
})

tape('GET /:student-id/:propertyName(/:propertyName) retrieves nested property', async function (t) {
  const url = `${endpoint}/${studentId}/school/name`

  createTestFile()
  jsonist.get(url, (err, body, res) => {
    if (err) t.error(err)
    t.equal(res.statusCode, 200, 'response code should be 200')
    t.deepEqual(body, testStudentData.school.name, 'school name should be equal')
    t.end()
    deleteTestFile()
  })
})

tape('GET /:student-id/:propertyName returns 404 if the property does not exist', async function (t) {
  const url = `${endpoint}/${studentId}/foo`

  createTestFile()
  jsonist.get(url, (err, body, res) => {
    if (err) t.error(err)
    t.equal(res.statusCode, 404, 'response code should be 404')
    t.end()
    deleteTestFile()
  })
})

tape('GET /:student-id/:propertyName returns 404 if the file not exist', async function (t) {
  const url = `${endpoint}/${studentId}/foo`

  deleteTestFile()
  jsonist.get(url, (err, body, res) => {
    if (err) t.error(err)
    t.equal(res.statusCode, 404, 'response code should be 404')
    t.end()
  })
})

// DELETE endpoint test-cases

tape('DELETE /:student-id/:propertyName removes data from studentId.json', async function (t) {
  const url = `${endpoint}/${studentId}/subjects`

  createTestFile()
  jsonist.delete(url, (err, body, res) => {
    if (err) t.error(err)
    t.equal(res.statusCode, 204, 'response code should be 204')
    const studentData = getDataFromTestFile()
    t.false(studentData.subjects, 'json should not have subjects property')
    t.end()
    deleteTestFile()
  })
})

tape('DELETE /:student-id/:propertyName(/:propertyName) removes nested property from json', async function (t) {
  const url = `${endpoint}/${studentId}/school/name`

  createTestFile()
  jsonist.delete(url, (err, body, res) => {
    if (err) t.error(err)
    t.equal(res.statusCode, 204, 'response code should be 204')
    const studentData = getDataFromTestFile()
    t.false(studentData.school.name, 'json should not have school.name property')
    t.end()
    deleteTestFile()
  })
})

tape('DELETE /:student-id/:propertyName returns 404 if the property does not exist', async function (t) {
  const url = `${endpoint}/${studentId}/foo`

  createTestFile()
  jsonist.delete(url, (err, body, res) => {
    if (err) t.error(err)
    t.equal(res.statusCode, 404, 'response code should be 404')
    t.end()
    deleteTestFile()
  })
})

tape('DELETE /:student-id/:propertyName returns 404 if the file not exist', async function (t) {
  const url = `${endpoint}/${studentId}/foo`

  deleteTestFile()
  jsonist.delete(url, (err, body, res) => {
    if (err) t.error(err)
    t.equal(res.statusCode, 404, 'response code should be 404')
    t.end()
  })
})

tape('cleanup', function (t) {
  server.close()
  t.end()
})

function deleteTestFile () {
  try {
    fs.unlinkSync(testFilePath)
  } catch (err) {
    if (err.code === 'ENOENT') return
    throw err
  }
}

function createTestFile () {
  if (!fs.existsSync(testFileDir)) fs.mkdirSync(testFileDir)
  fs.writeFileSync(testFilePath, JSON.stringify(testStudentData))
}

function testFIleExists () {
  console.log(testFilePath)
  console.log(fs.existsSync(testFilePath))
  return fs.existsSync(testFilePath)
}

function getDataFromTestFile () {
  return JSON.parse(fs.readFileSync(testFilePath))
}
