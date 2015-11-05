var planRepository = require('../repositories/planRepository');
var eventRepository = require('../repositories/eventRepository');
var eventService = require('./eventService');
var async = require('async');

var planService = function(){}; // ПЛАН - несколько событий повторяющихся по заданным интервалам

var pService = new planService();

planService.prototype.availability = function(data, callback){
	// операция проверки возможности добавления нового плана

	var eventTimeStart = Date.parse(data.timeStart).valueOf();
	var planDateEnd = Date.parse(data.dateEnd).valueOf();
	var eventDuration  = Date.parse(data.timeEnd).valueOf() - Date.parse(data.timeStart).valueOf();
	var intervalsIterator = 0;

	if (data.intervals === undefined){
		callback(new Error('plan needed intervals'), null);
	}

	async.whilst(
	function () { // проверки выполняются для каждого экземпляра "будущего" ивента
			return eventTimeStart <= planDateEnd;
	},

	function (cb) {
		var eventTimeEnd = eventTimeStart + eventDuration;

		async.waterfall([
			function(cb){
				if(data.rooms){ // проверяем комнаты
					eventRepository.checkRoomAvailability(data.rooms[intervalsIterator], eventTimeStart, eventTimeEnd, function(err, result){
						if(err){
							return cb(err);
						}
						if(result.length){
							return cb(new Error('date/time conflict with room ' + data.rooms[intervalsIterator] + '\nstart:' + eventTimeStart + ' \nend:' + eventTimeEnd), result);
						}
						cb();
					});
				}
				else{
					cb();
				}
			},

			function(cb){ // проверяем девайсы
				async.forEach(data.devices, function(deviceId, cb) { 
					eventRepository.checkDeviceAvailability(deviceId, eventTimeStart, eventTimeEnd, function(err, result){
						if(err){
							return cb(err);
						}
						if(result.length){
							return cb(new Error('date/time conflict with device ' + deviceId + '\nstart:' + data.start + ' \nend:' + data.end), result);
						}
						cb();
					});
				//cb();
				}, 
				function(err, result){
					if(err){
						//console.log(err);
						return cb(err, result);	
					}
					// else?? bp
					return cb();	
				});
			}, 
			function(cb){
				// здесь вычисляем start и end следующего экземпляра event'а в плане

				eventTimeStart += Number(data.intervals[intervalsIterator]);
				//eventTimeStart += eventDuration;

				intervalsIterator++;

				if (intervalsIterator >= data.intervals.length)
				{	
					intervalsIterator = 0;
				}
				cb();
			}
		], function(err){
			if(err){
				//console.log(err);
				return cb(err);	
				// cb(err);
			}
			cb();	
			// // else?? bp
			// return next();	
		});	

		}, function(err, result) {
			if (err) {
				return callback(err, {success: false});
				// callback(err, {success: false});
			}
			return callback(null, {success: true});
			// callback(null, {success: true});
		});
};


planService.prototype.add = function(data, callback){
	// операция добавления нового плана 


	// if(data.rooms != null){
	// 	if (data.rooms.length != data.intervasl.length) {
	// 		return cb(new Error('Invalid rooms count'))
	// 	}; // проверяем соответствие колличества назначенных рум - интервалам
	// }
	// договориться на фронтенде о правилах для отправки плана (по румам и интервалам) должны соответствовать по кол-ву
	// проверки всех значений даты/времени (end > start)
	var planData;

	async.waterfall([

	function (cb){ // выполняем проверку возможности добавления плана
		console.log('checking availability');
		pService.availability(data, function(err, result){
			if(err){
				console.log('availability error');
				return cb(err, result);
			}
			console.log('avaiable');
			cb();
		});
	},

	function (cb){ 
		planRepository.add(data, function(err, plan){
			if(err){			
				return cb(err, null);
			}
			planData =plan;
			cb(null, plan);
		});
	}, // добавляем запись о плане в БД

	function (plan, cb){
		var event = {
			title: plan.title,
			description: plan.description,
			type: plan.type,
			price: plan.price,
			plan: plan._id,
   			isPrivate: plan.isPrivate,
   			devices: plan.devices, 
   			users : plan.users
		}; // формируем часть полей event'а

		var eventTimeStart = plan.timeStart.valueOf();
		var planDateEnd = plan.dateEnd.valueOf();
		var eventDuration  = plan.timeEnd.valueOf() - plan.timeStart.valueOf();
		var intervalsIterator = 0;
		var addEventsCount = 0;

		async.whilst(function () { // выполняем добавление ивентов, по заявленным интервалам
  			return eventTimeStart <= planDateEnd;
		},


		function (next) {
 			event.start = new Date(eventTimeStart);
			event.end = new Date(eventTimeStart + eventDuration); 
			event.room = plan.rooms[intervalsIterator];

			
			async.waterfall([
				function(cb){
					eventService.add(event, function(err, data){
						if(err){
							return cb(err, data);
						}
						cb();
					});
				},
				function(cb){ // вычисляем start и end следующего ивента, обновляем счетчики если требуется
					addEventsCount++;

					eventTimeStart += plan.intervals[intervalsIterator];
					//eventTimeStart += eventDuration;

					intervalsIterator++;

					if (intervalsIterator >= plan.intervals.length)
					{	
						intervalsIterator = 0;
					}
					cb();
				}
			], function(err){
				if(err){
					//console.log(err);
					return callback(err);	
				}
				// else?? bp
				return next();	
			});	
  		},
		function(err, result) {
			if (err) {
				return callback(err, result);
			}
			return cb(/*null, addEventsCount*/);
		});
		
	},

	function (cb){
		eventRepository.getByPlanId(planData._id, function(err, events){
				if (!events){
					return cb(new Error("incorrect planId " + planData._id));
				}
				if (!events.length){
					return cb(new Error("Empty plan for planId " + planData._id));
				} 
			console.log(events);
			cb(null, events);
		});
	}, // запрашиваем из базы список созданных ивентов, для отправки их клиенту
	],

	function(err, result){
		if(err){
			console.log(err);
			return callback(err, result);
		}
		return callback(null, /*{succes: true, addCount : result}*/ result);
	});
};


planService.prototype.delete = function(planId, callback){
	// операция удаления плана
	async.waterfall([
		function(cb){ // получаем ивенты созданнные по данному плану
			eventRepository.getByPlanId(planId, function(err, events){
				if (!events){
					return cb(new Error("incorrect planId " + planId));
				}
				if (!events.length){
					return cb(new Error("Empty plan for planId " + planId));
				}
				events.forEach(function(event){ // удаляем каждый ивент созданный по данному плану
					eventService.delete(event._id, function(err, data){
						if(err){
							cb("removing event by planId error " + err, null);
						}
						cb();
					});
				});
			});
		},
				
		function(cb){ // удаляем запись о плане из БД
			planRepository.delete(planId, function(err, plan){
				if(err){
					return cb(err, null);
				}
				cb();
			});
		}

	],

	function(err, result){
		if(err){
			return callback(err);
		}
		return callback(null, {success: true});
	});


};


planService.prototype.update = function(planId, data, callback){
	// операция обновления плана

	async.waterfall([

	function (cb){ // проверяем возможность обновления плана для новых данных
		pService.availability(data, function(err, result){
			if(err){
				return cb(err, result);
			}
			cb();
		});
	},

	function (cb){ // если проверка пройдена то выполняем операцию удаления плана со старыми данными
		pService.delete(planId, function(err, result){
			if(err){
				return cb(err, result);
			}
			cb();
		});
	},

	function (cb){ 
		planRepository.add(data, function(err, plan){ 
			if(err){			
				return cb(err, null);
			}
			cb(null, plan);
		}); 
	}, // добавляем запись о новом плане в БД

	function (plan, cb){ // выполняем операцию добавления ивентов пл плану с новыми вводными данными
		var event = {
			title: plan.title,
			description: plan.description,
			type: plan.type,
			price: plan.price,
			plan: plan._id,
   			isPrivate: plan.isPrivate,
   			devices: plan.devices, 
   			users : plan.users
		};

		var eventTimeStart = plan.timeStart.valueOf();
		var planDateEnd = plan.dateEnd.valueOf();
		var eventDuration  = plan.timeEnd.valueOf() - plan.timeStart.valueOf();
		var intervalsIterator = 0;
		var addEventsCount = 0;

		async.whilst(function () { // добавляем ивенты пока выполняется условие по заданным интервалам
  			return eventTimeStart <= planDateEnd;
		},


		function (next) {
 			event.start = new Date(eventTimeStart);
			event.end = new Date(eventTimeStart + eventDuration); 
			event.room = plan.rooms[intervalsIterator];

			
			async.waterfall([
				function(cb){
					eventService.add(event, function(err, data){
						if(err){
							return cb(err, data);
						}
						cb();
					});
				},
				function(cb){ // вычисляем новые start и end следующего ивента
					addEventsCount++;

					eventTimeStart += plan.intervals[intervalsIterator];
					//eventTimeStart += eventDuration;

					intervalsIterator++;

					if (intervalsIterator >= plan.intervals.length)
					{	
						intervalsIterator = 0;
					}
					cb();
				}
			], function(err){
				if(err){
					//console.log(err);
					return callback(err);	
				}
				// else?? bp
				return next();	
			});	
  		},
		function(err, result) {
			if (err) {
				return callback(err, result);
			}
			return cb(null, addEventsCount);
		});
		
	}
	],


	function(err, result){
		if(err){
			console.log(err);
			return callback(err, result);
		}
		return callback(null, {succes: true, addCount : result});
	});


};

module.exports = new planService();