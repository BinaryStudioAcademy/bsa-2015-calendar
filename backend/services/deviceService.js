var async = require('async');
var deviceRepository = require('../repositories/deviceRepository');
var eventRepository = require('../repositories/eventRepository');

var deviceService = function(){};

// при удалении девайса, удаляем его идентификатор из все ивентов, которые его содержат
deviceService.prototype.delete = function(deviceId, callback){

	var device;
	async.waterfall([
		function(cb){
			deviceRepository.getById(deviceId, function(err, data){
				if(err){
					return cb(err, null);
				}
				if (!data){
					return cb("incorrect deviceId " + deviceId);
				}
				device = data;
				cb();
			});
		}, // получаем экземпляр девайса

		function(cb){ // проходим по ивентам подписанным на этот девайс и удаляем запись о нем
			console.log('working on events');

			if(device.events.length){
				device.events.forEach(function(eventId){
					eventRepository.removeDevice(eventId, device._id, function(err, data){
						if(err){
							return cb(err, null);
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
		function(cb){ // удаляем девайс
			deviceRepository.delete(device._id, function(err, data){
				if(err){
					return cb(err, null);
				}
				cb(null, data);
			});
		}

	], function(err, result){
		if(err){
			console.log(err);
			return callback(err, {success: false});
		}
		callback(null, {success: true});
		return;
	});
};

module.exports = new deviceService();