const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const errorHandler = require('./utils/errorHandler')

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to mongoDB')
  })
  .catch((error) => console.error('error connecting to mongoDB: ', error.message))

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use(errorHandler)

module.exports = app
