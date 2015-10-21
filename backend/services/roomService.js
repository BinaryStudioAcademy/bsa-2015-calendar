var async = require('async');
var roomRepository = require('../repositories/roomRepository');
var eventRepository = require('../repositories/eventRepository');

var roomService = function(){};

roomService.prototype.delete = function(roomId, callback){

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
		},

		function(cb){
			console.log('working on events');

			if(room.events.length){
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
		function(cb){
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

// roomService.prototype.availability = function(roomId, dateStart, dateEnd, callback){
// 	var dateStartMs = Date.parse(dateStart).valueOf(),
// 		dateEndMs = Date.parse(dateEnd).valueOf();
	

// 	// eventRepository.find( //query today up to tonight
//  //  {"created_on": {"$gte": new Date(2012, 7, 14), "$lt": new Date(2012, 7, 15)}})


// 	eventRepository.getByRoomId(roomId, function(err, events){
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


module.exports = new roomService();












	// var room,
	// 	dateStartMs = dateStart.valueOf(),
	// 	dateEndMs = dateEnd.valueOf();
	
	// async.waterfall([
	// 	function(cb){
	// 		roomRepository.getById(roomId, function(err, data){
	// 			if(err){
	// 				return cb(err, null);
	// 			}
	// 			if (!data){
	// 				return cb(new Error("incorrect roomId " + roomId));
	// 			}
	// 			if (!data.length){
	// 				return cb(new Error("Empty event for roomId " + roomId));
	// 			}
	// 			room = data;
	// 			cb();
	// 		});
	// 	},

	// 	function(cb){
	// 		eventRepository.getByRoomId(roomId, function(err, events){
	//     		async.forEach(events, function(event, callback) { 
	//         		if ((dateStartMs < event.end.valueOf()) && (dateStartMs > event.start.valueOf())){
	// 					return callback(new Error('startTimeConflict'));
	// 				}
	// 				if ((dateEndMs < event.end.valueOf()) && (dateEndMs > event.start.valueOf())){
	// 					return callback(new Error('endTimeConflict'));
	// 				}
	//     			callback();	
	//     		}, cb);
	//     	});
	// 	} 
	//     	// function(err) {
	//       //   		if (err){
	//       //   			return cb(err);
	//       //   		} 
	//       //   		return cb();
	//     		// });
	// ], function(err){
	// 	if(err){
	// 		console.log(err);
	// 		return callback(err, {availability: 'false'});
			
	// 	}
	// 	// else?? bp
	// 	return callback(null, {availability: 'true'});	
	// });