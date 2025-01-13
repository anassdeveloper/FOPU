const catchAsync = require('../utils/catchAsync');
const Post = require('./../models/postModel');

exports.login = (req, res, next) => {

    // if(req.user) return res.redirect('/');

    res.status(200).render('login', {
        title: 'Login'
    });
}

exports.getSite = catchAsync(async (req, res, next) => {
    let posts;
    let userId = req.user._id.toString();
    
    if(req.user.role === 'admin'){
      posts = await Post.find({}, null, {sort: 'createdAt'});
    }else{
        let posts01 = await Post.find({userId});
        let posts02 = await Post.find({status: 'public'});

        let merge = posts01.concat(posts02);

        posts = uniq(merge);
        //  posts = await Post.find({ 
        //     status: "public", 
        // }).where('userId').equals(String(req.user._id));
        // setDB.add(posts)
        // posts = await Post.find()
        // .where('userId')
        // .equals(req.user._id)
        // .where('status')
        // .equals('public')
        // .limit(4)
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
    
    if(req.user) return res.redirect('/');
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


function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}