var socketio = require('socket.io');

module.exports = function(server){
	var io = socketio.listen(server);

	io.on('connection', function(socket){
		console.log('client connected');
		socket.on('disconnect', function(){
			console.log('client disconnected');
		});

	});	

	return io;
} 