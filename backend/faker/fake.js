var casual = require('casual');
var mongoose = require('mongoose');
var context = require('./context');


casual.define('mongo_id', function(){
	return mongoose.Types.ObjectId();
});

casual.define('user_', function () {
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
		workDate: casual.date(format = 'YYYY-MM-DD'),
		currentProject: casual.string,
		birthday: casual.date(format = 'YYYY-MM-DD'),
		events: []
	};
});

casual.define('device_', function () {
	var id = casual.mongo_id;
	context.device_ids.push(id);

	return {
		_id: id,
		title: casual.title,
		events: []
	};
});

casual.define('room_', function () {
	var id = casual.mongo_id;
	context.room_ids.push(id);

	return {
		_id: id,
		title: casual.title,
		events: []
	};
});

casual.define('group_', function () {
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


casual.define('event_', function () {
	var id = casual.mongo_id;
	context.event_ids.push(id);

	var numOfUsers = casual.integer(from = 0, to = context.user_ids.length);
	var usersArr = [];
	for(var i = 0; i < numOfUsers; i++){
		usersArr.push(casual.random_element(context.user_ids));
	}

	var startDate = new Date(2015, casual.month_number-1, casual.day_of_month, casual.random_element([6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]));
	var endDate = new Date(+startDate + casual.random_element([3600000, 7200000, 10800000]));

	return {
		_id: id,
    	ownerId : casual.random_element(context.user_ids),
    	title : casual.title,
    	description : casual.short_description,
    	type : casual.random_element(['basic', 'general', 'activity']), 
    	price : casual.integer(from=0, to=300),
    	//plan : {type: Schema.Types.ObjectId, ref: 'Plan'}, /* plan id */
    	isPrivate : casual.random_element([true, false]),
    	start: startDate,
    	end: endDate,
    	users: usersArr,
    	usersFundrasing: casual.random_element(['accepter', 'declined', 'later', 'paid']), 
    	room: casual.random_element(context.room_ids),
    	devices: casual.random_element(context.device_ids)
	};
});