var google = require('googleapis');
var q = require('q');
var googleConfig = require('./../googleConfig');
var holidayRepository = require('../../repositories/holidayRepository');
var eventTypeRepository = require('../../repositories/eventTypeRepository');
var userRepository = require('../../repositories/userRepository');
var eventRepository = require('../../repositories/eventRepository');
//ru.ukrainian%23holiday%40group.v.calendar.google.com

var getUkrainianHolidays = function() {
	var deferred = q.defer();
	var calendar = google.calendar('v3');
 	calendar.events.list({
		key: googleConfig.api_key,
		calendarId: 'ru.ukrainian%23holiday%40group.v.calendar.google.com',
		//timeMin: (new Date()).toISOString(),
		singleEvents: true,
		orderBy: 'startTime'
	}, function(err, response) {
		if (err) {
			console.log(err);
			deferred.reject(err);
			return;
		}
		var events = response.items;
		if (events.length === 0) {
			deferred.resolve([]);
			console.log('No holidays found.');
		} else {
			deferred.resolve(events);
			//console.log(events);
		}
	});
 	return deferred.promise;
};

var addToDb = function(holidays, usersIds) {
	var deferred = q.defer();
	var holidayIds = [];
	eventTypeRepository.searchByTitle('holiday', function(err, type){
		if (err) {
			console.log('Cant find holiday type id', err);
			deferred.reject(err);
			return;
		}
		for(var i = 0; i < holidays.length; i++) {
			var newHoliday = {
				title : holidays[i].summary,
				start : new Date(holidays[i].start.date),
				end : new Date(holidays[i].end.date),
				type : type._id,
				users :  usersIds,
				isPrivate: false
			};
			eventRepository.add(newHoliday, function(err, data){
				if(err) {
					console.log(err);
					deferred.reject(err);
				}
				else {
					//console.log('Added to db: ' + data.title);
					holidayIds.push(data.id);
				}

				if(holidayIds.length == holidays.length) {
					userRepository.updateHolidays(holidayIds);
					//console.log(googleEventIds);
					//user.googleEvents = holidayIds;
					//holidayIds.update(user.id, user);
				}
			});
		}
	});
	
	deferred.resolve();
	return deferred.promise;
};

var clearUserEventsDb = function (eventIds) {
	for(var i = 0; i < eventIds.length; i++) {
		eventRepository.delete(eventIds[i], function (err, data) {
			if(err) {
				console.log(err);
			}
		});
	}
};

var saveHolidays = function(){
	getUkrainianHolidays()
	.then(function(holidays) {
		userRepository.getAll(function (err, users) {
			//console.log(users);
			var usersIds = [];
			for(var i = 0; i < users.length; i++) {
				usersIds.push(users[i].id);
			}
			if(users[0] && users[0].holidays) {
				clearUserEventsDb(users[0].holidays);
				console.log('Holidays removed');
			}
			addToDb(holidays, usersIds);
		});
	});
};

module.exports = function() {
	saveHolidays();
};
