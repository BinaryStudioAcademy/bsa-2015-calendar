var socketio = require('socket.io');
var passport = require('passport');
var cookieParser = require('cookie-parser');
//var config = require('../config/');
//var mongoStore = require('../units/context');
var passportSocketIo = require('passport.socketio');
var context = require('./context');
var socketManager = require('./socketManager');
var roomManager = require('./roomManager');
//var mediator = require('../units/mediator');
//require('./listener');

module.exports = function(server){
	
	context.io = socketio(server);

	context.io.use(passportSocketIo.authorize({
		cookieParser: cookieParser,
		key: 'connect.sid',     
		secret: 'SECRET',  
		store: context.mongoStore
	}));



	context.io.on('connection', function (socket) {
		// socketManager.addSocketForUser(socket.request.user._id, socket.id);
		console.log('user connected: ' + socket.request.user.username);

		// socket.on('logout', function(){
		// 	console.log('user logged out');
		// 	socket.disconnect();
		// });

		socket.on('notify', function(data){
			console.log('notify about events: ', data);
			socket.broadcast.emit('notify', data);
		});

		socket.on('disconnect', function () {
			// socketManager.removeSocketForUser(socket.request.user._id, socket.id);
			console.log('user disconnected: ' + socket.request.user.username);
		});

		socket.on('add event', function(data){
			console.log(data);
			console.log('SOCKET.IO: NEW event: ' + data.event.title);

			passportSocketIo.filterSocketsByUser(context.io, function(user){
				//console.log('\nUSER ID: ' + user._id);
				//console.log('\nUSER ID TYPE: ' + typeof(user._id)); //object
				//console.log('\nDATA USER IDS: ', data.event.users);
				//console.log('\nDATA EVENT: ', data.event);
				//console.log('\nDATA USER ID INDEX OF: ', data.event.users.indexOf(user._id.toString()));

				return data.event.users.indexOf(user._id.toString()) != -1;	//return all users who are assigned to the event
			}).forEach(function(socket){
				socket.emit('add event notification', data.event);	//send notifications to them
			});

		});

		socket.on('add device', function(data){
			console.log(data);
			console.log('SOCKET.IO: NEW device: ' + data.device.title);

			socket.broadcast.emit('add device notification', data.device);
		});

		socket.on('update device', function(data){
			console.log('SOCKET.IO: Update device');
			socket.broadcast.emit('update device notification', data.device);
		});

		socket.on('delete device', function(data){
			socket.broadcast.emit('delete device notification', data.device);
		});

		socket.on('add room', function(data){
			socket.broadcast.emit('add room notification', data.room);
		});

		socket.on('update room', function(data){
			socket.broadcast.emit('update room notification', data.room);
		});

		socket.on('delete room', function(data){
			socket.broadcast.emit('delete room notification', data.room);
		});

		socket.on('update event', function(data){
			socket.broadcast.emit('update event notification', data.room);
		});

		socket.on('delete event', function(data){
			socket.broadcast.emit('delete event notification', data.room);
		});				

		// socket.on('add-user-to-radio', function (radio_id) {
		// 	mediator.publish("add-user-to-radio", radio_id, socket.request.user._id);
		// 	roomManager.addRoomToUser(socket.request.user._id, 'radio_' + radio_id);
		// 	roomManager.addRoomToUser(socket.request.user._id, 'user_' + socket.request.user._id);
		// 	console.log('USER ID = ', socket.request.user._id);
		// 	console.log('Add user to radio', roomManager.getSocketsByRoom('radio_' + radio_id));
		// });

		// socket.on('add-notification', function (user_id, alert){
		// 	roomManager.addRoomToUser(user_id, 'notifications_' + user_id);
		// 	context.io.to('notifications_' + user_id).emit('new-notification', {user_id: user_id, alert: alert});
		// });

		// socket.on('add-message', function (options){
		// 	console.log('opts=', options);
		// 	var id1 = socket.request.user._id;
		// 	var id2 = options.recipient_id;
		// 	var arr = [id1, id2];
		// 	arr = arr.sort();
		// 	mediator.publish('add-message-to-dialogue', {user_auth1: id1, user_auth2: id2, options: options});
		// 	roomManager.addRoomToUser(id1, 'dialogue_' + arr[0] + '_' + arr[1]);
		// 	roomManager.addRoomToUser(id2, 'dialogue_' + arr[0] + '_' + arr[1]);
		// 	context.io.to('dialogue_' + arr[0] + '_' + arr[1]).emit('new-message',options);
		// });		


		// socket.on('create-radio-channel', function () {
		// 	mediator.publish("create-radio-channel", socket.request.user._id);
		// 	//roomManager.addRoomToUser(socket.request.user._id, 'radio_' + radio_id);
		// });

		// socket.on('ask-for-rights', function (radio_id) {
		// 	mediator.publish("add-to-requiring", {radioId: radio_id, userId: socket.request.user._id});
		// 	//roomManager.addRoomToUser(socket.request.user._id, 'radio_' + radio_id);
		// });

		// socket.on('add-to-editors', function (object) {
		// 	mediator.publish("add-to-editors", object);
		// 	mediator.once('added-to-editors', function(){
		// 		console.log('ADDED');
		// 		context.io.to('user_' + object.id).emit('added-to-editors', object.radio);
		// 	});
		// 	//roomManager.addRoomToUser(socket.request.user._id, 'radio_' + radio_id);
		// });

		// socket.on('remove-from-editors', function () {
		// 	mediator.publish("remove-from-editors", socket.request.user._id);
		// });

		// socket.on('play-this-track', function (object) {
		// 	console.log('Play this track', roomManager.getSocketsByRoom('radio_' + object.radio));
		// 	mediator.publish("get-track-info", object.id);
		// 	mediator.once("track-info", function(data){
		// 		context.io.to('radio_' + object.radio).emit('play-this-radio-track', data);
		// 	});
		// });

		// socket.on('stop-listening', function (id) {
		// 	mediator.publish("stop-listening", {userId : socket.request.user._id, radioId: id});
		// 	roomManager.removeUserFromRoom(socket.request.user._id, 'radio_' + id);
		// });

		// socket.on('stop-broadcasting', function (id) {
		// 	mediator.publish("stop-broadcasting", {userId : socket.request.user._id, radioId: id});
		// 	//roomManager.removeUserFromRoom(socket.request.user._id, 'radio_' + id);
		// });

		// socket.on('add-tracks-to-db', function (object) {
		// 	mediator.publish("add-tracks-to-db", object);
		// 	context.io.to('radio_' + object.radio).emit('add-to-collection-from-socket', object.collection);
		// });

		// socket.on('delete-track-from-list', function (object) {
		// 	mediator.publish("delete-track-from-list", object);
		// 	context.io.to('radio_' + object.radio).emit('delete-track-from-radio', object.id);
		// });
		
	});

	// mediator.on('radio-channel-created', function(object){
	// 	roomManager.addRoomToUser(object.userId, 'user_' + object.userId);
	// 	roomManager.addRoomToUser(object.userId, 'radio_' + object.radioId);
	// 	context.io.to('user_' + object.userId).emit('radio-channel-created', object);
	// });

	// mediator.on('request-for-rights', function(object){
	// 	context.io.to('user_' + object.master).emit('request-for-rights', object);
	// });

 return context.io;
};