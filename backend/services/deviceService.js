var async = require('async');
var deviceRepository = require('../repositories/deviceRepository');
var deviceCrudService = require('./deviceCrudService');

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
				if (!data){
					cb("incorrect deviceId " + deviceId);
					return;
				}
				device = data;
				cb();
			});
		},

		function(cb){
			console.log('working on events');

			if(device.events.length){
				device.events.forEach(function(eventId){
					deviceCrudService.removeDeviceFromEvent(eventId, device._id, function(err, data){
						if(err){
							cb(err, null);
							return;
						}
						console.log('delete device from events');
						cb();
					});	
				});
			}
			else {
				console.log('no events');
				cb();
			}
		},
		function(cb){
			deviceRepository.delete(device._id, function(err, data){
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

module.exports = new deviceService();