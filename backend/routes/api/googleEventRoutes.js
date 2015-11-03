var google = require('googleapis');
var googleAuth = require('google-auth-library');
var googleConfig = require('./../../googleapi/googleConfig');
var userGoogleEvents = require('./../../googleapi/Events/userGoogleEvents');
var userRepository = require('../../repositories/userRepository');




module.exports = function (app) {

	app.post('/api/gAuth/', function (req, res, next) {
		var code = req.body.loginCode;
		var username = req.body.username;
		/*var userId = userRepository.getByUsername(username, function () {
			// body...
		})*/
		userGoogleEvents.save(code, username);

		
	});	

};
