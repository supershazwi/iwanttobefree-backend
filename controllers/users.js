const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    name: body.name,
    email: body.email,
    passwordHash: passwordHash,
  })

  try {
    const savedUser = await user.save()
    response.json(savedUser)

    return true

  } catch (err) {
    response.status(400).send({ error: 'Email address already exists' })
  }
})

module.exports = usersRouter