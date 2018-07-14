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
    var formatedTIme = moment(message.createdAt).format('h:mm a');
    var li= $('<li></li>');
    // alert("hi");
    li.text(`${message.from} ${formatedTIme}: ${message.text}`);
    $('#messages').append(li);

});

socket.on('newLocationMessage',function (message){
    var formatedTIme = moment(message.createdAt).format('h:mm a');
    var li= $('<li></li>');
    // alert("hi");
    var a = $("<a target='_blank'>My current location</a>");
    li.text(`${message.from}  ${formatedTIme}: `);
    a.attr('href',message.url);
    li.append(a);
    $('#messages').append(li);

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
