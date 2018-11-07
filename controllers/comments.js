const commentsRouter = require('express').Router({ mergeParams: true })
const Comment = require('../models/comment')
const Blog = require('../models/blog')

commentsRouter.post('/', async (request, response) => {
    try {
        const comment = new Comment({
            text: request.body.text
        })
        const blog = await Blog.findById(request.params.blogid)
        if (blog) {
            const saved_comment = await comment.save()
            blog.comments = blog.comments.concat(saved_comment._id)
            await blog.save()
            response.status(201).json(saved_comment)
        } else {
            response.status(400).json({ error: "no blog found for comment" })
        }
    } catch (exception) {
        console.log(exception)
        response.status(500).end()
    }
})

module.exports = commentsRouter
