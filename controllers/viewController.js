const catchAsync = require('../utils/catchAsync');
const Post = require('./../models/postModel');

exports.login = (req, res, next) => {
    res.status(200).render('login', {
        title: 'Login'
    });
}

exports.getSite = catchAsync(async (req, res, next) => {
    let posts;
    console.log(req.user)
    if(req.user.role === 'admin'){
      posts = await Post.find();
    }else{
        posts = await Post.find({status: 'public'});
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