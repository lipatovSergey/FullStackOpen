const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const { test, beforeEach, after, describe } = require('node:test')
const assert = require('node:assert')
const { title } = require('node:process')
const bcrypt = require('bcrypt')

const api = supertest(app)

const loginUserAndGetToken = async () => {
  const user = {
    username: 'testuser',
    password: 'password123',
  }

  const response = await api.post('/api/login').send(user).expect(200)

  return response.body.token
}

let blog1Inf
let blog2Inf
let userInf
let token

beforeEach(async () => {
  await Blog.deleteMany({}) // clear collection before each test
  await User.deleteMany({})

  const user = new User({
    username: 'testuser',
    name: 'Test User',
    passwordHash: await bcrypt.hash('password123', 10), // Provide hashed password
  })

  userInf = await user.save()
  token = await loginUserAndGetToken()

  const blog1 = new Blog({
    title: 'Blog 1',
    author: 'Author 1',
    url: 'http://blog1.com',
    likes: 10,
    user: userInf._id, // Associate with a user
  })

  const blog2 = new Blog({
    title: 'Blog 2',
    author: 'Author 2',
    url: 'http://blog2.com',
    likes: 15,
    user: userInf._id, // Associate with a user
  })

  blog1Inf = await blog1.save()
  blog2Inf = await blog2.save()
})

describe('get all blogs /api/blogs', () => {
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
})

describe('posting new blog POST /api/blogs', () => {
  test('a new blog post is created with HTTP POST', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'New Author',
      url: 'http://newblog.com',
      likes: 10,
      user: userInf._id,
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const createdBlogId = response.body.id
    const savedBlog = await Blog.findById(createdBlogId)
    assert.ok(savedBlog)
  })

  test('if likes is missing, it defaults to 0', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'New Author',
      url: 'http://newblog.com',
      user: userInf._id, // Include user association
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const createdBlog = response.body
    assert.strictEqual(createdBlog.likes, 0)
  })

  test('try to add blog without title, returns 400', async () => {
    const newBlog = {
      author: 'New Author',
      url: 'http://newblog.com',
      likes: 5,
      user: userInf._id, // Include user association
    }

    const response = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog)
    assert.strictEqual(response.status, 400)
  })

  test('try to add blog without url, returns 400', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'New Author',
      likes: 5,
      user: userInf._id, // Include user association
    }

    const response = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog)
    assert.strictEqual(response.status, 400)
  })
})

describe('deleting blog DELETE /blogs/:id', () => {
  test('should delete an existing blog post', async () => {
    await api.delete(`/api/blogs/${blog1Inf._id}`).set('Authorization', `Bearer ${token}`).expect(204)
    const deletedBlog = await Blog.findById(blog1Inf._id)
    assert.strictEqual(deletedBlog, null)
  })

  test('should return 401 for deleting without token', async () => {
    await api.delete(`/api/blogs/${blog1Inf._id}`).expect(401)
  })

  test('should return 404 for non-existing blog', async () => {
    // generates new non existent id, which is valid to MongoDB
    const nonExistentId = new mongoose.Types.ObjectId()
    await api.delete(`/api/blogs/${nonExistentId}`).set('Authorization', `Bearer ${token}`).expect(404)
  })

  test('should return 400 for invalid ObjectId', async () => {
    const invalidId = '12345'
    await api.delete(`/api/blogs/${invalidId}`).set('Authorization', `Bearer ${token}`).expect(400)
  })
})

describe('updating blog PUT /blogs/:id', () => {
  test('should update likes field, without changing other fields', async () => {
    const updatedData = { likes: 10 }

    const response = await api
      .put(`/api/blogs/${blog1Inf._id}`)
      .set('Authorization', `Bearer ${token}`)
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
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const updatedBlog = response.body

    assert.strictEqual(updatedBlog.title, 'Updated Title')
    assert.strictEqual(updatedBlog.author, 'Updated Author')
    assert.strictEqual(updatedBlog.likes, 15)
  })

  test('should return 400 if no field provided to update', async () => {
    await api.put(`/api/blogs/${blog1Inf._id}`).set('Authorization', `Bearer ${token}`).send({}).expect(400)
  })

  test('should return 404 if blog does not exist', async () => {
    const nonExistentId = new mongoose.Types.ObjectId()
    const updatedData = { likes: 10 }
    await api.put(`/api/blogs/${nonExistentId}`).set('Authorization', `Bearer ${token}`).send(updatedData).expect(404)
  })
})

after(async () => await mongoose.connection.close())
