const Chat = require('../models/chatModel');
const catchAsync = require('../utils/catchAsync');
const Post = require('./../models/postModel');
const User = require('./../models/userModel');

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
exports.getChat = async  (req, res, next) => {
    const messages = await Chat.find();

    res.status(200).render('_chat', {title: 'Chat', messages})
}
exports.getUserprofile = catchAsync(async (req, res, next) => {
    console.log('RUN AT HERE')
    const { id } = req.params;
    console.log(id);
    const user_profil = await User.findById(id);
    console.log(user_profil);
    res.render('user-account', { title: 'Profil', user_profil});
})
function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}