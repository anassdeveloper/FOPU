const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: String,
    photo: String,
    userId: String,
    userPhoto: String,
    username: String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: String,
        default: 'public'
    }
});

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;