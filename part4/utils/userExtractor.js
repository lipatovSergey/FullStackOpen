const User = require('../models/user')

const userExtractor = async (request, response, next) => {
  try {
    const decodedToken = request.token
    const user = await User.findById(decodedToken.id)
    if (user) {
      request.user = user
    } else {
      throw { name: 'ValidationError', message: 'User not found' }
    }
  } catch (error) {
    next(error)
  }

  next()
}

module.exports = userExtractor
