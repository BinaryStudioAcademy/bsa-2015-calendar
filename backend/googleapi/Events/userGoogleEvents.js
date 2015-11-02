var google = require('googleapis');
var googleAuth = require('google-auth-library');
var q = require('q');
var googleEventRepository = require('../../repositories/googleEventRepository');
var userRepository = require('../../repositories/userRepository');
var googleConfig = require('./../googleConfig');

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


var addToDb = function(events, username) {
	var userId;
	userRepository.getByUsername(username, function(err, data){
		userId = data.id;
		for(var i = 0; i < events.length; i++) {
			var newEvent = {
				ownerId : userId,
				title : events[i].summary,
				start : new Date(events[i].start.date),
				end : new Date(events[i].end.date)
			};
			googleEventRepository.add(newEvent, function(err, data){
				if(err) console.log(err);
				else console.log('Added to db: ' + data.title);
			});
		}
	});
	
};

var saveGoogleEvents = function(code, username){
	var auth = new googleAuth();
	var oauth2Client = new auth.OAuth2(googleConfig.clientId, googleConfig.clientSecret, googleConfig.redirectUrl);
	oauth2Client.getToken(code, function(err, token) {

		if (err) {
			console.log('Error while trying to retrieve access token ', err);
			return;
		}

		oauth2Client.credentials = token;

		getUserEvents(oauth2Client)
		.then(function(events) {
			addToDb(events, username);
		}, function(err){
			console.log('Getting google events error: ' + err);
		});
	});
};


module.exports = {
	save: saveGoogleEvents
};