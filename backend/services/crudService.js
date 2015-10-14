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
		//console.log('device TITLE: ' + device.title);
		//console.log('device ID: ' + device._id);

		device.events.push(eventId);
		console.log('device EVENTS: ' + device.events);

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
		//console.log('device TITLE: ' + device.title);
		//console.log('device ID: ' + device._id);

		user.events.push(eventId);
		//console.log('device EVENTS: ' + device.events);

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
		//console.log('device TITLE: ' + device.title);
		//console.log('device ID: ' + device._id);

		room.events.push(eventId);
		//console.log('device EVENTS: ' + device.events);

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

// crudService.prototype.removeEventFromDevice(device, event, callback){
	
// }

// crudService.prototype.removeEventFromRoom(device, event, callback){
	
// }

// crudService.prototype.removeEventFromRoom(device, event, callback){
	
// }

module.exports = new crudService();

