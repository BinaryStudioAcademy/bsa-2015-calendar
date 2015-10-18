var planRepository = require('../repositories/planRepository');
var eventRepository = require('../repositories/eventRepository');
var eventService = require('./eventService');
var async = require('async');

var planService = function(){};

planService.prototype.add = function(data, callback){

	
	async.waterfall([

	function(cb){
		planRepository.add(data, function(err, plan){
			if(err){
				cb(err, null);
				return;
			}
			cb(null, plan);
		});
	},

	function(plan, cb){
		var event = {
			title: plan.title,
			description: plan.description,
			type: plan.type,
			price: plan.price,
			plan: plan._id,
   			isPrivate: plan.isPrivate,
   			room: plan.room, 
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
			eventService.add(event, function(err, data){
				if(err){
					cb("adding event from plan error " + err, null);
				}
			});
			console.log();
			addEventsCount++;

			eventTimeStart += plan.intervals[intervalsIterator];
		
			intervalsIterator++;

			if (intervalsIterator >= plan.intervals.length)
			{	
				intervalsIterator = 0;
			}
    		next();
  		},
		function (err) {
 			callback(err, null);
			return;
		});
		cb(null, "added " + addEventsCount + " events from plan");
	}
	],


	function(err, result){
		if(err){
			callback(err, null);
			return;
		}

		callback(null, result);
		return;
	});


};

planService.prototype.delete = function(planId, callback){

	async.waterfall([
		function(cb){
			eventRepository.getByPlanId(planId, function(err, events){
				console.log(events);
				events.forEach(function(event){
					eventService.delete(event, function(err, data){
						if(err){
							cb("removing event by planId error " + err, null);
						}
					});
				});
			});
			cb();
		},
				
		function(cb){
			planRepository.delete(planId, function(err, plan){
				if(err){
					cb(err, null);
					return;
				}
			});
			cb();
		}

	],

	function(err, result){
		if(err){
			callback(err, null);
			return;
		}

		callback(null, result);
		return;
	});


};

module.exports = new planService();