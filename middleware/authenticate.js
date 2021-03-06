const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authenticate = async (req, res, next) => {
  let accessToken = req.header('Authorization')
  try {
    if (!accessToken) throw new Error('No token')
    accessToken = accessToken.split(' ')[1]
    const payload = await jwt.verify(accessToken, process.env.JWT_SECRET_KEY)
    const user = await User.findOne({ _id: payload.id }).select('-password').select('-__v')
    if (!user) throw new Error('No user')
    req.user = user
    req.accessToken = accessToken
    next()
  } catch (err) {
    res.status(401).send({ statusCode: 401, message: 'Incorrect Credentials' })
  }
}

module.exports = authenticate