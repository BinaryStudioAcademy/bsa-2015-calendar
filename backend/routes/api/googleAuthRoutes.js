var google = require('googleapis');
var googleAuth = require('google-auth-library');

var clientId = "1013963100544-qijt8dlanmurpfk3n50hf0pjqo3qkt4n.apps.googleusercontent.com";
//"1013963100544-681qo3s0m4mu8hl1sgdct4tsdd6p2khd.apps.googleusercontent.com";
var clientSecret = "0WTydKomXhPcZDBAdjWgys2I";
//"PJCn82-WoP6ujl2Q8Zi-WDN8";
var redirectUrl = "http://localhost:3080/googleAuth";
//"urn:ietf:wg:oauth:2.0:oob";
var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
//'ru.ukrainian#holiday@group.v.calendar.google.com'


function getUserEvents (auth) {
	var calendar = google.calendar('v3');
 	calendar.events.list({
		auth: auth,
		calendarId: 'primary',
		timeMin: (new Date()).toISOString(),
		singleEvents: true,
		orderBy: 'startTime'
	}, function(err, response) {
		if (err) {
			console.log('The API returned an error: ' + err);
			return;
		}
		var events = response.items;
		if (events.length === 0) {
			console.log('No upcoming calendars found.');
		} else {
			for (var i = 0; i < events.length; i++) {
				var event = events[i];
				console.log( event.summary);
			}
		}
	});
	
}

module.exports = function (app) {

	app.post('/api/gAuth', function (req, res, next) {

		var code = req.body.code;
		var auth = new googleAuth();
  		var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  		
  		console.log(code);

		oauth2Client.getToken(code, function(err, token) {

			if (err) {
				console.log('Error while trying to retrieve access token ', err);
				return;
			}

			oauth2Client.credentials = token;
			
			getUserEvents(oauth2Client);
		});

		res.send({success : 'true'});
	});	

};
