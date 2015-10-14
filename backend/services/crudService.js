var async = require('async');
var Event = require('../schemas/eventSchema');
var Room = require('../schemas/roomSchema');
var Device = require('../schemas/deviceSchema');
var User = require('../schemas/userSchema');
var eventRepository = require('../repositories/eventRepository');
var roomRepository = require('../repositories/roomRepository');
var userRepository = require('../repositories/userRepository');
var deviceRepository = require('../repositories/deviceRepository');

var crudService = function(){};

crudService.prototype.addEventToDevice = function(deviceId, eventId, callback){

	async.waterfall([

	function(cb){
		deviceRepository.getById(deviceId, function(err, data){
			if(err){
				cb(err, null);
				return;
			}

			cb(null, data);
			return;	
		});
	},
	function(device, cb){

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
		roomRepository.getById(roomId, function(err, data){
			if(err){
				cb(err, null);
				return;
			}

			cb(null, data);
			return;	
		});
	},
	function(room, cb){
		room.events.push(eventId);

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

crudService.prototype.removeEventFromDevice = function(deviceId, eventId, callback){
	async.waterfall([
		function(cb){
			deviceRepository.getById(deviceId, function(err, data){
				if(err){
					cb(err, null);
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

