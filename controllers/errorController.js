const AppError = require("../utils/appError");


const sendMsgError = (status, message) => {

}

const handlError = err => new AppError('Invalid token please login again', 401)

const sendErrorProd = (err, res)=> {
    let message;
    if(err.name === 'CastError'){
        message = `Check ${err.path} : ${err.value}`
        res.status(404).json({
            status: 'Fail',
            message
        })
    }
    if(err.name === 'JsonWebTokenError') handlError(err);

    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: message || err.message,
        stack: err.stack
    });
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }
    sendErrorProd(err, res, next);
}