var casual = require('casual');
var mongoose = require('mongoose');
var context = require('./context');


casual.define('mongo_id', function(){
	return mongoose.Types.ObjectId();
});

casaul.define('user_', function () {
	var id = casual.mongo_id;
	context.user_ids.push(id);

	return {
		_id: id,
		name: casual.first_name,
		email: casual.email,
		surmane: casual.last_name,
		country: casual.country,
		city: casual.city,
		gender: casual.random_element(['male','female']),
		avatar: casual.word,
		workDate: casual.date,
		currentProject: casual.string,
		birthday: casual.date,
		events: []
	};
});

casaul.define('device_', function () {
	var id = casual.mongo_id;
	context.device_ids.push(id);

	return {
		_id: id,
		title: casual.title,
		events: []
	};
});

casaul.define('room_', function () {
	var id = casual.mongo_id;
	context.room_ids.push(id);

	return {
		_id: id,
		title: casual.title,
		events: []
	};
});

casaul.define('group_', function () {
	var numOfUsers = casual.integer(from = 0, to = context.user_ids.length);
	var usersArr = [];

	for(var i = 0; i < numOfUsers; i++){
		usersArr.push(casual.random_element(context.user_ids));
	}

	var id = casual.mongo_id;
	context.group_ids.push(id);

	return {
		_id: id,
		title: casual.word,
		users: usersArr,
		events: []
	};
});
