const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const decodedToken = require('./utils/decodedToken');

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;
const mongoose = require('mongoose');
const User = require('./models/userModel');

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



io.on('connection',socket => {
 
   io.emit("connection",{message: 'work'})
   socket.on('online',async  on => {
     await User.findByIdAndUpdate(on.message, {online: new Date()});
   });
   socket.on('enlign', m => {
    console.log(m)
   })
  
   

   socket.on('chatMsg', message => {
     io.emit("message",message);
   })
   
   socket.on('write', message => {
      
      io.emit('write', message);
   });
        
   socket.on('stop_write', () => io.emit('stop'))

   socket.on('disconnect', m => console.log(m))
});