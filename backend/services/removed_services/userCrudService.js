var async = require('async');
var eventRepository = require('../repositories/eventRepository');
var userRepository = require('../repositories/userRepository');

var userCrudService = function(){};

userCrudService.prototype.removeUserFromEvent = function(eventId, userId, callback){
	async.waterfall([
		function(cb){
			eventRepository.getById(eventId, function(err, data){
				if(err){
					cb(err, null);
					return;
				}
				if (!data){
					cb("incorrect eventId " + eventId + " in user.evenets, userId " + userId);
					return;
				}
				cb(null, data);
				return;
			});
		},
		function(event, cb){
			var index = event.users.indexOf(userId);
			if( index > -1 ) event.users.splice(index, 1);

			eventRepository.update(eventId, event, function(err, data){
				if(err){
					cb(err, null);
					return;
				}
				cb(null, data);
				return;
			});
		}
	], function(err, result){
		if(err){
			callback(err, null);
			return;
		}

		callback(null, result);
		return;
	});
};

userCrudService.prototype.removeUserFromGroup = function(groupId, userId, callback){

	async.waterfall([
		function(cb){
			groupRepository.getById(groupId, function(err, data){
				if(err){
					cb(err, null);
					return;
				}
				if (!data){
					cb("incorrect groupId " + groupId + " in user.groups " + userId);
					return;
				}
				cb(null, data);
				return;
			});
		},
		function(group, cb){
			var index = group.users.indexOf(userId);
			if( index > -1 ) group.users.splice(index, 1);

			groupRepository.update(groupId, group, function(err, data){
				if(err){
					cb(err, null);
					return;
				}
				cb(null, data);
				return;
			});
		}
	], function(err, result){
		if(err){
			callback(err, null);
			return;
		}

		callback(null, result);
		return;
	});
	
};

module.exports = new userCrudService();