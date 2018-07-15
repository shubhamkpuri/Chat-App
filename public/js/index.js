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
    var template= $("#message-template").html();
     var formatedTime = moment(message.createdAt).format('h:mm a');
    var html = Mustache.render(template,{
        from:message.from,
        text:message.text,
        createdAt:formatedTime
    });
    $('#messages').append(html);

});

socket.on('newLocationMessage',function (message){
    var template= $("#location-message-template").html();
     var formatedTime = moment(message.createdAt).format('h:mm a');
    var html = Mustache.render(template,{
        from:message.from,
        url:message.url,
        createdAt:formatedTime
    });
    $('#messages').append(html);

})

var messageTexbox  =$('[name=message]');

$('#message-form').on('submit',function (e){
    e.preventDefault();
    // alert('hi');
    socket.emit('createMessage',{
        from:"User",
        text:messageTexbox.val()
    }, function (data){
        messageTexbox.val('');
    });
});


var locationButton = $('#send-location');
locationButton.on('click',function (){
    if(!navigator.geolocation){
        return alert("geolocation not supported");
    }
    locationButton.attr('disabled','disabled').text('Sending location...');
    navigator.geolocation.getCurrentPosition(function (position){
        socket.emit("createLocationMessage",{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        });
        locationButton.removeAttr('disabled').text('Send location');

    },function (){
        alert("Unable to fetch location");
        locationButton.removeAttr('disabled').text('Send location');

    })

});
