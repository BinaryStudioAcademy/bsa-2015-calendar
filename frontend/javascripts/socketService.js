var app = require('./app');

app.factory('socketService', ['socketFactory', 'alertify', function(socketFactory, alertify){
        var socket = socketFactory();

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
            alertify.log('Event has been created');
        }); 

        socket.on('update event notification', function(event){
            alertify.log('Event has been updated');
        });
        
        socket.on('delete event notification', function(event){
            alertify.log('Event has been deleted');
        });                                    

        return  socket;
}]);