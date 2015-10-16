var async = require('async');
var Event = require('../schemas/eventSchema');
var eventRepository = require('../repositories/eventRepository');
var userRepository = require('../repositories/userRepository');
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
				return;
			});
		},
		function(cb){

			if(!event.room){
				cb();
				return;	
			} 
			crudService.addEventToRoom(event.room, event._id, function(err, data){
				if(err){
					cb(err, null);
					return;
				}

				cb();
				return;
			});
		},
		function(cb){
			console.log('working on users');

			if(!event.users.length) cb();

			event.users.forEach(function(userId){

				crudService.addEventToUser(userId, event._id, function(err, data){
					console.log('added ');
					if(err){
						cb(err, null);
						return;
					}

				});
			});

			cb();
			return;
		},
		function(cb){

			console.log('working on devices');

			if(!event.devices.length){
				console.log('no devices -> cb()');
				cb();
			}

			event.devices.forEach(function(deviceId){

				crudService.addEventToDevice(deviceId, event._id, function(err, data){
					console.log('added ');
					if(err){
						cb(err, null);
						return;
					}

				});
			});

			cb();
			return;
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

				event = data;
				cb();
				return;
			});
		},
		function(cb){
			if(!event.room){ cb(); return; }
			crudService.removeEventFromRoom(event.room, event._id, function(err, data){
				if(err){
					cb(err, null);
					return;
				}

				cb();
				return;
			});
		},
		function(cb){
			console.log('working on users');

			if(!event.users.length) { cb(); return; }

			event.users.forEach(function(userId){

				crudService.removeEventFromUser(userId, event._id, function(err, data){
					if(err){
						cb(err, null);
						return;
					}

				});
			});

			cb();

			return;

		},
		function(cb){

			console.log('working on devices');

			if(!event.devices.length){
				console.log('no devices -> cb()');
				cb();
				return;
			}

			event.devices.forEach(function(deviceId){

				crudService.removeEventFromDevice(deviceId, event._id, function(err, data){
					console.log('added ');
					if(err){
						cb(err, null);
						return;
					}

				});
			});

			cb();
			return;
		},
		function(cb){
			eventRepository.delete(event._id, function(err, data){
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
			console.log(err);
			callback(err, null);
			return;
		}
		callback(null, {success: 'true'});
		return;
	});
};


//TODO : update event, create plan, update plan, delete plan, 
//delete group, update group

module.exports = new eventService();