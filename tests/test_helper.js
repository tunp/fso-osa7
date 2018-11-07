const Blog = require("../models/blog")
const User = require("../models/user")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const formatBlog = (blog) => {
    return {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes,
        user: blog.user,
        comments: blog.comments,
        id: blog._id.toString()
    }
}

const formatUser = (user) => {
    return {
        username: user.username,
        name: user.name,
        adult: user.adult,
        blogs: user.blogs,
        id: user._id.toString()
    }
}

const emptyBlogs = async () => {
    await Blog.remove({})
}

const createBlog = async (blog) => {
    const new_blog = new Blog(blog)
    return await new_blog.save()
}

const getNewBlog = async (user, token) => {
    if (!user) {
        user = await getNewUser(token)
    }
    const blog = { title: "title", author: "author", url: "url", likes: 1, user }
    const new_blog = await createBlog(blog)
    user.blogs = user.blogs.concat(new_blog._id)
    user.save()
    return new_blog
}

const getNewBlogId = async (user, token) => {
    const new_blog = await getNewBlog(user, token)
    return new_blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({}).populate('comments')
    return blogs.map(formatBlog)
}

const emptyUsers = async () => {
    await User.remove({})
}

const createUser = async (user, token) => {
    const rounds = 10
    if (user.password) {
        user.pass_hash = await bcrypt.hash(user.password, rounds)
        delete user.password
    }
    const new_user = new User(user)
    if (token) {
        const user_for_token = {
            username: new_user.username,
            id: new_user._id
        }
        token.t = jwt.sign(user_for_token, process.env.SECRET)
    }
    return await new_user.save()
}

const getNewUser = async (token) => {
    const user = { username: "juuser", name: "Käyttäjä", adult: false }
    const new_user = await createUser(user, token);
    return new_user
}

const getNewUserId = async () => {
    const new_user = await getNewUser()
    return new_user._id.toString()
}

const usersInDb = async (id) => {
    const users = await User.find(id ? { _id: id } : {})
    return users.map(formatUser)
}

module.exports = {
    formatBlog,
    formatUser,
    emptyBlogs,
    getNewBlogId,
    blogsInDb,
    emptyUsers,
    createUser,
    getNewUser,
    getNewUserId,
    usersInDb
}
