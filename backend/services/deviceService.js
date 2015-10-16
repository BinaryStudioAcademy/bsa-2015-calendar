var async = require('async');
var Event = require('../schemas/eventSchema');
var eventRepository = require('../repositories/eventRepository');
var deviceRepository = require('../repositories/deviceRepository');
var crudService = require('./crudService');

var deviceService = function(){};

deviceService.prototype.delete = function(deviceId, callback){
	
	var device;

	async.waterfall([
		function(cb){

			deviceRepository.getById(deviceId, function(err, data){
				if(err){
					cb(err, null);
					return;
				}
				device = data;
				cb();
				return;
			});
		},
		function(cb){
			if(!device.events.length) cb();

			device.events.forEach(function(eventId){
				eventRepository.getById(eventId, function(err, event){
					if(err){
						cb(err, null);
						return;
					}

					var index = event.devices.indexOf(device._id);
					event.splice(index, 1);

					event.save(function(err, data){
						if(err){
							cb(err, null);
							return;
						}
					})

				});


			});
			
			cb();
			return;
		},
		function(cb){
			deviceRepository.delete(device._id, function(err, data){
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
		callback(null, { success : true });
		return;
	});

};

module.exports = new deviceService();