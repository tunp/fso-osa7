const mongoose = require('mongoose')

const User = mongoose.model('User', {
    username: String,
    name: String,
    pass_hash: String,
    adult: Boolean,
    blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
})

module.exports = User
