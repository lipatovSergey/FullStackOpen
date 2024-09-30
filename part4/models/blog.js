const { default: mongoose } = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: { type: Number, default: 0 },
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
  },
})

const collectionName = process.env.NODE_ENV === 'test' ? 'test_blogs' : 'blogs'
const Blog = mongoose.model(collectionName, blogSchema)

module.exports = Blog
