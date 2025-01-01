const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
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
    const newUser = await User.create(req.body);
    res.status(200).json({
        status: 'success',
        message: 'User successfully register',
        token: createToken(newUser._id),
        data: newUser
    });
});