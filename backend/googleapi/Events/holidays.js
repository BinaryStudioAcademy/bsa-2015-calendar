var google = require('googleapis');
var googleAuth = require('google-auth-library');
var googleConfig = require('./../googleConfig');
//ru.ukrainian%23holiday%40group.v.calendar.google.com
function getUkrainianHolidays () {
	var calendar = google.calendar('v3');
 	calendar.events.list({
		key: googleConfig.api_key,
		calendarId: 'ru.ukrainian#holiday@group.v.calendar.google.com',
		/*timeMin: (new Date()).toISOString(),
		singleEvents: true,
		orderBy: 'startTime'*/
	}, function(err, response) {
		if (err) {
			console.log(err);
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

}

module.exports = function() {
	getUkrainianHolidays();
};
