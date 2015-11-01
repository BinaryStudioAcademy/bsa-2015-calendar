var async = require('async');
var roomRepository = require('../repositories/roomRepository');
var eventRepository = require('../repositories/eventRepository');
//var io = require('../notifications/notifications')();
var roomService = function(){};

roomService.prototype.delete = function(roomId, callback){
	// при удалении румы, удаляем ее идентификатор из всех ивентов, которые его содержат

	var room;
	async.waterfall([
		function(cb){
			roomRepository.getById(roomId, function(err, data){
				if(err){
					return cb(err, null);
				}
				if (!data){
					return cb("incorrect roomId " + roomId);
				}
				room = data;
				cb();
			});
		}, // получаем экземпляр румы

		function(cb){
			console.log('working on events');

			if(room.events.length){ // удаляем запись о ней из каждого ивента
				room.events.forEach(function(eventId){
					eventRepository.removeRoom(eventId, room._id, function(err, data){
						if(err){
							return cb(err, null);
						}
						console.log('delete room from events');
						cb();
					});	
				});
			}
			else {
				console.log('no events');
				cb();
			}
		},
		function(cb){ // удаляем руму из БД
			roomRepository.delete(room._id, function(err, data){
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

module.exports = new roomService();
