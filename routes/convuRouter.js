const express = require('express');
const catchAsync = require('../utils/catchAsync');
const Chat = require('../models/chatModel');

const router = express.Router();
router.get('/all-messages', async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: await Chat.find()
    })
})
router.post('/create-message', catchAsync(async (req, res, next) => {
    
    const message = await Chat.create({
        userPhoto: req.body.photo,
        userName: req.body.name,
        message: req.body.message
    });
    
    
    res.status(200).json({
        status: 'success',
        data: message
    })
}));


module.exports = router;