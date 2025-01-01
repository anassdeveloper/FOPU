const app = require('./app');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const PORT = process.env.PORT || 8000;
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log('UNCAUGHT EXCEPTION 🔥 SHOT DOWN...');
    process.exit(1);
});


mongoose
.connect(process.env.DATABASE_LOCAL).then(db => {
    console.log('Database Connection successfuly');
})

const server = app.listen(PORT, (_) => {
    console.log(`SERVER RUN AT : ${PORT}`);
});

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION 🔥 SHOT DOWN...');
    server.close(() => {
        process.exit(1);
    })
});