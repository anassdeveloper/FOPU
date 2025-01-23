const Post = require('../models/postModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');



exports.getAllPosts = catchAsync(async (req, res, next) => {
    let db;
    let userId = req.user._id.toString();

    if(req.user.role === 'admin'){
      db = await Post.find();
    }else{
        //db = await Post.find({ status: 'public' }, {userId: req.user._id});
         db = await Post.find({userId, status: 'public'});
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
    user.posts.push({
        title, 
        userId,
        photo: req.file.photo, 
        categorie: req.file.photo ? "photo": 'write'
    });
    await user.save({ validateBeforeSave: false });
    const db = await Post.create({
        title, userId, userPhoto, username, status,
        photo: req.file.photo,
        categorie: req.file.photo ? 'photo' : undefined
    });
    res.status(200).json({
        status: "success",
        data: db
    });
});


exports.deletePost = catchAsync(async(req, res, next) => {
    const delPost = await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: 'success', del: null});
});




exports.searchPostByQuery = catchAsync(async (req, res, next) => {
    console.log('HIIII HELLO')

   const queryObj = { ...req.query };
   // filed ghir msmo7 biha msmo7 biha
   const excludedFields = ["userId", "__v", "userPhoto"];
   excludedFields.forEach(el => delete queryObj[el]);

   console.log(queryObj)

   const query = Post.find(queryObj);

   const posts = await query;

   res.status(200).json({
       status: "success",
       length: posts.length,
       data: posts
   });
})