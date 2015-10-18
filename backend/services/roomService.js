var async = require('async');
var roomRepository = require('../repositories/roomRepository');
var roomCrudService = require('./roomCrudService');

var roomService = function(){};

roomService.prototype.delete = function(roomId, callback){

	var room;
	async.waterfall([
		function(cb){
			roomRepository.getById(roomId, function(err, data){
				if(err){
					cb(err, null);
					return;
				}
				if (!data){
					cb("incorrect roomId " + roomId);
					return;
				}
				room = data;
				cb();
			});
		},

		function(cb){
			console.log('working on events');

			if(room.events.length){
				room.events.forEach(function(eventId){
					roomCrudService.removeRoomFromEvent(eventId, room._id, function(err, data){
						if(err){
							cb(err, null);
							return;
						}
						console.log('delete room from events');
						cb();
					});	
				});
			}
			else {
				console.log('no events -> cb()');
				cb();
			}
		},
		function(cb){
			roomRepository.delete(room._id, function(err, data){
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

module.exports = new roomService();