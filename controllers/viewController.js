const catchAsync = require('../utils/catchAsync');
const Post = require('./../models/postModel');

exports.login = (req, res, next) => {
    res.status(200).render('login', {
        title: 'Login'
    });
}

exports.getSite = catchAsync(async (req, res, next) => {
    const posts = await Post.find();
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