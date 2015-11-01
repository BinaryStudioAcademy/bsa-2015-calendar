var google = require('googleapis');
var googleAuth = require('google-auth-library');
var googleConfig = require('./../../googleapi/googleConfig');
var userGoogleEvents = require('./../../googleapi/Events/userGoogleEvents');




module.exports = function (app) {

	app.post('/api/gAuth/', function (req, res, next) {
		var code = req.body.loginCode;
		var username = req.body.userInfo.username;
		userGoogleEvents.save(code, username);

		
	});	

};
