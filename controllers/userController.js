const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');


const createToken = userID => {
    const token = jwt.sign({id: userID}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    return token;
}


exports.getAllUsers = catchAsync(async(req, res) => {
    const users = await User.find();

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
         photo: req.file.photo
     });

     res.status(200).json({
         status: 'success',
         message: 'User successfully register',
         token: createToken(newUser._id),
         data: newUser
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