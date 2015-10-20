var async = require('async');
var eventRepository = require('../repositories/eventRepository');
var roomRepository = require('../repositories/roomRepository');

var roomCrudService = function(){};

roomCrudService.prototype.removeRoomFromEvent = function(eventId, roomId, callback){
	async.waterfall([
		function(cb){
			eventRepository.getById(eventId, function(err, data){
				if(err){
					cb(err, null);
					return;
				}
				if (!data){
					cb("incorrect eventId " + eventId + " in room.evenets, roomId " + roomId);
					return;
				}
				cb(null, data);
				return;
			});
		},
		function(event, cb){
			if(event.room == roomId) {
				event.room = undefined;
			}
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

module.exports = new roomCrudService();