const student = require('./student')

module.exports = {
  getHealth,
  getStudentProperty,
  setStudentProperty,
  deleteStudentProperty
}

async function getHealth (req, res, next) {
  res.json({ success: true })
}

async function getStudentProperty (req, res, next) {
  const studentId = req.params.studentId
  const nestedProperty = req.params[0].replace(/\//g, '.')

  const value = await student.getProperty(studentId, nestedProperty)
  // 404 already handled in middleware
  if (!value) return next()
  res.json(value)
}

async function setStudentProperty (req, res, next) {
  const studentId = req.params.studentId
  const nestedProperty = req.params[0].replace(/\//g, '.')
  const propertyValue = req.body

  await student.setProperty(studentId, nestedProperty, propertyValue)
  res.sendStatus(204)
}

async function deleteStudentProperty (req, res, next) {
  const studentId = req.params.studentId
  const nestedProperty = req.params[0].replace(/\//g, '.')

  const result = await student.deleteProperty(studentId, nestedProperty)
  if (!result) return next()
  res.sendStatus(204)
}
