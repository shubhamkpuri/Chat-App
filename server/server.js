const express = require('express');
const http =require('http');
const path = require('path');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname,'../public');
const port =process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log("New user Connected");

    socket.on('disconnect',()=>{
        console.log("User was disconnected");
    });
});


server.listen(port,()=>{
    console.log(`Server is up at port ${port} `);
});
