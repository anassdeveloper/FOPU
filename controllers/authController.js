const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');


const createToken = userID => {
    const token = jwt.sign({id: userID}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    return token;
}

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    
    console.log(email, password);

    if(!email || !password) {
        next(new AppError('Please provide email or password', 400));
    }
    const user = await User.findOne({ email }).select('+password');

    
    
    if(!user ||  !(await user.correctPassword(password, user.password))) 
        next(new AppError('Incorrect email or pasword', 401));

    const token = createToken(user._id);

    res.cookie('token', token, {
        httpOnly: true
    });

    // req.locals.user = user;

    res.status(200).json({
        status: 'success',
        token: createToken(user._id)
    });
});

exports.protectRoute = catchAsync(async (req, res, next) => {

    const { token } = req.cookies;
    
    if(!token) 
        return next(new AppError('Please login to your account', 401));

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    
    if(!currentUser) 
        return next(new AppError('Your account not exist ', 401));

    if(currentUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('You changed Password login again', 401));
    }
    res.locals.user = currentUser;
    req.user = currentUser;
    next();

});


exports.protectRouteAuthorization = catchAsync(async (req, res, next) => {
    let token;
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) token = req.headers.authorization.split(' ')[1];
        
    if(!token){
        return next(new AppError('You are Not logged', 401));
    }
    
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    
    if(!user) 
        return next(new AppError('Your account not exist ', 401));

    if(user.changedPasswordAfter(decoded.iat)){
        return next(new AppError('You changed Password login again', 401));
    }

    req.user = user;

    next();
});

exports.restrictTo = (...roles) => {
    
    return (req, res, next) => {
        console.log(req.user);
        if(!roles.includes(req.user.role)){
          return next(new AppError('You not have a permision to delet acount', 403))
        }
        next();
     }
}

exports.forgetPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if(!user){
        return next(new AppError('No user found with this address email', 404))
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    
    res.status(200).json({
        token: resetToken
    })
})