var async = require('async');
var Event = require('../schemas/eventSchema');
var eventRepository = require('../repositories/eventRepository');
var userRepository = require('../repositories/userRepository');
var crudService = require('./crudService');

var userService = function(){};

userService.delete = function(userId, callback){
	
	var user;

	async.waterfall([
		function(cb){

			userRepository.getById(userId, function(err, data){
				if(err){
					cb(err, null);
					return;
				}
				user = data;
				cb();
				return;
			});
		},
		function(cb){
			if(!user.events.length) { cb(); return; }

			user.events.forEach(function(eventId){
				eventRepository.getById(eventId, function(err, event){
					if(err){
						cb(err, null);
						return;
					}

					var index = event.users.indexOf(user._id);
					event.splice(index, 1);

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
			userRepository.delete(user._id, function(err, data){
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
		return;
	});

};

module.exports = new userService();