const express = require('express');
const path = require('path');
const app = express();
const AppError = require('./utils/appError');
const cookieParser = require('cookie-parser');

//ALL REQUIRE ROUTER
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const postRouter = require('./routes/postRouter');
const viewRouter = require('./routes/viewRouter');
let globalErrorHandler = require('./controllers/errorController')


// build in middelware in express
app.use(express.json());
app.use(cookieParser());



// add frame worl
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// add some middleware of build static view
app.use(express.static('./public'));


// use all router as middlware of express
app.use('/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/', viewRouter);

app.all('*', (req, res, next)=> {
    next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);
module.exports = app;