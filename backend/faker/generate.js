var faker = require('./fake.js');
var mongoose = require('mongoose');
var async = require('async');
var casual = require('casual');

var repositories = {
	device: require('../repositories/deviceRepository'),
	room: require('../repositories/roomRepository'),
	group: require('../repositories/groupRepository'),
	user: require('../repositories/userRepository')
};


var generate = function(type, count, callback) { 
	for (var i = 0; i < count; i++){
		repositories[type].add(casual[type + '_'], callback);
	}
	console.log(type);
};

module.exports = function () {
	generate.call(null, 'device', 20);
	generate.call(null, 'room', 5);
	generate.call(null, 'user', 13);
	generate.call(null, 'group', 3);
};