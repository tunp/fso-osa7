const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    const body = request.body
    const user = await User.findOne({ username: body.username })
    const pass_correct = user && await bcrypt.compare(body.password, user.pass_hash)
    if (!pass_correct) {
        response.status(401).json({ error: "invalid username or password" })
        return;
    }
    const user_for_token = {
        username: user.username,
        id: user._id
    }
    const token = jwt.sign(user_for_token, process.env.SECRET)
    response.status(200).json({ token, username: user.username, name: user.name, id: user._id })
})

module.exports = loginRouter
