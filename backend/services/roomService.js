var async = require('async');
var Event = require('../schemas/eventSchema');
var eventRepository = require('../repositories/eventRepository');
var roomRepository = require('../repositories/roomRepository');
var crudService = require('./crudService');

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
				room = data;
				cb();
				return;
			});
		},
		function(cb){
			if(!room.events.length) cb();

			room.events.forEach(function(eventId){

				eventRepository.getById(eventId, function(err, event){
					if(err){
						cb(err, null);
						return;
					}
					console.log('event room: ' + event.room);
					// event.room = undefined;
					event.set('room', undefined);
					console.log('event room after: ' + event.room);	
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
			callback(err, null);
			return;
		}
		callback(null, { success : true });
	});

};

module.exports = new roomService();