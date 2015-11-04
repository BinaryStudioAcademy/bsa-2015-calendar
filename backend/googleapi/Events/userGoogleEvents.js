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


var addToDb = function(events, user) {
	var deferred = q.defer();
	var googleEventIds = [];
	for(var i = 0; i < events.length; i++) {
		var newEvent = {
			ownerId : user.id,
			title : events[i].summary,
			start : new Date(events[i].start.date),
			end : new Date(events[i].end.date)
		};
		googleEventRepository.add(newEvent, function(err, data){
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			else {
				console.log('Added to db: ' + data.title);
				googleEventIds.push(data.id);
			}

			if(googleEventIds.length == events.length) {
				//console.log(googleEventIds);
				user.googleEvents = googleEventIds;
				userRepository.update(user.id, user);
			}
		});
	}
	deferred.resolve();
	return deferred.promise;
};

var clearUserEventsDb = function (eventIds) {
	for(var i = 0; i < eventIds.length; i++) {
		googleEventRepository.delete(eventIds[i], function (err, data) {
			if(err) {
				console.log(err);
			}
		});
	}
};

var saveGoogleEvents = function(code, username){
	//var deferred = q.defer();
/*
	if(userInfo.googleEvents && userInfo.googleEvents.length) {
		clearUserEventsDb(userInfo.googleEvents);
	}
*/
	userRepository.getByUsername(username, function(err, data){
		//console.log(err);
		//if(!err){
		var userId = data.id;
		var userData = data;
		var auth = new googleAuth();
		var oauth2Client = new auth.OAuth2(googleConfig.clientId, googleConfig.clientSecret, googleConfig.redirectUrl);
		//userRepository.update();
		oauth2Client.getToken(code, function(err, token) {

			if (err) {
				console.log('Error while trying to retrieve access token ', err);
				//deferred.reject(err);
				return;
			}

			console.log(token);

			oauth2Client.credentials = token;

			getUserEvents(oauth2Client)
			.then(function(events) {
				if(userData.googleEvents && userData.googleEvents.length){ 
					clearUserEventsDb(userData.googleEvents);
					console.log('Events removed');
				}
				addToDb(events, userData)
				.then(function() {
					userData.googleCode = code;	
					userRepository.update(userId, userData);
				});
				
			}, function(err){
				console.log('Getting google events error: ' + err);
				//deferred.reject(err);
			});

			//deferred.resolve();
			//return deferred;
		});
	});

	
};


module.exports = {
	save: saveGoogleEvents
};