var async = require('async');
var eventTypeRepository = require('../repositories/eventTypeRepository');
var eventRepository = require('../repositories/eventRepository');
var eventTypeService = function(){};

eventTypeService.prototype.delete = function(eventTypeId, callback){

	var eventType;
	async.waterfall([
		function(cb){
			eventTypeRepository.getById(eventTypeId, function(err, data){
				if(err){
					return cb(err, null);
				}
				if (!data){
					return cb("incorrect eventTypeId " + eventTypeId);
				}
				eventType = data;
				cb();
			});
		},

		function(cb){
			if(eventType.events.length){
				eventType.events.forEach(function(eventId){
					eventRepository.removeEventType(eventId, eventType._id, function(err, data){
						if(err){
							return cb(err, null);
						}
						console.log('delete eventType from events');
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
			eventTypeRepository.delete(eventType._id, function(err, data){
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
		return callback(null, {success: true});
	});
};


module.exports = new eventTypeService();