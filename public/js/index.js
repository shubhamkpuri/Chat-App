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
    $('[name=message]').val('');
});

socket.on('newLocationMessage',function (message){
    var li= $('<li></li>');
    // alert("hi");
    var a = $("<a target='_blank'>My current location</a>");
    li.text(`${message.from} : `);
    a.attr('href',message.url);
    li.append(a);
    $('#messages').append(li);

})


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


var locationButton = $('#send-location');
locationButton.on('click',function (){
    if(!navigator.geolocation){
        return alert("geolocation not supported");
    }
    navigator.geolocation.getCurrentPosition(function (position){
        socket.emit("createLocationMessage",{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        });
    },function (){
        alert("Unable to fetch location");
    })

});
