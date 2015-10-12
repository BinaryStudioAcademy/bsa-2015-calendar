var faker = require('./fake.js');
var mongoose = require('mongoose');
var async = require('async');

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

	console.log(entities);
};

async.waterfall([
	generate.bind(null, 'user', 20),
	generate.bind(null, 'room', 8),
	generate.bind(null, 'device', 13),
	generate.bind(null, 'group', 3)
], function(err, data){
	console.log('async', err);
	process.exit();
});