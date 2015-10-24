var async = require('async');
var deviceRepository = require('../repositories/deviceRepository');
var eventRepository = require('../repositories/eventRepository');

var deviceService = function(){};


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
		},

		function(cb){
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
		function(cb){
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

// deviceService.prototype.availability = function(deviceId, dateStart, dateEnd, callback){
// 	var dateStartMs = Date.parse(dateStart).valueOf(),
// 		dateEndMs = Date.parse(dateEnd).valueOf();
	
// 	eventRepository.getByDeviceId(deviceId, function(err, events){
// 		async.forEach(events, function(event, next) { 
// 			//console.log(dateStartMs +' '+ event.start.valueOf() + ' ' + dateEndMs +' '+ event.end.valueOf());
//     		if ((dateStartMs <= event.end.valueOf()) && (dateStartMs >= event.start.valueOf())){
// 				return next(new Error('startTimeConflict'));
// 			}
// 			if ((dateEndMs <= event.end.valueOf()) && (dateEndMs >= event.start.valueOf())){
// 				return next(new Error('endTimeConflict'));
// 			}
// 			next();	
// 		}, function(err){
// 			if(err){
// 				//console.log(err);
// 				return callback(err, {availability: 'false'});	
// 			}
// 			// else?? bp
// 			return callback(null, {availability: 'true'});	
// 		});
// 	});
// };

module.exports = new deviceService();