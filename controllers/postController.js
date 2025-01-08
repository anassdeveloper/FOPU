const Post = require('../models/postModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');



exports.getAllPosts = catchAsync(async (req, res, next) => {
    let db;
    console.log(req.user)
    if(req.user.role === 'admin'){
      db = await Post.find();
    }else{
        db = await Post.find({status: 'public'});
    }
    res.status(200).json({
        status: "success",
        length: db.length,
        data: db
    });
});

exports.getOnePost = (req, res, next) => {

}

exports.createNewPost = catchAsync(async (req, res, next) => {
    const { title, userId, userPhoto, username, status } = req.body;

    const user = await User.findById({_id: userId});
    user.posts.push({title, userId,photo: req.file.photo });
    await user.save({ validateBeforeSave: false });
    const db = await Post.create({
        title, userId, userPhoto, username, status,
        photo: req.file.photo
    });
    res.status(200).json({
        status: "success",
        data: db
    });
});
