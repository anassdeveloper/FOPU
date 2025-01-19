const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log('UNCAUGHT EXCEPTION 🔥 SHOT DOWN...');
    process.exit(1);
});

const DB_URL = process.env.DATABASE_MONGODB
.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose
.connect(DB_URL).then(db => {
    console.log('Database Connection successfuly');
});

const io = new Server(server, {cors: '*'});

server.listen(PORT, () => {
    console.log(`SERVER RUN AT : ${PORT}`);
});

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    
    console.log('UNHANDLED REJECTION 🔥 SHOT DOWN...');
    server.close(() => {
        process.exit(1);
    })
});



io.on('connect', socket => {
   console.log(socket.id);

   socket.on('chatMsg', message => {
     
     io.emit("message",message);
   })
   
   socket.on('write', message => {
      console.log(message)
      io.emit('write', message);
   });
        
   socket.on('stop_write', () => io.emit('stop'))
});