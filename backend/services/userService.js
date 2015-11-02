var async = require('async');
var userRepository = require('../repositories/userRepository');
var eventRepository = require('../repositories/eventRepository');
var groupRepository = require('../repositories/groupRepository');
//var io = require('../notifications/notifications');
var userService = function(){};

userService.prototype.delete = function(userId, callback){
	// операция по удалению юзера

	var user;
	async.waterfall([
		function(cb){
			userRepository.getById(userId, function(err, data){
				if(err){
					return cb(err, null);
				}
				if (!data){
					return cb("incorrect userId " + userId);
				}
				user = data;
				cb();
			});
		}, // поулчаем экземпляр юзера

		function(cb){ // удаляем юзера из каждого ивента на который он был подписан
			if(user.events.length){
				user.events.forEach(function(eventId){
					eventRepository.removeUser(eventId, user._id, function(err, data){
						if(err){
							return cb(err, null);
						}
						console.log('delete user from events');
						cb();
					});	
				});
			}
			else {
				console.log('no events');
				cb();
			}
		}, 
		function(cb){ // удаляем юзера из каждой группы подписок в которых оп числится
			console.log('working on groups');
			if(user.groups.length){
				user.groups.forEach(function(groupId){
					groupRepository.removeUser(groupId, user._id, function(err, data){
						if(err){
							return cb(err, null);
						}
						console.log('delete user from groups');
						cb();
					});	
				});
			}
			else{
				console.log('no groups');
				cb();
			}
		},
		function(cb){
			userRepository.delete(user._id, function(err, data){
				if(err){
					return cb(err, null);
				}
				cb(null, data);
			});
		} // удаляем запись о юзере из БД

	], function(err, result){
		if(err){
			console.log(err);
			return callback(err, {success: false});
		}
		return callback(null, {success: true});
	});
};

module.exports = new userService();