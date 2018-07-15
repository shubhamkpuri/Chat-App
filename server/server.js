const express = require('express');
const http =require('http');
const path = require('path');
const socketIO = require('socket.io');
const mustache = require('mustache');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation.js');
const { Users } = require('./utils/users.js');
const publicPath = path.join(__dirname,'../public');
const port =process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log("New user Connected");
    //Emitting data to user's end

    socket.on('join',(params,callback) =>{
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('Name and room name are required');
        }
        socket.join(params.room);
        // io.emit  -> io.to(room_name).emit
        //socket.broadcast.emit -> socket.broadcast.to(room_name).emit
        users.removeUser(socket.id);
        users.addUser(socket.id,params.name, params.room);

        io.to(params.room).emit('updateUserList',users.getUserList(params.room));
        socket.emit('newMessage',generateMessage('Admin', "Welcome to the chat app"));
        socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin', `${params.name} has joined.`));

        callback();
    })
    socket.on('createMessage', (message, callback)=>{
        console.log("createEmail", message);
        io.emit('newMessage',generateMessage(message.from,message.text));
            callback('This is from server');

    });

    socket.on('createLocationMessage',(coords)=>{
        io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude, coords.longitude))
    })

    socket.on('disconnect',()=>{
        console.log(users.getUser(socket.id));
        var user = users.removeUser(socket.id);
        if(user){
            console.log("user left");
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMessage',generateMessage('Admin', `${user.name} has left.`));
        }
        console.log("user left",user);
    });

});


server.listen(port,()=>{
    console.log(`Server is up at port ${port} `);
});
