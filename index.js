const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const token = require('./utils/token')
const config = require('./utils/config')

mongoose.connect(config.mongoUrl)

app.use(cors())
app.use(bodyParser.json())
app.use(token.getTokenFrom)
app.use("/api/blogs", blogsRouter)
app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)
app.use(express.static('bloglist-frontend/build'))
// if static file was not found use always the index
app.get('*', (req, res) => {
    res.sendFile('bloglist-frontend/build/index.html', { root: __dirname })
})

const server = http.createServer(app)

let PORT = config.port
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

server.on('close', () => {
    mongoose.connection.close()
})

module.exports = {
    app, server
}
