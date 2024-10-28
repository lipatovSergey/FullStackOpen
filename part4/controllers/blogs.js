const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const tokenExtractor = require('../utils/tokenExtractor')
const userExtractor = require('../utils/userExtractor')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.status(200).json(blogs)
})

blogsRouter.post('/', tokenExtractor, userExtractor, async (request, response) => {
  const user = request.user

  const { title, author, url, likes } = request.body

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id,
  })

  if (!blog.title || !blog.url) {
    return response.status(400).json({ error: 'all properties are required' })
  }

  const savedBlog = await blog.save()
  const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', tokenExtractor, userExtractor, async (request, response) => {
  const blogId = request.params.id
  const blog = await Blog.findById(blogId)
  // Check if the blog exists
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  const userId = request.user.id
  if (blog.user.toString() === userId.toString()) {
    await Blog.findByIdAndDelete(blogId)
    return response.status(204).end()
  } else {
    return response.status(403).json({ error: 'forbidden: user not authorized to delete this blog' })
  }
})

blogsRouter.put('/:id', tokenExtractor, userExtractor, async (request, response) => {
  const id = request.params.id
  const body = request.body

  // Ensure there is at least one field to update
  if (!body.title && !body.author && !body.url && body.likes === undefined) {
    return response.status(400).json({ error: 'No fields to update' })
  }

  const updateData = {
    ...(body.title && { title: body.title }),
    ...(body.author && { author: body.author }),
    ...(body.url && { url: body.url }),
    ...(body.likes !== undefined && { likes: body.likes }),
  }

  const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true, runValidators: true, context: 'query' })
  if (updatedBlog === null) {
    return response.status(404).json({ error: 'Blog not found' })
  }
  response.json(updatedBlog)
})

module.exports = blogsRouter
