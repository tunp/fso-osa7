const mongoose = require('mongoose')

const Comment = mongoose.model('Comment', {
    text: String,
})

module.exports = Comment
