const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const errorHandler = require('./utils/errorHandler')
const logger = require('./utils/logger')
const loginRouter = require('./controllers/login')
const tokenExtractor = require('./utils/tokenExtractor')
const userExtractor = require('./utils/userExtractor')

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to mongoDB')
  })
  .catch((error) => logger.error('error connecting to mongoDB: ', error.message))

app.use(cors())
app.use(express.json())
app.use(logger.requestLogger)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use(errorHandler)

module.exports = app
