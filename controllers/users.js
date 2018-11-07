const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    try {
        const users = await User.find({}, { username: 1, name: 1, adult: 1, blogs: 1 }).populate('blogs')
        response.json(users)
    } catch (exception) {
        console.log(exception)
        response.status(500).end()
    }
})

usersRouter.post('/', async (request, response) => {
    try {
        const same_user = await User.findOne({ username: request.body.username })
        if (same_user) {
            response.status(400).json({ error: "user with given username is already created" })
        } else if (typeof request.body.password !== "string" || request.body.password.length <= 3) {
            response.status(400).json({ error: "password must be longer than 3 characters" })
        } else {
            const rounds = 10
            const pass_hash = await bcrypt.hash(request.body.password, rounds)

            if (typeof request.body.adult === "undefined") {
                request.body.adult = true
            }

            const user = new User({
                username: request.body.username,
                name: request.body.name,
                adult: request.body.adult,
                pass_hash
            })
            const saved_user = await user.save()
            response.status(201).json(saved_user)
        }
    } catch (exception) {
        console.log(exception)
        response.status(500).end()
    }
})

module.exports = usersRouter
