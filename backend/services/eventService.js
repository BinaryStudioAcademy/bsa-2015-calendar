var async = require('async');
var eventRepository = require('../repositories/eventRepository');
var userRepository = require('../repositories/userRepository');
var roomRepository = require('../repositories/roomRepository');
var deviceRepository = require('../repositories/deviceRepository');
var crudService = require('./crudService');

var eventService = function(){};


eventService.prototype.add = function(data, callback){

	var event;

	async.waterfall([
		function(cb){
			eventRepository.add(data, function(err, data){
				if(err){
					cb(err, null);
					return;
				}

				event = data;
				cb();
			});
		},

		function(cb){
			if (event.room != undefined){
				roomRepository.addEvent(event.room, event._id, function(err, data){
	 				if(err){
	 					cb(err, null);
	 					return;
	 				};
				});
				console.log('added to room');
			}
			else {
				console.log('no room');
			}
			cb();

		},
		function(cb){
			console.log('working on users');

			if(event.users.length){
				event.users.forEach(function(userId){
					// crudService.addEventToUser(userId, event._id, function(err, data){					
					// 	if(err){
					// 		cb(err, null);
					// 		return;
					// 	}
					// 	console.log('added to users');
					// 	cb();
					// });
					userRepository.addEvent(userId, event._id, function(err, data){
	 				if(err){
	 					cb(err, null);
	 					return;
	 				};
				});
				console.log('added to user');
				});
			}
			else{
				cb();
				console.log('no users');
			}

		},
		function(cb){
			console.log('working on devices');

			if(event.devices.length){
				event.devices.forEach(function(deviceId){
					// crudService.addEventToDevice(deviceId, event._id, event.start,  event.end, function(err, data){
					// 	if(err){
					// 		cb(err, null);
					// 		return;
					// 	}
					// 	console.log('added to devices');
					// 	cb();
					// });	
					deviceRepository.addEvent(deviceId, event._id, function(err, data){
	 					if(err){
	 						cb(err, null);
	 						return;
	 					};
					});
					console.log('added to room');
				});
			}
			else{
				console.log('no devices -> cb()');
				cb();
			}
		}

	], function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
			return;
		}
		callback(null, {success: 'true'});
		return;
	});
};

eventService.prototype.delete = function(eventId, callback){

	var event;

	async.waterfall([
		function(cb){
			eventRepository.getById(eventId, function(err, data){
				if(err){
					cb(err, null);
					return;
				}
				if (!data){
					cb("incorrect eventId " + eventId);
					return;
				}
				event = data;
				ev = data;
				cb();
			});
		},
		function(cb){
			if (ev.room != undefined){
				roomRepository.removeEvent(ev.room, eventId, function(err, data){
	 				if(err){
	 					cb(err, null);
	 					return;
	 				};
				});
				console.log('delete from room');
			}
			else {
				console.log('no room');
			}
			cb();
		},
		function(cb){
			if(ev.users.length){
				ev.users.forEach(function(userId){
					userRepository.removeEvent(userId, eventId, function(err, data){
	 					if(err){
	 						cb(err, null);
	 						return;
	 					};
					});
					console.log('delete from user');
				});
			}
			else {
				console.log('no users');
			}
			cb();
		},
		function(cb){
			if(ev.devices.length){
				ev.devices.forEach(function(deviceId){
					deviceRepository.removeEvent(deviceId, eventId, function(err, data){
	 					if(err){
	 						cb(err, null);
	 						return;
	 					};
					});
					console.log('delete from device');
				});
			}
			else {
				console.log('no devices');
			}
			cb();
		},
		function(cb){
			eventRepository.delete(event._id, function(err, data){
				if(err){
					cb(err, null);
					return;
				}
				cb(null, data);
			});
		}

	], function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
			return;
		}
		callback(null, {success: 'true'});
		return;
	});
};

module.exports = new eventService();