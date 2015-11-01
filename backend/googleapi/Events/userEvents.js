var google = require('googleapis');
var googleAuth = require('google-auth-library');
var q = require('q');
var googleEventRepository = require('../../repositories/googleEventRepository');
var userRepository = require('../../repositories/userRepository');


var getUserEvents = function(auth) {
	var deferred = q.defer();
	var calendar = google.calendar('v3');
 	calendar.events.list({
		auth: auth,
		calendarId: 'primary',
		timeMin: (new Date()).toISOString(),
		singleEvents: true,
		orderBy: 'startTime'
	}, function(err, response) {

		if (err) {
			console.log('Error: ' + err);
			deferred.reject(err);
		}
		
		var events = response.items;
		if (events.length === 0) {
			console.log('No upcoming calendars found.');
			deferred.resolve([]);
		} else {
			deferred.resolve(events);
		}

	});
 	return deferred.promise;
};


var addToDb = function(events, userInfo) {
	var userId;
	userRepository.getByUsername(userInfo.username, function(err, data){
		userId = data.id;
		for(var i = 0; i < events.length; i++) {
			var newEvent = {
				ownerId : userId,
				title : events[i].summary,
				start : Date(events[i].start.date),
				end : Date(events[i].end.date)
			};
			googleEventRepository.add(newEvent, function(err, data){
				if(err) console.log(err);
				else console.log('Added to db: ' + data.title);
			});
		}
	});
	
};


module.exports = {
	getUserEvents: getUserEvents,
	addToDb: addToDb
};