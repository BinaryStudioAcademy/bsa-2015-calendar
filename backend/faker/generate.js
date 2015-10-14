var faker = require('./fake.js');
var mongoose = require('mongoose');
var async = require('async');
var casual = require('casual');

var repositories = {
	device: require('../repositories/deviceRepository'),
	room: require('../repositories/roomRepository'),
	user: require('../repositories/userRepository'),
	group: require('../repositories/groupRepository')	
};


var generate = function(type, count, callback) { 
	for (var i = 0; i < count; i++){
		repositories[type].add(casual[type + '_'], callback);
	}

	//console.log(entities);
};

module.exports = function (amount) {
	generate.call(null, 'device', amount.device);
	generate.call(null, 'room', amount.room);
	generate.call(null, 'user', amount.user);
	generate.call(null, 'group', amount.group);
}; 
