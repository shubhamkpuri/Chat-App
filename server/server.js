const express = require('express');
const http =require('http');
const path = require('path');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname,'../public');
const port =process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log("New user Connected");
    //Emitting data to user's end
    socket.emit('newMessage',generateMessage('Admin', "Welcome to the chat app"));
    socket.broadcast.emit('newMessage',generateMessage('Admin', "New user Joined"));
    socket.on('createMessage', (message, callback)=>{
        console.log("createEmail", message);
        io.emit('newMessage',generateMessage(message.from,message.text));
            callback('This is from server');

    });

    socket.on('createLocationMessage',(coords)=>{
        io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude, coords.longitude))
    })

    socket.on('disconnect',()=>{
        console.log("User was disconnected");
    });

});


server.listen(port,()=>{
    console.log(`Server is up at port ${port} `);
});
