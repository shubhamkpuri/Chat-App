var socket = io();

socket.on('connect',function (){
    console.log("connected to server");
    // socket.emit('createMessage',{
    //     from:"sk",
    //     text:"Ok"
    // })
});

socket.on('disconnect',function (){
    console.log("disconnected from server");
});
//Receiving data as email on newEmail
socket.on('newMessage', function (message){
    var li= $('<li></li>');
    // alert("hi");
    li.text(`${message.from} : ${message.text}`);

    $('#messages').append(li);
    // $('[name=message]').val()="";
});


$('#message-form').on('submit',function (e){
    e.preventDefault();
    // alert('hi');
    socket.emit('createMessage',{
        from:"mike",
        text:$('[name=message]').val()
    }, function (data){
        console.log("got it",data);
    });
});
