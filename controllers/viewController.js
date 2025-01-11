const catchAsync = require('../utils/catchAsync');
const Post = require('./../models/postModel');

exports.login = (req, res, next) => {
    res.status(200).render('login', {
        title: 'Login'
    });
}

exports.getSite = catchAsync(async (req, res, next) => {
    let posts;
    if(req.user.role === 'admin'){
      posts = await Post.find({}, null, {sort: 'createdAt'});
    }else{
        posts = await Post.find({userId: req.user._id});
        posts = posts.concat(await Post.find({ status: 'public'}))
    }
    
    res.status(200).render('base', {
        title: 'HOME',
        posts
    });
});


exports.me = (req, res, next) => {
    res.status(200).render('account', {
        title: 'Account'
    });
}

exports.register = (req, res, next) => {
    res.status(200).render('register',{
        title: "New Account "
    } )
}

exports.updatePost = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    res.status(200).render('update-post', {
        title: 'UpDate',
        post
    })
})