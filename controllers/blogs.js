const blogsRouter = require('express').Router();
const commentsRouter = require('./comments')
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog');
const User = require('../models/user');
const Comment = require('../models/comment')

blogsRouter.use("/:blogid/comments", commentsRouter)

blogsRouter.get('/', (request, response) => {
    Blog
        .find({})
        .populate('user', { username: 1, name: 1, adult: 1})
        .populate('comments')
        .then(blogs => {
            response.json(blogs)
        })
})

blogsRouter.post('/', async (request, response) => {
    try {
        const decoded_token = jwt.verify(request.token, process.env.SECRET)

        if (!request.token || !decoded_token.id) {
            response.status(401).json({ error: "token missing or invalid" })
        }
        const blog = new Blog(request.body)
        if (blog.likes === undefined) {
            blog.likes = 0
        }

        if (!blog.title || !blog.url) {
            response.status(400).json({ error: "title and url are required" })
        } else {
            const user = await User.findById(decoded_token.id)
            if (user) {
                blog.user = user
                const saved_blog = await blog.save()
                user.blogs = user.blogs.concat(saved_blog._id)
                await user.save()
                response.status(201).json(saved_blog)
            } else {
                response.status(400).json({ error: "no user found for blog" })
            }
        }
    } catch (exception) {
        if (exception.name == "JsonWebTokenError") {
            response.status(401).json({ error: exception.message })
        } else {
            console.log(exception)
            response.status(500).json({ error: "some error" })
        }
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    const id = request.params.id;
    try {
        const decoded_token = jwt.verify(request.token, process.env.SECRET)

        if (!request.token || !decoded_token.id) {
            response.status(401).json({ error: "token missing or invalid" })
        }
        const blog = await Blog.findById(id)
        if (!blog.user || blog.user.toString() == decoded_token.id) {
            await blog.remove()
            response.status(204).end()
        } else {
            response.status(401).json({ error: "user is not allowed to delete this blog" })
        }
    } catch (exception) {
        if (exception.name == "JsonWebTokenError") {
            response.status(401).json({ error: exception.message })
        } else {
            console.log(exception)
            response.status(500).json({ error: "some error" })
        }
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const id = request.params.id;
    const blog = request.body;
    if (!blog.title || !blog.url) {
        response.status(400).json({ error: "title and url are required" })
    } else {
        try {
            const new_blog = await Blog.findByIdAndUpdate(id, blog, { new: true })
                .populate('user', { username: 1, name: 1, adult: 1})
                .populate('comments')
            response.status(200).json(new_blog)
        } catch (exception) {
            response.status(400).end()
        }
    }
})

module.exports = blogsRouter;
