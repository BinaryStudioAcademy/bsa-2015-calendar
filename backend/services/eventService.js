var async = require('async');
var Event = require('../schemas/eventSchema');
var eventRepository = require('../repositories/eventRepository');
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

			crudService.addEventToRoom(event.room, event._id, function(err, data){
				if(err){
					cb(err, null);
					return;
				}

				cb();
			});

			// roomRepository.getById(data.room, function(err, data){
			// 	if(err){
			// 		cb(err, null);
			// 		return;
			// 	}

			// 	data.events.push(event);
			// 	roomRepository.update(data._id, data, function(err, data){
			// 		if(err){
			// 			cb(err, null);
			// 			return;
			// 		}

			// 		cb();
			// 	});
			// });

		},
		function(cb){
			console.log('working on users');

			if(!event.users.length) cb();

			event.users.forEach(function(element, index, array){				
				userRepository.getById(element, function(err, data){
					if(err){
						cb(err, null);
						return;
					}

					data.events.push(event);
					userRepository.update(data._id, data, function(err, data){
						if(err){
							cb(err, null);
							return;
						}												
					});
				});
			});

			cb();

		},
		function(cb){

			console.log('working on devices');

			if(!event.devices.length){
				console.log('no devices -> cb()');
				cb();
			}

			event.devices.forEach(function(deviceId, index, array){

				crudService.addEventToDevice(deviceId, event._id, function(err, data){
					console.log('added ');
					if(err){
						cb(err, null);
						return;
					}

				});
			});

			cb();
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