var async = require('async');
var userRepository = require('../repositories/userRepository');
var crudService = require('./crudService');

var userService = function(){};

userService.prototype.delete = function(userId, callback){

	var user;
	async.waterfall([
		function(cb){
			userRepository.getById(userId, function(err, data){
				if(err){
					cb(err, null);
					return;
				}
				if (!data){
					cb("incorrect userId " + userId);
					return;
				}
				user = data;
				cb();
			});
		},

		function(cb){
			console.log('working on events');

			if(user.events.length){
				user.events.forEach(function(eventId){
					userCrudService.removeUserFromEvent(eventId, user._id, function(err, data){
						if(err){
							cb(err, null);
							return;
						}
						console.log('delete from events');
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
			console.log('working on groups');
			if(user.groups.length){
				user.groups.forEach(function(groupId){
					userCrudService.removeUserFromGroup(groupId, user._id, function(err, data){
						if(err){
							cb(err, null);
							return;
						}
						console.log('delete from groups');
						cb();
					});
				});
			}
			else{
				console.log('no groups -> cb()');
				cb();
			}
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
			console.log(err);
			callback(err, null);
			return;
		}
		callback(null, {success: 'true'});
		return;
	});
};

module.exports = new userService();