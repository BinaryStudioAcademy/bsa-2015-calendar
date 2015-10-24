var planRepository = require('../repositories/planRepository');
var eventRepository = require('../repositories/eventRepository');
var eventService = require('./eventService');
var async = require('async');

var planService = function(){};

var pService = new planService();

planService.prototype.availability = function(data, callback){

	var eventTimeStart = Date.parse(data.timeStart).valueOf();
	var planDateEnd = Date.parse(data.dateEnd).valueOf();
	var eventDuration  = Date.parse(data.timeEnd).valueOf() - Date.parse(data.timeStart).valueOf();
	var intervalsIterator = 0;

	async.whilst(function () {
			return eventTimeStart <= planDateEnd;
	},

	function (cb) {
		var eventTimeEnd = eventTimeStart + eventDuration;

		async.waterfall([
			function(cb){
				if(data.rooms){
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

			function(cb){
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

				eventTimeStart += Number(data.intervals[intervalsIterator]);
				eventTimeStart += eventDuration;

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
			}
			cb();	
			// // else?? bp
			// return next();	
		});	

		}, function(err, result) {
			if (err) {
				return callback(err, {success: false});
			}
			return callback(null, {success: true});
		});
};


planService.prototype.add = function(data, callback){

	// if(data.rooms != null){
	// 	if (data.rooms.length != data.intervasl.length) {
	// 		return cb(new Error('Invalid rooms count'))
	// 	}; // проверяем соответствие колличества назначенных рум - интервалам
	// }
	// договориться на фронтенде о правилах для отправки плана (по румам и интервалам) должны соответствовать по кол-ву
	// проверки всех значений даты/времени (end > start)

	async.waterfall([

	function (cb){
		pService.availability(data, function(err, result){
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
	},

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
		};

		var eventTimeStart = plan.timeStart.valueOf();
		var planDateEnd = plan.dateEnd.valueOf();
		var eventDuration  = plan.timeEnd.valueOf() - plan.timeStart.valueOf();
		var intervalsIterator = 0;
		var addEventsCount = 0;

		async.whilst(function () {
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
				function(cb){
					addEventsCount++;

					eventTimeStart += plan.intervals[intervalsIterator];
					eventTimeStart += eventDuration;

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


planService.prototype.delete = function(planId, callback){

	async.waterfall([
		function(cb){
			eventRepository.getByPlanId(planId, function(err, events){
				if (!events){
					return cb(new Error("incorrect planId " + planId));
				}
				if (!events.length){
					return cb(new Error("Empty plan for planId " + planId));
				}
				events.forEach(function(event){
					eventService.delete(event._id, function(err, data){
						if(err){
							cb("removing event by planId error " + err, null);
						}
						cb();
					});
				});
			});
		},
				
		function(cb){
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

	async.waterfall([

	function (cb){
		pService.availability(data, function(err, result){
			if(err){
				return cb(err, result);
			}
			cb();
		});
	},

	function (cb){
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
	},

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
		};

		var eventTimeStart = plan.timeStart.valueOf();
		var planDateEnd = plan.dateEnd.valueOf();
		var eventDuration  = plan.timeEnd.valueOf() - plan.timeStart.valueOf();
		var intervalsIterator = 0;
		var addEventsCount = 0;

		async.whilst(function () {
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
				function(cb){
					addEventsCount++;

					eventTimeStart += plan.intervals[intervalsIterator];
					eventTimeStart += eventDuration;

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