const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    date: {type: Date, default: new Date()},
    userID: String,
    userPhoto: String,
    userName: String,
    message: String
});


const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;