var async = require('async');
var eventRepository = require('../repositories/eventRepository');
var userRepository = require('../repositories/userRepository');
var roomRepository = require('../repositories/roomRepository');
var deviceRepository = require('../repositories/deviceRepository');
var groupRepository = require('../repositories/groupRepository');
var _ = require('lodash');

var eventService = function(){};


eventService.prototype.add = function(data, callback){

	var event;

	async.waterfall([
		function(cb){
			if(data.room){
				eventRepository.checkRoomAvailability(data.room, data.start, data.end, function(err, result){
					if(err){
						return cb(err);
					}
					if(result.length){
						return cb(new Error('date/time conflict with room ' + data.room + '\nstart:' + data.start + ' \nend:' + data.end), result);
					}
					cb();
				});
			}
			else{
				cb();
			}
		},

		function(cb){
			async.forEach(data.devices, function(deviceId, next) { 
				eventRepository.checkDeviceAvailability(deviceId, data.start, data.end, function(err, result){
					if(err){
						return cb(err);
					}
					if(result.length){
						return cb(new Error('date/time conflict with device ' + deviceId + '\nstart:' + data.start + ' \nend:' + data.end), result);
					}
					next();
				});

			}, function(err, result){
				if(err){
					return cb(err, result);	
				}
				return cb();	
			});
		}, 
		function(cb){
			eventRepository.add(data, function(err, data){
				if(err){
					return cb(err, null);
				}
				event = data;
				cb();
			});
		},
		function(cb){
			if (event.room !== undefined){
				roomRepository.addEvent(event.room, event._id, function(err, data){
	 				if(err){
	 					return cb(err, null);
	 				}
	 				console.log('added to room');
	 				cb();
				});
			}
			else {
				console.log('no room');
				cb();
			}
		},
		function(cb){
			if(event.users.length){
				event.users.forEach(function(userId){
					userRepository.addEvent(userId, event._id, function(err, data){
	 					if(err){				
	 						return cb(err, null);
	 					}
	 					console.log('added to user');
					});

				});
				cb();
			}
			else{
				console.log('no users');
				cb();
			}
		},
		function(cb){
			if(event.devices.length){
				event.devices.forEach(function(deviceId){
					deviceRepository.addEvent(deviceId, event._id, function(err, data){
	 					if(err){
	 						return cb(err, null);
	 					}
					});
					console.log('added to device');
				});
				cb();
			}
			else{
				console.log('no devices');
				cb();
			}
		}
	], function(err, result){
		if(err){
			//console.log(err.message);
			return callback(err, result);
		}
		return callback(null, {success: true});
	});
};

eventService.prototype.delete = function(eventId, callback){

	var event;

	async.waterfall([
		function(cb){
			eventRepository.getById(eventId, function(err, data){
				if(err){				
					return cb(err);
				}
				if (!data){
					return cb(new Error("incorrect eventId " + eventId));
				}
				event = data;
				cb();
			});
		},
		function(cb){
			if (event.room !== undefined){
				roomRepository.removeEvent(event.room, eventId, function(err, data){
	 				if(err){
	 					return	cb(err, null);
	 				}
	 				console.log('delete from room');
				});
	
			}
			else {
				console.log('no room');
			}
			cb();
		},
		function(cb){
			if(event.users.length){
				event.users.forEach(function(userId){
					userRepository.removeEvent(userId, eventId, function(err, data){
	 					if(err){
	 						return	cb(err, null);
	 					}
	 					console.log('delete from user');
					});	
				});
			}
			else {
				console.log('no users');
			}
			cb();
		},
		function(cb){
			if(event.devices.length){
				event.devices.forEach(function(deviceId){
					deviceRepository.removeEvent(deviceId, eventId, function(err, data){
	 					if(err){
	 						return	cb(err, null);
	 					}
	 					console.log('delete from device');
					});
				});
			}
			else {
				console.log('no devices');
			}
			cb();
		},

		function(cb){
			groupRepository.removeEvent(eventId, function(err, data){
				if(err){
					return	cb(err, null);
				}
				console.log('delete from groups');
			});
			cb();
		},

		function(cb){
			eventRepository.delete(event._id, function(err, data){
				if(err){
					return cb(err, null);
				}
				cb(null, data);
			});
		}

	], function(err, result){
		if(err){
			//console.log(err);
			return callback(err, {success: false});
		}
		return callback(null, {success: true});
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
			if(newEvent.room){
				eventRepository.checkRoomAvailability(newEvent.room, newEvent.start, newEvent.end, function(err, result){
					if(err){
						return cb(err);
					}
					if(result.length){
						return cb(new Error('date/time conflict with room ' + newEvent.room + '\nstart:' + newEvent.start + ' \nend:' + newEvent.end), result);
					}
					cb();
				});
			}
			else{
				cb();
			}	
		},

		function(cb){
			async.forEach(newEvent.devices, function(deviceId, next) { 
				eventRepository.checkDeviceAvailability(deviceId, newEvent.start, newEvent.end, function(err, result){
					if(err){
						return cb(err);
					}
					if(result.length){
						return cb(new Error('date/time conflict with device ' + deviceId + '\nstart:' + newEvent.start + ' \nend:' + newEvent.end), result);
					}
					next();
				});
			}, function(err, result){
				if(err){
					return callback(err, result);	
				}
				return cb();	
			});
		}, 

		function(cb){
			eventRepository.getById(eventId, function(err, data){
				if(err){
					return cb(err, null);
				}
				if (!data){
					return cb("incorrect eventId " + eventId);
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
						return cb(err, null);
					}
				});
			});			

			usersToAdd.forEach(function(userId){
				userRepository.addEvent(userId, eventId, function(err, data){
					if(err){
						return cb(err, null);
					}
				});
			});

			devicesToDelete.forEach(function(deviceId){
				deviceRepository.removeEvent(deviceId, eventId, function(err, data){
					if(err){
						return cb(err, null);
					}
				});
			});

			devicesToAdd.forEach(function(deviceId){
				deviceRepository.addEvent(deviceId, eventId, function(err, data){
					if(err){
						return cb(err, null);
					}
				});
			});

			if(oldEvent.room !== newEvent.room){
				console.log("changing room");
				roomRepository.removeEvent(oldEvent.room, eventId, function(err, data){
					if(err){
						return cb(err, null);
					}
				});

				roomRepository.addEvent(newEvent.room, eventId, function(err, data){
					if(err){
						return cb(err, null);
					}
				});

			}

			eventRepository.update(eventId, newEvent, function(err, data){
				if(err){
					return cb(err, null);
				}
			});

			cb();
		}
	], function(err, result){
		if(err){
			return callback(err, {success: false});
		}
		return callback(null, {success: true});
	});
};

eventService.prototype.updateStartEnd = function(eventId, data, callback){
	var event;

	console.log("eventID: " + eventId);

	async.waterfall([
		function(cb){
			eventRepository.getById(eventId, function(err, result){
				if(err){				
					return cb(err);
				}
				if (!result){
					return cb(new Error("incorrect planId " + eventId));
				}
				event = result;
				cb();
			});
		},

		function(cb){
			if(event.room){
				eventRepository.checkRoomAvailability(event.room, data.start, data.end, function(err, result){
					if(err){
						return cb(err);
					}
					if(result.length){
						return cb(new Error('date/time conflict with room ' + event.room + '\nstart:' + data.start + ' \nend:' + data.end), result);
					}
					cb();
				});
			}
			else{
				cb();
			}	
		},

		function(cb){
			async.forEach(event.devices, function(deviceId, next) { 
				eventRepository.checkDeviceAvailability(deviceId, data.start, data.end, function(err, result){
					if(err){
						return cb(err);
					}
					if(result.length){
						return cb(new Error('date/time conflict with device ' + deviceId + '\nstart:' + data.start + ' \nend:' + data.end), result);
					}
					next();
				});
			}, function(err, result){
				if(err){
					return callback(err, result);	
				}
				return cb();	
			});
		}, 
		function(cb){
			event.start = data.start;
			event.end = data.end;		

			eventRepository.update(eventId, event, function(err, data){
				if(err){
					return cb(err, null);
				}
			});

			cb();
		}
	], function(err, result){
		if(err){
			return callback(err, {success: false});
		}
		return callback(null, {success: true});
	});
};

module.exports = new eventService();