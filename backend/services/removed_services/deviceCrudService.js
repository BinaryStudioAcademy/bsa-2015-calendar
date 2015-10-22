var async = require('async');
var eventRepository = require('../repositories/eventRepository');


var deviceCrudService = function(){};

deviceCrudService.prototype.removeDeviceFromEvent = function(eventId, deviceId, callback){
	async.waterfall([
		function(cb){
			eventRepository.getById(eventId, function(err, data){
				if(err){
					cb(err, null);
					return;
				}
				if (!data){
					cb("incorrect eventId " + eventId + " in device.evenets, deviceId " + deviceId);
					return;
				}
				cb(null, data);
				return;
			});
		},
		function(event, cb){
			var index = event.devices.indexOf(deviceId);
			if( index > -1 ) event.devices.splice(index, 1);

			eventRepository.update(eventId, event, function(err, data){
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

module.exports = new deviceCrudService();