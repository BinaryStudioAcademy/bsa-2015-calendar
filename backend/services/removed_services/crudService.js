var async = require('async');
var eventRepository = require('../repositories/eventRepository');
var roomRepository = require('../repositories/roomRepository');
var userRepository = require('../repositories/userRepository');
var deviceRepository = require('../repositories/deviceRepository');

var crudService = function(){};

crudService.prototype.addEventToDevice = function(deviceId, eventId, eventStart, eventEnd, callback){

	

	async.waterfall([

	function(cb){
		deviceRepository.getById(deviceId, function(err, data){
			if(err){
				cb(err, null);
				return;
			}
			if (!data){
				cb("incorrect deviceId " + deviceId + " in event.devices, eventId" + eventId);
					return;
			}
			cb(null, data);
			return;	
		});
	},
	function(device, cb){
		console.log(eventId);
		// device.events.forEach(function(deviceEvent){
		// 	//console.log(event.start.valueOf() + ">" + deviceEvent.end.valueOf() + "||" + event.end.valueOf() + "<" + deviceEvent.start.valueOf());
		// 	//if ((event.start.valueOf() > deviceEvent.end.valueOf()) || (event.end.valueOf() < deviceEvent.start.valueOf())) 
				
		// 	if ((eventStart.valueOf() < deviceEvent.end.valueOf()) && (eventStart.valueOf() > deviceEvent.start.valueOf())){
		// 		cb("startTimeConflict");
		// 		return;
		// 	}
		// 	if ((eventEnd.valueOf() < deviceEvent.end.valueOf()) && (eventEnd.valueOf() > deviceEvent.start.valueOf())){
		// 		cb("endTimeConflict");
		// 		return;
		// 	}
		// });

		device.events.push(eventId);
		deviceRepository.update(deviceId, device, function(err, data){
			if(err){
				cb(err, null);
				return;
			}
			cb(null, data);
			return;	
		});	
	}
	], function(err, result){
		if(err){
			callback(err, null);
			return;
		}

		callback(null, result);
		return;
	});
};

crudService.prototype.addEventToUser = function(userId, eventId, callback){
	async.waterfall([

	function(cb){
		userRepository.getById(userId, function(err, data){
			if(err){
				cb(err, null);
				return;
			}
			if (!data){
				cb("incorrect userId " + userId + " in event.users, eventId " + eventId);
				return;
			}
			cb(null, data);
			return;	
		});
	},
	function(user, cb){

		user.events.push(eventId);

		userRepository.update(userId, user, function(err, data){
			if(err){
				cb(err, null);
				return;
			}

			cb(null, data);
			return;	
		});

	}

	], function(err, result){
		if(err){
			callback(err, null);
			return;
		}

		callback(null, result);
		return;
	});	
 };

crudService.prototype.addEventToRoom = function(roomId, eventId, callback){
	
	

	async.waterfall([
	function(cb){
		roomRepository.addEvent(roomId, eventId, function(err, data){
	 		if(err){
	 			cb(err, null);
	 			return;
	 		};
		});
	},
	// function(cb){
	// 	roomRepository.getById(roomId, function(err, data){
	// 		if(err){
	// 			cb(err, null);
	// 			return;
	// 		}

	// 		if (!data){
	// 			cb("incorrect roomId " + roomId + " in event " + eventId);
	// 			return;
	// 		}

	// 		cb(null, data);
	// 		return;	
	// 	});
	// },
	// function(room, cb){
	// 	room.events.push(eventId);

	// 	roomRepository.update(roomId, room, function(err, data){
	// 		if(err){
	// 			cb(err, null);
	// 			return;
	// 		}

	// 		cb(null, data);
	// 		return;	
	// 	});

	// }

	], function(err, result){
		if(err){
			callback(err, null);
			return;
		}

		callback(null, result);
		return;
	});		
};

crudService.prototype.removeEventFromDevice = function(deviceId, eventId, callback){
	async.waterfall([
		function(cb){
			deviceRepository.getById(deviceId, function(err, data){
				if(err){
					cb(err, null);
					return;
				}
				if (!data){
					cb("incorrect eventId " + eventId + " in device.users, deviceId " + deviceId);
					return;
				}
				cb(null, data);
				return;
			});
		},
		function(device, cb){
			var index = device.events.indexOf(eventId);
			if( index > -1 ) device.events.splice(index, 1);

			deviceRepository.update(deviceId, device, function(err, data){
				if(err){
					cb(err, null);
					return;
				}
				cb(null, data);
				return;
			});
		}
	], function(err, result){
		if(err){
			callback(err, null);
			return;
		}

		callback(null, result);
		return;
	});
};

crudService.prototype.removeEventFromRoom = function(roomId, eventId, callback){

	async.waterfall([
		function(cb){
			roomRepository.getById(roomId, function(err, data){
				if(err){
					cb(err, null);
					return;
				}
				if (!data){
					cb("incorrect roomId " + roomId + " in event " + eventId);
					return;
				}
				cb(null, data);
				return;
			});
		},
		function(room, cb){
			var index = room.events.indexOf(eventId);
			if( index > -1 ) room.events.splice(index, 1);

			roomRepository.update(roomId, room, function(err, data){
				if(err){
					cb(err, null);
					return;
				}
				cb(null, data);
				return;
			});
		}
	], function(err, result){
		if(err){
			callback(err, null);
			return;
		}

		callback(null, result);
		return;
	});
	
};

crudService.prototype.removeEventFromUser = function(userId, eventId, callback){
		async.waterfall([
		function(cb){
			userRepository.getById(userId, function(err, data){
				if(err){
					cb(err, null);
					return;
				}
				if (!data){
					cb("incorrect userId " + userId + " in event.users, eventId " + eventId);
					return;
				}
				cb(null, data);
				return;
			});
		},
		function(user, cb){
			var index = user.events.indexOf(eventId);
			if( index > -1 ) user.events.splice(index, 1);

			userRepository.update(userId, user, function(err, data){
				if(err){
					cb(err, null);
					return;
				}
				cb(null, data);
				return;
			});
		}
	], function(err, result){
		if(err){
			callback(err, null);
			return;
		}

		callback(null, result);
		return;
	});
};

module.exports = new crudService();
