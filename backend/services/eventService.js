var async = require('async');
var eventRepository = require('../repositories/eventRepository');
var userRepository = require('../repositories/userRepository');
var roomRepository = require('../repositories/roomRepository');
var deviceRepository = require('../repositories/deviceRepository');
var groupRepository = require('../repositories/groupRepository');
var eventTypeRepository = require('../repositories/eventTypeRepository');
var _ = require('lodash');
// var io = require('../notifications/notifications');

var eventService = function(){};
// сервис для обработки CRUD операций при работе с сущностью - событие

eventService.prototype.checkNotification = function(userId, callback){
	var events = [];
	var user;

	async.waterfall([
		function(cb){
			userRepository.getById(userId, function(err, result){
				if(err){
					return cb(err);
				}
				user = result;
				return cb();
			});
		},
		function(cb){
			async.forEach(user.events, function(eventId, next){
				eventRepository.getById(eventId, function(err, data){
					var lapse = new Date(data.startTime) - new Date();
					if(lapse < 300000){
						events.push(data);
					}
					next();
				});
				}, function(err, result){
						if(err){
							return cb(err);
						}
						return cb();
			});
		}
	], function(err, result){
		if(err){
			callback(err, null);
		}
		callback(null, events);
	});
};

eventService.prototype.add = function(data, callback){ 
	// операция добавления ивента
	var event;

	async.waterfall([
		function(cb){
			if(data.room){ // проверяем доступность комнаты по требуемому интвервалу ивента
				eventRepository.checkRoomAvailability(data.room, data.start, data.end, function(err, result){
					if(err){
						return cb(err);
					}
					if(result.length){
						return cb(new Error('date/time conflict with room ' + data.room + '\nstart:' + data.start + ' \nend:' + data.end), result);
					}
					cb();
				});
			}
			else{
				cb();
			}
		},

		function(cb){
			async.forEach(data.devices, function(deviceId, next) { // проверяем доступность каждого девайса по требуемому интвервалу ивента
				eventRepository.checkDeviceAvailability(deviceId, data.start, data.end, function(err, result){
					if(err){
						return cb(err);
					}
					if(result.length){
						return cb(new Error('date/time conflict with device ' + deviceId + '\nstart:' + data.start + ' \nend:' + data.end), result);
					}
					next();
				});

			}, function(err, result){
				if(err){
					return cb(err, result);	
				}
				return cb();	
			});
		}, 
		function(cb){ // после успешного прохождения проверок добавляем ивент в БД
			eventRepository.add(data, function(err, data){
				if(err){
					return cb(err, null);
				}
				event = data;
				cb();
			});
		},
		function(cb){ // добавляем запись об ивенте в сущность room
			if (event.room !== undefined){
				roomRepository.addEvent(event.room, event._id, function(err, data){
	 				if(err){
	 					return cb(err, null);
	 				}
	 				console.log('added to room');
	 				cb();
				});
			}
			else {
				console.log('no room');
				cb();
			}
		},
		function(cb){ // добавляем запись об ивенте каждлому подписанному юзеру
			if(event.users.length){
				event.users.forEach(function(userId){
					userRepository.addEvent(userId, event._id, function(err, data){
	 					if(err){				
	 						return cb(err, null);
	 					}
	 					console.log('added to user');
					});

				});
				cb();
			}
			else{
				console.log('no users');
				cb();
			}
		},
		function(cb){ //add event to owner events
			if(event.ownerId){
				userRepository.addEvent(event.ownerId, event._id, function(err, data){
	 				if(err){				
	 					return cb(err, null);
	 				}
	 				console.log('added to user');
				});
				cb();
			}
			else{
				console.log('no ownerId');
				cb();
			}
		}, 
		function(cb){ //add to all public events
			if(event.isPrivate === false){
				userRepository.addEventToAll(event._id, function(err, data){
	 				if(err){				
	 					return cb(err, null);
	 				}
	 				console.log('added to all users');
				});
				cb();
			}
			else{
				console.log('event is private');
				cb();
			}
		},
		function(cb){ // добавляем запись об ивенте в каждый экземпляр device
			if(event.devices.length){
				event.devices.forEach(function(deviceId){
					deviceRepository.addEvent(deviceId, event._id, function(err, data){
	 					if(err){
	 						return cb(err, null);
	 					}
					});
					console.log('added to device');
				});
				cb();
			}
			else{
				console.log('no devices');
				cb();
			}
		},

		function(cb){ // добавляем запись  об event в сущность eventType 
			if (event.type !== undefined){
				eventTypeRepository.addEvent(event.type, event._id, function(err, data){
	 				if(err){
	 					return cb(err, null);
	 				}
	 				console.log('added to eventType');
	 				cb(null, event);
				});
			}
			else {
				console.log('no eventType');
				cb(null, event);
			}
		},

	], function(err, result){
		if(err){
			//console.log(err.message);
			return callback(err, result);
		}
		return callback(null, result);
	});
};

eventService.prototype.delete = function(eventId, callback){
	// операция удаления ивента
	var event;

	async.waterfall([
		function(cb){
			eventRepository.getById(eventId, function(err, data){
				if(err){				
					return cb(err);
				}
				if (!data){
					return cb(new Error("incorrect eventId " + eventId));
				}
				event = data;
				cb();
			});
		}, // получаем экземпляр удаляемого ивента
		function(cb){ // удаляем запись о нем из room
			if (event.room !== undefined){
				roomRepository.removeEvent(event.room, eventId, function(err, data){
	 				if(err){
	 					console.log('removing from room err');
	 					return	cb(err, null);
	 				}
	 				console.log('delete from room');
	 				cb();
				});
	
			}
			else {
				console.log('no room');
				cb();
			}

		},
		function(cb){ // удаляем запись о нем из каждого user
			if(event.users.length){ 
				event.users.forEach(function(userId){
					userRepository.removeEvent(userId, eventId, function(err, data){
	 					if(err){
	 						console.log('removing from users err');
	 						return	cb(err, null);
	 					}
	 					console.log('delete from user');
	 					cb();
					});	
				});
			}
			else {
				console.log('no users');
				cb();
			}

		},
		function(cb){ // удалеяем запись о нем из каждого device
			if(event.devices.length){
				event.devices.forEach(function(deviceId){
					deviceRepository.removeEvent(deviceId, eventId, function(err, data){
	 					if(err){
	 						console.log('removing from devices err');
	 						return	cb(err, null);
	 					}
	 					console.log('delete from device');
	 					cb();
					});
				});
			}
			else {
				console.log('no devices');
				cb();
			}
		},


		function(cb){ // удаляем запись об ивенте из сущности eventType
			if (event.type !== undefined){
				eventTypeRepository.removeEvent(event.type, eventId, function(err, data){
 					if(err){
 						console.log('removing from eventTypes err');
 						return	cb(err, null);
 					}
 					console.log('delete from eventType');
 					cb();
				});
			} 
			else {
				console.log('no eventType');
				cb();
			}

		},


		function(cb){ // удаляем запись об event из групповых попдисок
			groupRepository.removeEvent(eventId, function(err, data){
				// игнорируем ошибки
				if(err){
					console.log('removing from groups err');
					return	cb(err, null);
				}
				console.log('delete from groups');
			});
			cb();
		}, 

		function(cb){
			eventRepository.delete(event._id, function(err, data){
				if(err){
					console.log('removing from repository err');
					return cb(err, null);
				}
				console.log(data);
				cb(null, data);
			});
		} // удаляем event из БД

	], function(err, result){
		if(err){
			console.log(err);
			return callback(err, {success: false});
		}
		console.log(result);
		return callback(null, result);
	});
};


eventService.prototype.update = function(eventId, newEvent, callback){
	//операция обновления event
	var usersToAdd = [],
		usersToDelete = [],
		devicesToAdd = [],
		devicesToDelete = [],
		oldEvent;

	console.log("eventID: " + eventId);

	async.waterfall([

		function(cb){ // проверяем доступность команты для нового интверала ивента
			if(newEvent.room){ 
				eventRepository.checkRoomAvailability(newEvent.room, newEvent.start, newEvent.end, function(err, result){
					if(err){
						return cb(err);
					}
					if(result.length){
						return cb(new Error('date/time conflict with room ' + newEvent.room + '\nstart:' + newEvent.start + ' \nend:' + newEvent.end), result);
					}
					cb();
				});
			}
			else{
				cb();
			}	
		},

		function(cb){ // проверяем доступность каждого девайса для нового интверала ивента
			async.forEach(newEvent.devices, function(deviceId, next) { 
				eventRepository.checkDeviceAvailability(deviceId, newEvent.start, newEvent.end, function(err, result){
					if(err){
						return cb(err);
					}
					if(result.length){
						return cb(new Error('date/time conflict with device ' + deviceId + '\nstart:' + newEvent.start + ' \nend:' + newEvent.end), result);
					}
					next();
				});
			}, function(err, result){
				if(err){
					return callback(err, result);	
				}
				return cb();	
			});
		}, 

		function(cb){ 
			eventRepository.getById(eventId, function(err, data){
				if(err){
					return cb(err, null);
				}
				if (!data){
					return cb("incorrect eventId " + eventId);
				}
				oldEvent = data;
				cb();
			});
		}, // получаем экземпляр старого event
		function(cb){ // определяем различия старого и нового экземпляра по спискам девайсов и подписанных юзеров
			usersToAdd = _.difference(newEvent.users, oldEvent.users);
			usersToDelete = _.difference(oldEvent.users, newEvent.users);
			devicesToAdd = _.difference(newEvent.devices, oldEvent.devices);
			devicesToDelete = _.difference(oldEvent.devices, newEvent.devices);

			console.log("old devices: " + oldEvent.devices);
			console.log("new devices: " + newEvent.devices);

			console.log("devices to add: " + devicesToAdd);
			console.log("devices to delete: " + devicesToDelete);


			usersToDelete.forEach(function(userId){
				userRepository.removeEvent(userId, eventId, function(err, data){
					if(err){
						return cb(err, null);
					}
				});
			});			

			usersToAdd.forEach(function(userId){
				userRepository.addEvent(userId, eventId, function(err, data){
					if(err){
						return cb(err, null);
					}
				});
			});

			devicesToDelete.forEach(function(deviceId){
				deviceRepository.removeEvent(deviceId, eventId, function(err, data){
					if(err){
						return cb(err, null);
					}
				});
			});

			devicesToAdd.forEach(function(deviceId){
				deviceRepository.addEvent(deviceId, eventId, function(err, data){
					if(err){
						return cb(err, null);
					}
				});
			});

			if(oldEvent.room !== newEvent.room){ // если комната для ивента изменилась
				console.log("changing room");
				roomRepository.removeEvent(oldEvent.room, eventId, function(err, data){
					if(err){
						return cb(err, null);
					}
				}); // удаляем запись о ивенте из старой комнтаы

				roomRepository.addEvent(newEvent.room, eventId, function(err, data){
					if(err){
						return cb(err, null);
					}
				}); // добавляем запись об ивенте в новую комнату
			}
			cb();
		},
		function(cb){
				async.waterfall([

				function(cb){ 
					eventRepository.update(eventId, newEvent, function(err, data){
						if(err){
							return cb(err, data);
						}
						cb();
					});
				}, // обновляем экземпляр event
				
				function(cb){
					eventRepository.getById(eventId, function(err, data){
						if (!data){
							return cb(new Error("incorrect eventId " + eventId));
						}
						if(err){				
							return cb(err);
						}
						else{
							console.log(data);
							cb(null, data);
						}		
					});
				}],
			 	function(err, result){
					if(err){
						return callback(err, result);	
					}
					return cb(null, result);	
				});
			}

	], function(err, result){
		if(err){
			return callback(err, {success: false});
		}
		return callback(null, result);

	});
};

eventService.prototype.updateStartEnd = function(eventId, data, callback){
	// операция обновления интвервала ивента

	var event;

	console.log("eventID: " + eventId);

	async.waterfall([
		function(cb){
			eventRepository.getById(eventId, function(err, result){
				if(err){				
					return cb(err);
				}
				if (!result){
					return cb(new Error("incorrect planId " + eventId));
				}
				event = result;
				cb();
			});
		}, // получаем экземпляр ивента

		function(cb){ // проверяем доступность комнаты для нового инветрала
			if(event.room){
				eventRepository.checkRoomAvailability(event.room, data.start, data.end, function(err, result){

					if(err){
						return cb(err);
					}
					if(result.length){
						if(result.length == 1){
							if(result[0]._id != eventId){
								console.log('FAILED for room');
								console.log('put ev id = ', eventId);
								console.log('find ev id = ', result[0]._id);
								return cb(new Error('date/time conflict with room ' + data.room + '\nstart:' + data.start + ' \nend:' + data.end+ '\n' +  result), result);
							}
							else{
								console.log('SUCCESS for room');
								console.log('put ev id = ', eventId);
								console.log('find ev id = ', result[0]._id);
							}
						}
						else {
							console.log('more > 1 conflict results');
							return cb(new Error('date/time conflict with room ' + data.room + '\nstart:' + data.start + ' \nend:' + data.end + '\n' +  result), result);
						}
					}
					cb();
				});
			}
			else{
				cb();
			}	
		},

		function(cb){ // проверяем доступность девайсов для нового инветрала
			async.forEach(event.devices, function(deviceId, next) { 
				eventRepository.checkDeviceAvailability(deviceId, data.start, data.end, function(err, result){
					if(err){
						return cb(err);
					}
					if(result.length){
						if(result.length == 1){
							if(result[0]._id != eventId){
								console.log('FAILED for device');
								console.log('put ev id = ', eventId);
								console.log('find ev id = ', result[0]._id);
								return cb(new Error('date/time conflict with device ' + deviceId + '\nstart:' + data.start + ' \nend:' + data.end+ '\n' +  result), result);
							}
							else{
								console.log('SUCCESS for device');
								console.log('put ev id = ', eventId);
								console.log('find ev id = ', result[0]._id);
							}
						}
						else {
							console.log('more > 1 conflict results');
							return cb(new Error('date/time conflict with device ' + deviceId + '\nstart:' + data.start + ' \nend:' + data.end + '\n' +  result), result);
						}
					}
					next();
				});
			}, function(err, result){
				if(err){
					return callback(err, result);	
				}
				return cb();	
			});
		}, 
		function(cb){
			event.start = data.start;
			event.end = data.end;		

			eventRepository.update(eventId, event, function(err, data){
				if(err){
					return cb(err, null);
				}
			}); // если проверки пройдены обновляем запись event

			cb();
		}
	], function(err, result){
		if(err){
			return callback(err, result);
		}
		return callback(null, {success: true});
	});
};

module.exports = new eventService();