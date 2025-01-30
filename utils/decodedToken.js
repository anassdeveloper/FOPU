const { promisify } = require('util');
const AppError = require('../utils/appError');const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');


const decodedToken = catchAsync( async token => {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    return decoded;
});

module.exports = decodedToken;