const { test, beforeEach } = require('node:test')
const assert = require('assert')
const supertest = require('supertest')
const app = require('../app') // Ensure this points to your Express app
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('secret', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()
})

test('creation succeeds with a fresh username', async () => {
  const newUser = {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    password: 'salainen',
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const responseUserId = response.body.id
  const createdUser = await User.findById(responseUserId)
  assert(createdUser !== null)
})

test('creation fails with proper status code and message if username is taken', async () => {
  const newUser = {
    username: 'root', // This username already exists
    name: 'Superuser',
    password: 'salainen',
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const responseUserId = response.body.id
  const createdUser = await User.findById(responseUserId)

  assert.strictEqual(createdUser, null)
})

test('creation fails with proper status code and message if username is too short', async () => {
  const newUser = {
    username: 'ml',
    name: 'Matti Luukkainen',
    password: 'salainen',
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const responseUserId = response.body.id
  const createdUser = await User.findById(responseUserId)

  assert.strictEqual(createdUser, null)
})

test('creation fails with proper status code and message if password is too short', async () => {
  const newUser = {
    username: 'mlsdasd',
    name: 'Matti Luukkainen',
    password: 'sa',
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const responseUserId = response.body.id
  const createdUser = await User.findById(responseUserId)

  assert.strictEqual(createdUser, null)
})
