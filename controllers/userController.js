const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');
const { query } = require('express');


// filter body obj from unique fileds
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};



const createToken = userID => {
    const token = jwt.sign({id: userID}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    return token;
}


exports.getAllUsers = catchAsync(async(req, res) => {
    const users = await User.find().select('-posts -createdAt -role -__v');

    res.cookie('username');

    res.status(200).json({
        status: 'success',
        data: users
    });
});
exports.getOneUser = catchAsync(async (req, res, next) =>{
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    if(!user) next(new AppError('User Not Found', 404));
    res.status(200).json({
        status: 'success',
        data: user
    });
});

exports.deleteOneUser = catchAsync(async (req, res) => {
    const { id } = req.params;
    await User.findOneAndDelete({_id: id});

    res.status(200).json({
        status: 'success',
        message: 'user succesuffly deleted',
        data: null
    });
})

exports.newuser = catchAsync(async(req, res, next) => {
    const { name, email, password, passwordConfirm  } = req.body;


     const newUser = await User.create({
         name,
         email,
         password,
         passwordConfirm,
    });

     res.status(200).json({
         status: 'success',
         message: 'User successfully register',
         token: createToken(newUser._id),
         data: newUser
     });

});



exports.updateUserInfo = catchAsync(async (req, res, next) => {
   if(req.body.password || req.body.passwordConfirm){
      return next(new AppError('This route is not for password updates, Please use /update-password.', 400))
   }
   const id = req.user._id;
   
   if(req.file.photo) req.body.photo = req.file.photo;
   

    const filterBody = filterObj(req.body, 'name', 'email', 'bio', 'photo');

    const user = await User.findByIdAndUpdate(id, filterBody, {new: true, runValidators: true})
   
    if(!user) return next('user not found', 404);

    res.status(200).json({
      status: 'success',
       data: user
    });

   
});


const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')){
        cb(null, true);
    }else{
        cb(new AppError('Plase choose photo', '400'), false);
    }
}

const upload = multer({ 
    storage: multerStorage,
    fileFilter: multerFilter
});


exports.resizeUserPhoto = (req, res, next) =>{
   

    if(!req.file) return next();
    

    req.file.filename = `${req.user?.username || req.body.name}-${Date.now()}.jpeg`.split(' ').join('');

    sharp(req.file.buffer)
    .resize(500, 500, {
        fit: sharp.fit.cover,
    })
    .toFormat('jpeg')
    .jpeg({ quality: 90})
    .toFile(`public/photos/users/${req.file.filename}`);
    
    req.file = file;
    next();
}

exports.upDateUserPhoto = upload.single('photo');


exports.deleteMe = catchAsync(async(req, res, next)=> {
    await User.findByIdAndUpdate(req.user._id, {active: false});

    res.status(204).json({
        status: 'success',
        data: null
    });
})


exports.testQuery = (req, res) => {
    'http://localhost:3000/api/v1/users/test-query?status=public&userId=2323'
    console.log(req.query);
    res.status(502).json({status: 'UNLOCKED', message: 'Developer is work at endpoint'})
}

exports.sendInvitation = catchAsync(async (req, res, next) => {
    const currentUser = await User.findById( req.params.id);
    currentUser.yourInvitations.push({userId: req.query.id, userName: req.query.name})
    await currentUser.save({ validateBeforeSave: false });
    
    res.status(200).json({
        status: 'success',
        data: currentUser
    });
})