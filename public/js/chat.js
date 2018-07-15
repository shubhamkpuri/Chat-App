var socket = io();

function scrollToBottom(){
    //Selectors
    var messages = $('#messages');
    var newMessage = messages.children('li:last-child');
    // height
    var clientHeight= messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}



socket.on('connect',function (){
        var params = $.deparam(window.location.search);
        socket.emit('join', params, function (err){
            if(err){
                alert(err);
                window.location.href ="/";
            }else{
                console.log("No error");
            }
        });
});

socket.on('disconnect',function (){
    console.log("disconnected from server");
});

socket.on('updateUserList',function(users){
    var ol = $('<ol></ol>');
    users.forEach(function (user){
            ol.append($('<li></li>').text(user));
    });
    $('#users').html(ol);
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
    scrollToBottom();
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
    scrollToBottom();

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
