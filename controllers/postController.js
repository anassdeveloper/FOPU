const Post = require('../models/postModel');
const catchAsync = require('../utils/catchAsync');



exports.getAllPosts = catchAsync(async (req, res, next) => {
    const db = await Post.find();
    res.status(200).json({
        status: "success",
        length: db.length,
        data: db
    });
});

exports.getOnePost = (req, res, next) => {

}

exports.createNewPost = catchAsync(async (req, res, next) => {
    const { title, userId, userPhoto, username } = req.body;

    const db = await Post.create({
        title, userId, userPhoto, username,
        photo: req.file.photo
    });
    res.status(200).json({
        status: "success",
        data: db
    });
});
