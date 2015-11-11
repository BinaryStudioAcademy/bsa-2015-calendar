var app = require('./app'),
    moment = require('moment');

app.factory('socketService', ['socketFactory', 'Notification', 'alertify', function(socketFactory, Notification, alertify){
        var socket = socketFactory();

        socket.on('notify', function(events){
            console.log('notify for events', events);
          for(var i = 0; i < events.length; i++){
            var lapse = new Date(events[i].start) - new Date();
            lapse = lapse / ( 1000 * 60 ) + 1;
            lapse = Math.floor(lapse);
            Notification.success({message: "Event '" + events[i].title + "' starts in " + lapse + " minute(s).", delay: 300000});
            //alertify.delay(300000).closeLogOnClick(true).log("Event '" + result.data[i].title + "' starts in " + lapse + " minutes.");
          }
        });

        socket.on('add device notification', function(device){

            console.log(device);
            console.log('SOCKETIO: NEW DEVICE');
            alertify.log("New device has been added");
        });

        socket.on('update device notification', function(device){
            console.log(device);
            alertify.log("Device has been updated");
        });

        socket.on('delete device notification', function(device){
            alertify.log("Device has been deleted");
        });

        socket.on('add room notification', function(room){
            alertify.log('New room has been added');
        });

        socket.on('update room notification', function(room){
            alertify.log('Romm has been updated');
        });

        socket.on('delete room notification', function(room){
            alertify.log('Room has been deleted');
        });

        socket.on('add event notification', function(event){
            console.log('event has been added');
            Notification.success({message: "You have been assigned to '" + event.title + "' event, starting at " +
                moment(event.start).format("MMMM Do, YYYY, @HH:mm") + "!\nCheck out the calendar for more info!", delay: 300000});
            //alertify.log('Event has been created');
        }); 

        socket.on('update event notification', function(event){
            alertify.log('Event has been updated');
        });
        
        socket.on('delete event notification', function(event){
            alertify.log('Event has been deleted');
        });                                    

        return  socket;
}]);