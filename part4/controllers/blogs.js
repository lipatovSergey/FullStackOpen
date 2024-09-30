const blogsRouter = require('express').Router()
const { request, response } = require('express')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.status(200).json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  if (!blog.title || !blog.url) {
    return response.status(400).json({ error: 'all properties are required' })
  }

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  const result = await Blog.findByIdAndDelete(id)

  if (result) {
    response.status(204).end()
  } else {
    response.status(404).json({ error: 'Blog not found' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const body = request.body
  console.log(body)

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
