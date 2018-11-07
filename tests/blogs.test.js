const supertest = require('supertest')
const helper = require('./test_helper')
const { app, server } = require('../index')
const api = supertest(app)

const token = {}

beforeAll(async () => {
    await helper.emptyUsers()
    await helper.emptyBlogs()
    await helper.createUser({ username: "firstuser", name: "The First", password: "passpass" }, token)
})

test('blogs post', async () => {
    const testblog = { title: "blogtest", author: "testman", url: "http://example.com", likes: 7 };
    const initial_blogs = await helper.blogsInDb();
    const response = await api
    .post('/api/blogs')
    .send(testblog)
    .set("Authorization", "Bearer " + token.t)
    .expect(201)
    .expect('Content-Type', /application\/json/)
    expect(response.body._id.length).toBe(24)
    expect(response.body.title).toBe(testblog.title);

    const after_blogs = await helper.blogsInDb();
    expect(after_blogs.length).toBe(initial_blogs.length+1);
    expect(after_blogs.map(b => b.title)).toContain(response.body.title)

    const after_users = await helper.usersInDb()
    expect(after_users.map(u => u.id)).toContain(response.body.user._id)
    const user_blogs = after_users.reduce((acc, cur) => { return { blogs: cur.blogs.concat(acc.blogs) } } ).blogs.map(ub => ub.toString())
    expect(user_blogs).toContain(response.body._id)
})

test('blogs post empty likes', async () => {
    const testblog = { title: "blogtest", author: "testman", url: "http://example.com" };
    const response = await api
    .post('/api/blogs')
    .send(testblog)
    .set("Authorization", "Bearer " + token.t)
    .expect(201)
    .expect('Content-Type', /application\/json/)
    expect(response.body.likes).toBe(0);
})

test('blogs post no title and url', async () => {
    const testblog = { author: "testman" };
    const response = await api
    .post('/api/blogs')
    .send(testblog)
    .set("Authorization", "Bearer " + token.t)
    .expect(400)
})

test('blogs post fail with invalid token', async () => {
    const testblog = { title: "blogtest", author: "testman", url: "http://example.com", likes: 7 };
    const response = await api
    .post('/api/blogs')
    .send(testblog)
    .set("Authorization", "Bearer blaablaa")
    .expect(401)
    expect(response.body).toEqual({ error: "jwt malformed" })
})

test('blog remove', async () => {
    const testtoken = {}
    const id = await helper.getNewBlogId(undefined, testtoken);
    const response = await api
    .delete(`/api/blogs/${id}`)
    .set("Authorization", "Bearer " + testtoken.t)
    .expect(204)
    const after_blogs = await helper.blogsInDb()
    expect(after_blogs.find((blog) => { return blog.id === id } )).toBe(undefined)
})

test('blog remove fail with different user', async () => {
    const id = await helper.getNewBlogId();
    const response = await api
    .delete(`/api/blogs/${id}`)
    .set("Authorization", "Bearer " + token.t)
    .expect(401)
    expect(response.body).toEqual({ error: "user is not allowed to delete this blog" })
})

test('blogs get', async () => {
    const testuser = { username: "gettingbloguser", name: "Get Blog User", password: "fniurenfiu", adult: true }
    const user = await helper.createUser(testuser)
    const id = await helper.getNewBlogId(user)
    const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    expect(typeof response.text).toBe("string")
    expect(response.body.map(b => b._id.toString())).toContain(id)
    expect(response.body.filter(b => b.user).length).toBe(response.body.length)
    expect(response.body[0].user._id.length).toBe(24)
    expect(typeof response.body[0].user.pass_hash === "undefined").toBe(true)
})

test('blogs update', async () => {
    const id = await helper.getNewBlogId();
    const new_blog = { title: "title2", author: "author2", url: "url2", likes: 6 }
    const response = await api
    .put(`/api/blogs/${id}`)
    .send(new_blog)
    .expect(200)
    .expect('Content-Type', /application\/json/)
    expect(typeof response.text).toBe("string")
    expect(response.body._id).toBe(id)
    const after_blogs = await helper.blogsInDb()
    expect(after_blogs.find((blog) => { return blog.id === id } ).likes).toBe(new_blog.likes)
})

test('users post', async () => {
    const testuser = { username: "usertest", name: "testman", password: "pass", adult: true }
    const initial_users = await helper.usersInDb()
    const response = await api
    .post('/api/users')
    .send(testuser)
    .expect(201)
    .expect('Content-Type', /application\/json/)
    expect(response.body._id.length).toBe(24)
    expect(response.body.username).toBe(testuser.username)

    const after_users = await helper.usersInDb()
    expect(after_users.length).toBe(initial_users.length+1)
    expect(after_users.map(b => b.username)).toContain(response.body.username)
})

test('users get', async () => {
    const testuser = { username: "gettinguser", name: "Get User", password: "gregniurej", adult: true }
    const user = await helper.createUser(testuser)
    const blog_id = await helper.getNewBlogId(user) // to test populating user with blogs
    const id = user._id.toString()
    const response = await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    expect(typeof response.text).toBe("string")
    expect(response.body.map(u => u._id.toString())).toContain(id)
    expect(response.body.find(u => u._id == id).blogs[0]._id).toBe(blog_id)
    expect(response.body.filter(u => typeof u.pass_hash !== "undefined").length).toBe(0)
})

test('users post short pw', async () => {
    const testuser = { username: "usershort", name: "tooshortman", password: "pp", adult: true }
    const response = await api
    .post('/api/users')
    .send(testuser)
    .expect(400)
    .expect('Content-Type', /application\/json/)
    expect(response.body).toEqual({ error: "password must be longer than 3 characters" })
})

test('users post colliding username', async () => {
    const testuser = { username: "sameuser", name: "stereouser", password: "passwwoooord", adult: true }
    await helper.createUser(testuser)
    const response = await api
    .post('/api/users')
    .send(testuser)
    .expect(400)
    .expect('Content-Type', /application\/json/)
    expect(response.body).toEqual({ error: "user with given username is already created" })
})

test('users post adult default true', async () => {
    const testuser = { username: "adultuser", name: "adultiam", password: "passwwoooord" }
    const response = await api
    .post('/api/users')
    .send(testuser)
    .expect(201)
    .expect('Content-Type', /application\/json/)
    expect(response.body.adult).toBe(true)

    const after_users = await helper.usersInDb(response.body._id)
    expect(after_users[0].adult).toBe(true)
})

test('login valid', async () => {
    const testlogin = { username: "firstuser", password: "passpass" }
    const response = await api
    .post('/api/login')
    .send(testlogin)
    .expect(200)
    .expect('Content-Type', /application\/json/)
    expect(response.body.token.length > 50).toBe(true)
})

test('login invalid', async () => {
    const testlogin = { username: "firstuser", password: "passpass2" }
    const response = await api
    .post('/api/login')
    .send(testlogin)
    .expect(401)
    .expect('Content-Type', /application\/json/)
    expect(response.body).toEqual({ error: "invalid username or password" })
})

test('login user not found', async () => {
    const testlogin = { username: "firstuser2", password: "passpassblaa" }
    const response = await api
    .post('/api/login')
    .send(testlogin)
    .expect(401)
    .expect('Content-Type', /application\/json/)
    expect(response.body).toEqual({ error: "invalid username or password" })
})

test('post a comment', async () => {
    const comment = { text: 'comments for a blog post makes a better day' }
    const blog_id = await helper.getNewBlogId()
    const response = await api
    .post(`/api/blogs/${blog_id}/comments`)
    .send(comment)
    .expect(201)
    .expect('Content-Type', /application\/json/)
    expect(typeof response.text).toBe("string")
    expect(response.body._id.length).toBe(24)
    expect(response.body.text).toBe(comment.text)

    const after_blogs = await helper.blogsInDb();
    expect(after_blogs.map(blog => blog.comments).reduce((acc, val) => acc.concat(val), []).map(comment => comment.text)).toContain(comment.text)
})

afterAll(() => {
    server.close()
})
