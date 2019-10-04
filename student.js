const fs = require('fs')
const { promisify } = require('util')
const path = require('path')
const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)
const mkdirAsync = promisify(fs.mkdir)
const _ = require('lodash')

const dataDirectory = process.env.DATA_DIR || './data'

module.exports = {
  getProperty,
  setProperty,
  deleteProperty
}

async function getProperty (studentId, nestedPath) {
  const fileName = path.join(__dirname, `${dataDirectory}/${studentId}.json`)
  let student = {}

  try {
    student = JSON.parse(await readFileAsync(fileName))
  } catch (err) {
    // Ignore file not found error and continue
    if (err.code !== 'ENOENT') throw err
  }

  // Check if propery exists
  if (!_.has(student, nestedPath)) return false
  return _.get(student, nestedPath)
}

async function setProperty (studentId, nestedPath, value) {
  const fileName = path.join(__dirname, `${dataDirectory}/${studentId}.json`)
  let student = {}

  try {
    student = JSON.parse(await readFileAsync(fileName))
  } catch (err) {
    // Ignore file not found error and continue
    if (err.code !== 'ENOENT') throw err
  }

  _.set(student, nestedPath, value)
  await ensureDirectoryExistence(fileName)
  return writeFileAsync(fileName, JSON.stringify(student))
}

async function deleteProperty (studentId, nestedPath) {
  const fileName = path.join(__dirname, `${dataDirectory}/${studentId}.json`)
  let student = {}

  try {
    student = JSON.parse(await readFileAsync(fileName))
  } catch (err) {
    // Ignore file not found error and continue
    if (err.code !== 'ENOENT') throw err
  }

  // Check if propery exists
  if (!_.has(student, nestedPath)) return false
  student = _.omit(student, nestedPath)
  await writeFileAsync(fileName, JSON.stringify(student))
  return true
}

async function ensureDirectoryExistence (filePath) {
  var dirname = path.dirname(filePath)
  if (fs.existsSync(dirname)) {
    return true
  }
  ensureDirectoryExistence(dirname)
  await mkdirAsync(dirname)
}
