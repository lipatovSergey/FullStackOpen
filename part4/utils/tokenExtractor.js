const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.replace('Bearer ', '')
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET)
      if (decodedToken && decodedToken.id) {
        request.token = decodedToken
      } else {
        throw { name: 'JsonWebTokenError', message: 'Invalid token' }
      }
    } catch (error) {
      next(error)
    }
  } else {
    throw { name: 'JsonWebTokenError', message: 'Token missing or invalid' }
  }

  next()
}

module.exports = tokenExtractor
