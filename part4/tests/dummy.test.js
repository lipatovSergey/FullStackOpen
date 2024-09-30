const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const { test, beforeEach, after, describe } = require('node:test')
const assert = require('node:assert')
const { title } = require('node:process')

const api = supertest(app)

let blog1Inf
let blog2Inf

beforeEach(async () => {
  await Blog.deleteMany({}) // clear collection before each test

  const blog1 = new Blog({
    title: 'Blog 1',
    author: 'Author 1',
    url: 'http://blog1.com',
    likes: 10,
  })

  const blog2 = new Blog({
    title: 'Blog 2',
    author: 'Author 2',
    url: 'http://blog2.com',
    likes: 15,
  })

  blog1Inf = await blog1.save()
  blog2Inf = await blog2.save() // adding 2 blogs for test
})

test('blogs returned as json and blogs amount in db is correct', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, 2)
})

test('blogs have correct formatted fields', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogs = response.body
  blogs.forEach((blog) => {
    assert.ok('id' in blog, 'Blog should have an id property')
    assert.ok(!('_id' in blog), 'Blog should not have an _id property')
  })
})

test('a new blog post is created with HTTP POST', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'New Author',
    url: 'http://newblog.com',
    likes: 10,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})
  assert.strictEqual(blogsAtEnd.length, 3)

  const titles = blogsAtEnd.map((blog) => blog.title)
  assert.ok(titles.includes(newBlog.title), 'New blog title should be saved')
})

test('if likes is missing, it defaults to 0', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'New Author',
    url: 'http://newblog.com',
    // no likes property included
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const createdBlog = response.body
  assert.strictEqual(createdBlog.likes, 0)
})

test('try to add blog without title, returns 400', async () => {
  const newBlog = {
    // missing title
    author: 'New Author',
    url: 'http://newblog.com',
    likes: 5,
  }

  const response = await api.post('/api/blogs').send(newBlog)
  assert.strictEqual(response.status, 400)
})

test('try to add blog without url, returns 400', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'New Author',
    // missing url
    likes: 5,
  }

  const response = await api.post('/api/blogs').send(newBlog)
  assert.strictEqual(response.status, 400)
})

describe('DELETE /blogs/:id', () => {
  test('should delete an existing blog post', async () => {
    await api.delete(`/api/blogs/${blog1Inf._id}`).expect(204)
    const deletedBlog = await Blog.findById(blog1Inf._id)
    assert.strictEqual(deletedBlog, null)
  })

  test('should return 404 for non-existing blog', async () => {
    // generates new non existent id, which is valid to MongoDB
    const nonExistentId = new mongoose.Types.ObjectId()
    await api.delete(`/api/blogs/${nonExistentId}`).expect(404)
  })

  test('should return 400 for invalid ObjectId', async () => {
    const invalidId = '12345'
    await api.delete(`/api/blogs/${invalidId}`).expect(400)
  })
})

describe('PUT /blogs/:id', () => {
  test('should update likes field, without changing other fields', async () => {
    const updatedData = { likes: 10 }

    const response = await api
      .put(`/api/blogs/${blog1Inf._id}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const updatedBlog = response.body

    assert.strictEqual(updatedBlog.likes, 10)
    assert.strictEqual(updatedBlog.title, blog1Inf.title)
    assert.strictEqual(updatedBlog.author, blog1Inf.author)
    assert.strictEqual(updatedBlog.url, blog1Inf.url)
  })

  test('should update multiple fields', async () => {
    const updatedData = {
      title: 'Updated Title',
      author: 'Updated Author',
      likes: 15,
    }

    const response = await api
      .put(`/api/blogs/${blog1Inf._id}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const updatedBlog = response.body

    assert.strictEqual(updatedBlog.title, 'Updated Title')
    assert.strictEqual(updatedBlog.author, 'Updated Author')
    assert.strictEqual(updatedBlog.likes, 15)
  })

  test('should return 400 if no field provided to update', async () => {
    await api.put(`/api/blogs/${blog1Inf._id}`).send({}).expect(400)
  })

  test('should return 404 if blog does not exist', async () => {
    const nonExistentId = new mongoose.Types.ObjectId()
    const updatedData = { likes: 10 }
    await api.put(`/api/blogs/${nonExistentId}`).send(updatedData).expect(404)
  })
})

after(async () => await mongoose.connection.close())
