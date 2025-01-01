const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: String,
    photo: String,
    userId: String,
    userPhoto: String,
    username: String
});

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;