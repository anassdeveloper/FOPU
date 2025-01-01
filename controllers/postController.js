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
    const db = await Post.create(req.body);
    res.status(200).json({
        status: "success",
        data: db
    });
});