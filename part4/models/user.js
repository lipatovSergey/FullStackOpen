const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: String,
  passwordHash: String,
  blogs: [
    // An array of blog post IDs (ObjectIds) that the user created.
    // We are using array because multiple blogs will be saved for one user
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  },
})

// const collectionName = process.env.NODE_ENV === 'test' ? 'test_users' : 'User'
const User = mongoose.model('User', userSchema)

module.exports = User
