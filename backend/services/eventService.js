var async = require('async');
var eventRepository = require('../repositories/eventRepository');
var userRepository = require('../repositories/userRepository');
var roomRepository = require('../repositories/roomRepository');
var deviceRepository = require('../repositories/deviceRepository');
var crudService = require('./crudService');
var _ = require('lodash');

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
			if (event.room !== undefined){
				roomRepository.addEvent(event.room, event._id, function(err, data){
	 				if(err){
	 					cb(err, null);
	 					return;
	 				}
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
	 				}
				});
				console.log('added to user');
				});

				cb();
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
	 					}
					});
					console.log('added to room');
				});

				cb();
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
			if (ev.room !== undefined){
				roomRepository.removeEvent(ev.room, eventId, function(err, data){
	 				if(err){
	 					cb(err, null);
	 					return;
	 				}
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
	 					}
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
	 					}
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

eventService.prototype.update = function(eventId, newEvent, callback){
	var usersToAdd = [],
		usersToDelete = [],
		devicesToAdd = [],
		devicesToDelete = [],
		oldEvent;

	console.log("eventID: " + eventId);

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
				oldEvent = data;
				cb();
			});
		},
		function(cb){
			usersToAdd = _.difference(newEvent.users, oldEvent.users);
			usersToDelete = _.difference(oldEvent.users, newEvent.users);
			devicesToAdd = _.difference(newEvent.devices, oldEvent.devices);
			devicesToDelete = _.difference(oldEvent.devices, newEvent.devices);

			console.log("old devices: " + oldEvent.devices);
			console.log("new devices: " + newEvent.devices);

			console.log("devices to add: " + devicesToAdd);
			console.log("devices to delete: " + devicesToDelete);

			usersToDelete.forEach(function(userId){
				userRepository.removeEvent(userId, eventId, function(err, data){
					if(err){
						cb(err, null);
						return;
					}
				});
			});			

			usersToAdd.forEach(function(userId){
				userRepository.addEvent(userId, eventId, function(err, data){
					if(err){
						cb(err, null);
						return;
					}
				});
			});

			devicesToDelete.forEach(function(deviceId){
				deviceRepository.removeEvent(deviceId, eventId, function(err, data){
					if(err){
						cb(err, null);
						return;
					}
				});
			});

			devicesToAdd.forEach(function(deviceId){
				deviceRepository.addEvent(deviceId, eventId, function(err, data){
					if(err){
						cb(err, null);
						return;
					}
				});
			});

			if(oldEvent.room !== newEvent.room){
				console.log("changing room");
				roomRepository.removeEvent(oldEvent.room, eventId, function(err, data){
					if(err){
						cb(err, null);
						return;
					}
				});

				roomRepository.addEvent(newEvent.room, eventId, function(err, data){
					if(err){
						cb(err, null);
						return;
					}
				});

			}

			eventRepository.update(eventId, newEvent, function(err, data){
				if(err){
					cb(err, null);
					return;
				}
			});



			cb();
		}
	], function(err, result){
		if(err){
			callback(err, null);
		}

		callback(null, {success: true});
	});


};

module.exports = new eventService();