var google = require('googleapis');
var googleAuth = require('google-auth-library');

module.exports = function(auth) {

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
			return;
		}
		var events = response.items;
		if (events.length === 0) {
			console.log('No upcoming calendars found.');
		} else {
			for (var i = 0; i < events.length; i++) {
				var event = events[i];
				console.log(event.summary);
			}
		}

	});

};