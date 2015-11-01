var google = require('googleapis');
var googleAuth = require('google-auth-library');
var googleConfig = require('./../../googleapi/googleConfig');
var userGoogleEvents = require('./../../googleapi/Events/userEvents');




module.exports = function (app) {

	app.post('/api/gAuth/', function (req, res, next) {
		var code = req.body.loginCode;
		var userInfo = req.body.userInfo;
		var auth = new googleAuth();
  		var oauth2Client = new auth.OAuth2(googleConfig.clientId, googleConfig.clientSecret, googleConfig.redirectUrl);
		oauth2Client.getToken(code, function(err, token) {

			if (err) {
				console.log('Error while trying to retrieve access token ', err);
				return;
			}

			oauth2Client.credentials = token;

			userGoogleEvents.getUserEvents(oauth2Client).then(function(events) {
				userGoogleEvents.addToDb(events, userInfo);
			});
		});

		res.send({success : 'true'});
	});	

};
