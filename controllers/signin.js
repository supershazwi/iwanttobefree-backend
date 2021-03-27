const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const signinRouter = require('express').Router()
const User = require('../models/user')

signinRouter.post('/', async (request, response) => {
	const body = request.body

	const user = await User.findOne({ email: body.email })

	if (!user) { 
		return response.status(401).send({
			error: 'Email address does not exist'
		})
	}

	const passwordCorrect = user === null ? false : await bcrypt.compare(body.password, user.passwordHash)

	if (!(user && passwordCorrect)) {
		return response.status(401).send({
			error: 'Invalid password'
		})
	}

	const userForToken = {
	    email: user.email,
	    id: user._id,
  	}

  	const token = jwt.sign(userForToken, process.env.SECRET)

  	response.status(200).send({ token, email: user.email, name: user.name })
})

module.exports = signinRouter